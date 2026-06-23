import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateReportContent } from '@/lib/report-generator';
import { appendToGoogleSheet } from '@/lib/google-sheets';
import { sendClientEmail, sendInternalNotification } from '@/lib/email';
import { launchBrowser, renderPDF } from '@/lib/pdf-generator';
import { calculateScore } from '@/lib/scoring';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { ReportData } from '@/types/survey';

// Bump timeout to Vercel Pro max — PDF generation needs it
export const maxDuration = 300;

// Rate limiter: 3 submissions per IP per hour
const rateLimiter = new RateLimiterMemory({ points: 3, duration: 3600 });

const ContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  company: z.string().min(1, 'Company is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(6, 'Phone number is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  companyWebsite: z.string().optional().default(''),
  remarks: z.string().optional().default(''),
  consent: z.boolean().refine((v) => v === true, { message: 'Consent is required' }),
});

const AnswersSchema = z.object({
  companyName: z.string().min(1),
  industry: z.string().min(1),
  companySize: z.string().min(1),
  businessGoal: z.string().min(1),
  aiFrequency: z.string().min(1),
  aiLevel: z.string().min(1),
  department: z.string().min(1),
  deptSize: z.string().min(1),
  painPoint: z.string().min(1),
  timeOnRepetitive: z.string().min(1),
  solveProblem: z.string().optional().default(''),
  aiConcern: z.string().min(1),
  aiOpenness: z.string().min(1),
  desiredOutcome: z.string().min(1),
});

const SubmitSchema = z.object({ answers: AnswersSchema, contact: ContactSchema });

export async function POST(req: NextRequest) {
  // Rate limiting
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : (req.headers.get('x-real-ip') ?? 'unknown');
  try {
    await rateLimiter.consume(ip);
  } catch {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again in an hour.' },
      { status: 429 }
    );
  }

  // Parse + validate
  let rawBody: unknown;
  try { rawBody = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid request body' }, { status: 400 }); }

  const parsed = SubmitSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }

  const { answers, contact } = parsed.data as any;

  let browser: any;
  try {
    const score = calculateScore(answers);

    // Generate report content first, then connect browser immediately before use.
    // (Browserless closes idle WebSocket connections — don't connect until needed.)
    const reportContent = await generateReportContent(answers, score, contact);

    const reportData: ReportData = { contact, answers, score, reportContent };

    browser = await launchBrowser();
    const pdfBuffer = await renderPDF(reportData, browser);

    // ── Run all post-PDF tasks in parallel ──
    await Promise.allSettled([
      sendClientEmail(reportData, pdfBuffer).catch(e =>
        console.error('[Email] Client email failed (non-fatal):', e)
      ),
      sendInternalNotification(contact, answers, score).catch(e =>
        console.error('[Email] Internal notification failed (non-fatal):', e)
      ),
      appendToGoogleSheet(contact, answers, score).catch(e =>
        console.error('[Google Sheets] Non-fatal error:', e)
      ),
    ]);

    return NextResponse.json({ success: true, score: score.total, level: score.level });

  } catch (error) {
    console.error('[Submit API] Error:', error);
    return NextResponse.json(
      { error: 'Report generation failed. Please try again.' },
      { status: 500 }
    );
  } finally {
    // Always close the browser, even if an error occurred
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
