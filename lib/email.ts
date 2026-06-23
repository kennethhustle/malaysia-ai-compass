import nodemailer from 'nodemailer';
import { ContactDetails, SurveyAnswers, ScoreResult, ReportData } from '@/types/survey';

function createTransport() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_APP_PASSWORD!,
    },
  });
}

function getLevelBadgeColor(level: string): string {
  switch (level) {
    case 'Not Started':   return '#6B7280';
    case 'Early Stage':   return '#F59E0B';
    case 'Developing':    return '#3B82F6';
    case 'Progressing':   return '#8B5CF6';
    case 'AI-Ready Team': return '#059669';
    default:              return '#6B7280';
  }
}

export function buildClientEmailText(data: ReportData): string {
  const { contact, answers, score } = data;

  return `
HUSTLE AI COMPASS — AI READINESS REPORT
========================================

Hi ${contact.name},

Thank you for completing the Hustle Malaysia AI Opportunity Scan. Your personalised AI Opportunity Scan Report is attached to this email as a PDF.

The report covers your team's current AI readiness, key workflow opportunities, and recommended next steps tailored to the ${answers.department} team at ${contact.company}.

WHAT'S INSIDE YOUR REPORT
--------------------------
• Current AI Readiness Level — A clear score and rating of where your team stands today.
• Key Workflow Opportunities — The specific workflows where AI can save the most time.
• Priority Roadmap — A phased plan from quick wins to longer-term AI strategy.
• Training Pathway — Recommended Hustle courses matched to your team's needs.

YOUR AI READINESS SNAPSHOT
--------------------------
Company:         ${contact.company}
Score:           ${score.total} / 100
Readiness Level: ${score.level}
Priority Team:   ${answers.department}

Our team will review your results and may reach out with tailored recommendations for ${contact.company}.

WHAT HAPPENS NEXT
-----------------
1. Review your report
   Open the attached PDF and read through your personalised AI Business Diagnostic Report.

2. Identify your first opportunity
   Pick one workflow from your report where AI can save your team the most time.

3. Connect with Hustle
   Our team is here to help you explore the right AI training pathway for your organisation.

Explore AI Training for Teams: https://www.hustle.com.my/for-business

--
Hustle Malaysia
Kuala Lumpur, Malaysia
Email: hello@hustle.com.my | Web: www.hustle.com.my

This report is prepared for the intended recipient only. No part of this report may be
reproduced, distributed, or shared externally without prior written consent from Hustle Malaysia.
`.trim();
}

export function buildClientEmailHtml(data: ReportData): string {
  const { contact, answers, score } = data;

  const levelColor = getLevelBadgeColor(score.level);

  // ─── Asset URLs ────────────────────────────────────────────────────────────
  // LOGO: CDN-hosted. Swap HUSTLE_LOGO_URL for a Hustle Malaysia branded logo URL when available.
  const HUSTLE_LOGO_URL = 'https://cdn.prod.website-files.com/69a817c94060f9d4bfb1c760/6a30a0c6900167ff555ac11e_Hustle%20Singapore%20(B%26W%20Logo).png';
  // HERO: direct Pexels CDN image URL (not the page URL). Swap for your own hosted image if preferred.
  const HERO_IMAGE_URL = 'https://images.pexels.com/photos/20123842/pexels-photo-20123842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // Font shorthand to keep inline styles DRY
  const FONT = 'Urbanist, Arial, Helvetica, sans-serif';

  // ─── Feature rows ─────────────────────────────────────────────────────────
  const features = [
    { icon: '📊', title: 'Current AI Readiness Level', desc: 'A clear score and rating of where your team stands today.' },
    { icon: '⚡', title: 'Key Workflow Opportunities',  desc: 'The specific workflows where AI can save the most time.' },
    { icon: '🗺️', title: 'Priority Roadmap',             desc: 'A phased plan from quick wins to longer-term AI strategy.' },
    { icon: '🎓', title: 'Training Pathway',             desc: 'Recommended Hustle courses matched to your team\'s needs.' },
  ];

  // ─── Next-step rows ────────────────────────────────────────────────────────
  const steps = [
    { title: 'Review your report',            desc: 'Open the attached PDF and read through your personalised AI Business Diagnostic Report.' },
    { title: 'Identify your first opportunity', desc: 'Pick one workflow from your report where AI can save your team the most time.' },
    { title: 'Connect with Hustle',            desc: 'Our team is here to help you explore the right AI training pathway for your organisation.' },
  ];

  return `<!DOCTYPE html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no">
<title>Your Hustle AI Opportunity Scan Report Is Ready</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style type="text/css">
  @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800&display=swap');
  html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
  body { -webkit-font-smoothing: antialiased; background-color: #edeae5; }
  img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
  table { border-collapse: collapse; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  h1, h2, h3, p { margin: 0; word-break: break-word; }
  a[x-apple-data-detectors] {
    color: inherit !important; text-decoration: none !important;
    font-size: inherit !important; font-family: inherit !important;
    font-weight: inherit !important; line-height: inherit !important;
  }
  div[style*="margin: 16px 0;"] { margin: 0 !important; }
  @media only screen and (max-width: 640px) {
    .wrapper   { width: 100% !important; }
    .sp        { padding: 36px 24px !important; }
    .hero-cell { min-height: 480px !important; padding: 36px 24px 48px !important; }
    .h-logo    { width: 88px !important; }
    .h-title   { font-size: 28px !important; }
    .stat-col  { display: block !important; width: 100% !important; padding: 0 0 12px 0 !important; }
    .cta-a     { display: block !important; width: auto !important; text-align: center !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#edeae5;">

<!-- ─── Preheader (hidden preview text) ────────────────────────────────── -->
<div style="display:none;font-size:1px;color:#edeae5;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
  Your personalised AI readiness report is attached — here&apos;s what&apos;s inside.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

<!-- ─── Outer table ──────────────────────────────────────────────────────── -->
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#edeae5;">
<tr><td align="center" style="padding:0;">

  <!-- 640px container -->
  <table class="wrapper" role="presentation" cellspacing="0" cellpadding="0" border="0" width="640" style="max-width:640px;background-color:#ffffff;">

    <!-- ═══════════════════════════════════════════════════════════════════
         HERO — tall image block, gradient fade dark→transparent→cream
         ═══════════════════════════════════════════════════════════════════ -->
    <tr>
      <td style="padding:0;font-size:0;line-height:0;">

        <!-- VML background image for Outlook (dark fallback bg, no gradient) -->
        <!--[if gte mso 9]>
        <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"
          style="width:640px;height:610px;">
          <v:fill type="frame" src="${HERO_IMAGE_URL}" color="#111111"/>
          <v:textbox inset="0,0,0,0">
        <![endif]-->

        <!-- Modern-client block: multi-stop gradient over background-image -->
        <div style="
          background-image:
            linear-gradient(to bottom,
              rgba(10,10,10,0.72)  0%,
              rgba(10,10,10,0.40) 38%,
              rgba(10,10,10,0.10) 64%,
              rgba(250,249,247,0.85) 90%,
              rgba(250,249,247,1.00) 100%
            ),
            url('${HERO_IMAGE_URL}');
          background-size: cover;
          background-position: center bottom;
          background-color: #111111;
          min-height: 610px;
        ">
          <table class="hero-cell" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <!-- Logo row: sits on the dark overlay -->
            <tr>
              <td style="padding:48px 52px 0;">
                <img class="h-logo" src="${HUSTLE_LOGO_URL}" width="118" alt="hustle."
                  style="display:block;max-width:118px;height:auto;">
              </td>
            </tr>
            <!-- Spacer: photo visible through transparent middle band -->
            <tr><td style="height:180px;line-height:180px;">&nbsp;</td></tr>
            <!-- Headline row: sits on the cream fade -->
            <tr>
              <td style="padding:0 52px 56px;">
                <h1 class="h-title" style="
                  font-family:${FONT};
                  color:#ffffff;
                  font-size:40px;
                  font-weight:800;
                  line-height:1.12;
                  letter-spacing:-0.8px;
                  margin:0 0 18px;
                ">Your AI Opportunity Scan<br>Report Is Ready</h1>
                <p style="
                  font-family:${FONT};
                  color:rgba(255,255,255,0.85);
                  font-size:16px;
                  font-weight:400;
                  line-height:1.65;
                  margin:0;
                  max-width:460px;
                ">A personalised snapshot of where your team stands today — and where AI can create the biggest impact next.</p>
              </td>
            </tr>
          </table>
        </div>

        <!--[if gte mso 9]>
          </v:textbox>
        </v:rect>
        <![endif]-->
      </td>
    </tr>

    <!-- ═══════════════════════════════════════════════════════════════════
         GREETING
         ═══════════════════════════════════════════════════════════════════ -->
    <tr>
      <td class="sp" style="background-color:#ffffff;padding:52px 52px 44px;border-bottom:1px solid #ece8e2;">
        <p style="font-family:${FONT};font-size:21px;font-weight:700;color:#1c1c1c;margin:0 0 20px;">Hi ${esc(contact.name)},</p>
        <p style="font-family:${FONT};font-size:16px;font-weight:400;color:#3d3d3d;line-height:1.72;margin:0 0 16px;">
          Thank you for completing the <strong>Hustle AI Compass</strong> diagnostic. Your personalised AI Opportunity Scan Report is attached to this email as a PDF.
        </p>
        <p style="font-family:${FONT};font-size:16px;font-weight:400;color:#3d3d3d;line-height:1.72;margin:0;">
          The report covers your team&apos;s current AI readiness, key workflow opportunities, and recommended next steps — tailored to the <strong>${esc(answers.department)}</strong> team at <strong>${esc(contact.company)}</strong>.
        </p>
      </td>
    </tr>

    <!-- ═══════════════════════════════════════════════════════════════════
         WHAT'S INSIDE
         ═══════════════════════════════════════════════════════════════════ -->
    <tr>
      <td class="sp" style="background-color:#faf8f5;padding:52px 52px 44px;">
        <p style="font-family:${FONT};font-size:11px;font-weight:700;color:#ff5c00;letter-spacing:2.5px;text-transform:uppercase;margin:0 0 14px;">What&apos;s Inside Your Report</p>
        <h2 style="font-family:${FONT};font-size:26px;font-weight:800;color:#1c1c1c;line-height:1.18;margin:0 0 36px;">Everything you need to<br>start your AI journey</h2>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          ${features.map((f, i) => `
          <tr>
            <td width="52" valign="top" style="padding:${i > 0 ? '28' : '0'}px 18px ${i < features.length - 1 ? '28' : '0'}px 0;">
              <div style="width:46px;height:46px;background:#fff0e6;border-radius:12px;text-align:center;line-height:46px;font-size:20px;">${f.icon}</div>
            </td>
            <td valign="top" style="padding:${i > 0 ? '28' : '0'}px 0 ${i < features.length - 1 ? '28' : '0'}px;${i < features.length - 1 ? 'border-bottom:1px solid #ece8e2;' : ''}">
              <p style="font-family:${FONT};font-size:15px;font-weight:700;color:#1c1c1c;margin:0 0 5px;">${f.title}</p>
              <p style="font-family:${FONT};font-size:14px;font-weight:400;color:#6b7280;line-height:1.55;margin:0;">${f.desc}</p>
            </td>
          </tr>`).join('')}
        </table>
      </td>
    </tr>

    <!-- ═══════════════════════════════════════════════════════════════════
         AI READINESS SNAPSHOT
         ═══════════════════════════════════════════════════════════════════ -->
    <tr>
      <td class="sp" style="background-color:#ffffff;padding:52px 52px 44px;border-top:1px solid #ece8e2;border-bottom:1px solid #ece8e2;">
        <p style="font-family:${FONT};font-size:11px;font-weight:700;color:#ff5c00;letter-spacing:2.5px;text-transform:uppercase;margin:0 0 14px;">Your AI Readiness Snapshot</p>
        <h2 style="font-family:${FONT};font-size:26px;font-weight:800;color:#1c1c1c;line-height:1.18;margin:0 0 32px;">Here&apos;s how ${esc(contact.company)} scored</h2>

        <!-- 2 × 2 stat grid -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td class="stat-col" width="48%" valign="top" style="padding:0 2% 14px 0;">
              <div style="background:#f5f3ef;border-radius:12px;padding:20px 22px;">
                <p style="font-family:${FONT};font-size:10px;font-weight:700;color:#a5a09a;letter-spacing:1.8px;text-transform:uppercase;margin:0 0 9px;">Company</p>
                <p style="font-family:${FONT};font-size:17px;font-weight:700;color:#1c1c1c;line-height:1.3;margin:0;">${esc(contact.company)}</p>
              </div>
            </td>
            <td class="stat-col" width="48%" valign="top" style="padding:0 0 14px 2%;">
              <div style="background:#f5f3ef;border-radius:12px;padding:20px 22px;">
                <p style="font-family:${FONT};font-size:10px;font-weight:700;color:#a5a09a;letter-spacing:1.8px;text-transform:uppercase;margin:0 0 9px;">Overall Score</p>
                <p style="font-family:${FONT};font-size:17px;font-weight:700;color:#ff5c00;margin:0;">${score.total} <span style="font-size:13px;color:#a5a09a;font-weight:500;">/ 100</span></p>
              </div>
            </td>
          </tr>
          <tr>
            <td class="stat-col" width="48%" valign="top" style="padding:0 2% 0 0;">
              <div style="background:#f5f3ef;border-radius:12px;padding:20px 22px;">
                <p style="font-family:${FONT};font-size:10px;font-weight:700;color:#a5a09a;letter-spacing:1.8px;text-transform:uppercase;margin:0 0 10px;">Readiness Level</p>
                <span style="display:inline-block;background:${levelColor};color:#fff;font-family:${FONT};font-size:12px;font-weight:700;padding:4px 14px;border-radius:20px;">${esc(score.level)}</span>
              </div>
            </td>
            <td class="stat-col" width="48%" valign="top" style="padding:0 0 0 2%;">
              <div style="background:#f5f3ef;border-radius:12px;padding:20px 22px;">
                <p style="font-family:${FONT};font-size:10px;font-weight:700;color:#a5a09a;letter-spacing:1.8px;text-transform:uppercase;margin:0 0 9px;">Priority Team</p>
                <p style="font-family:${FONT};font-size:17px;font-weight:700;color:#1c1c1c;line-height:1.3;margin:0;">${esc(answers.department)}</p>
              </div>
            </td>
          </tr>
        </table>

        <p style="font-family:${FONT};font-size:13px;font-weight:400;color:#a5a09a;font-style:italic;line-height:1.6;margin:28px 0 0;padding-top:22px;border-top:1px solid #ece8e2;">
          Our team will review your results and may reach out with tailored recommendations for ${esc(contact.company)}.
        </p>
      </td>
    </tr>

    <!-- ═══════════════════════════════════════════════════════════════════
         WHAT HAPPENS NEXT
         ═══════════════════════════════════════════════════════════════════ -->
    <tr>
      <td class="sp" style="background-color:#faf8f5;padding:52px 52px 44px;">
        <p style="font-family:${FONT};font-size:11px;font-weight:700;color:#ff5c00;letter-spacing:2.5px;text-transform:uppercase;margin:0 0 14px;">What Happens Next</p>
        <h2 style="font-family:${FONT};font-size:26px;font-weight:800;color:#1c1c1c;line-height:1.18;margin:0 0 36px;">Three steps to get started</h2>
        ${steps.map((s, i) => `
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:${i < steps.length - 1 ? '28' : '0'}px;">
          <tr>
            <td width="52" valign="top" style="padding-right:20px;">
              <div style="width:42px;height:42px;background:#ff5c00;border-radius:50%;text-align:center;line-height:42px;font-family:${FONT};font-size:17px;font-weight:800;color:#fff;">${i + 1}</div>
            </td>
            <td valign="top" style="${i < steps.length - 1 ? 'padding-bottom:28px;border-bottom:1px solid #ece8e2;' : ''}">
              <p style="font-family:${FONT};font-size:16px;font-weight:700;color:#1c1c1c;margin:0 0 6px;">${s.title}</p>
              <p style="font-family:${FONT};font-size:14px;font-weight:400;color:#6b7280;line-height:1.6;margin:0;">${s.desc}</p>
            </td>
          </tr>
        </table>`).join('')}
      </td>
    </tr>

    <!-- ═══════════════════════════════════════════════════════════════════
         CTA
         ═══════════════════════════════════════════════════════════════════ -->
    <tr>
      <td class="sp" style="background-color:#ffffff;padding:52px 52px;text-align:center;border-top:1px solid #ece8e2;">
        <p style="font-family:${FONT};font-size:19px;font-weight:700;color:#1c1c1c;margin:0 0 10px;">Ready to upskill your team?</p>
        <p style="font-family:${FONT};font-size:15px;font-weight:400;color:#6b7280;line-height:1.65;margin:0 0 36px;max-width:400px;margin-left:auto;margin-right:auto;">Explore our AI training programmes designed for business teams in Malaysia.</p>

        <!-- VML button for Outlook -->
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
          href="https://www.hustle.com.my/for-business"
          style="height:54px;v-text-anchor:middle;width:320px;" arcsize="15%" stroke="f" fillcolor="#ff5c00">
          <w:anchorlock/>
          <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:bold;">Explore AI Training for Teams</center>
        </v:roundrect>
        <![endif]-->
        <!--[if !mso]><!-->
        <a class="cta-a" href="https://www.hustle.com.my/for-business" target="_blank" style="
          display:inline-block;
          background-color:#ff5c00;
          color:#ffffff;
          font-family:${FONT};
          font-size:16px;
          font-weight:700;
          text-decoration:none;
          padding:17px 44px;
          border-radius:8px;
          letter-spacing:0.2px;
          mso-hide:all;
        ">Explore AI Training for Teams</a>
        <!--<![endif]-->
      </td>
    </tr>

    <!-- ═══════════════════════════════════════════════════════════════════
         FOOTER
         ═══════════════════════════════════════════════════════════════════ -->
    <tr>
      <td style="background-color:#ffffff;padding:20px 52px 14px;text-align:center;border-top:1px solid #ece8e2;">
        <p style="font-family:${FONT};font-size:13px;font-weight:600;color:#1c1c1c;margin:0 0 8px;">Hustle Malaysia</p>
        <p style="font-family:${FONT};font-size:12px;font-weight:400;color:#6b7280;line-height:1.65;margin:0 0 8px;">Kuala Lumpur, Malaysia</p>
        <p style="font-family:${FONT};font-size:12px;font-weight:400;color:#6b7280;line-height:1.65;margin:0 0 24px;">
          Tel:&nbsp;<a href="tel:62350533" style="color:#6b7280;text-decoration:none;">6235 0533</a>
          &nbsp;&middot;&nbsp;
          <a href="mailto:hello@hustle.com.my" style="color:#6b7280;text-decoration:none;">hello@hustle.com.my</a>
          &nbsp;&middot;&nbsp;
          <a href="https://www.hustle.com.my" target="_blank" style="color:#6b7280;text-decoration:none;">www.hustle.com.my</a>
        </p>
        <p style="font-family:${FONT};font-size:11px;font-weight:400;color:#9ca3af;line-height:1.7;margin:0;max-width:460px;margin-left:auto;margin-right:auto;">
          This report is prepared for the intended recipient only. No part of this report may be reproduced, distributed, or shared externally without prior written consent from Hustle Malaysia.
        </p>
      </td>
    </tr>

  </table>
  <!-- /640px container -->

</td></tr>
</table>
<!-- /outer table -->

</body>
</html>`;
}

export async function sendClientEmail(data: ReportData, pdfBuffer: Buffer) {
  const { contact } = data;
  const transporter = createTransport();

  await transporter.sendMail({
    from: `${process.env.GMAIL_USER}>${process.env.GMAIL_USER}>`,
    to: contact.email,
    bcc: 'kenneth@hustle.com.my',
    subject: 'Your Hustle Malaysia AI Opportunity Scan Report Is Ready',
    html: buildClientEmailHtml(data),
    text: buildClientEmailText(data),
    attachments: [
      {
        filename: `Hustle-Malaysia-AI-Opportunity-Scan-Report-${contact.company.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}

export async function sendInternalNotification(
  contact: ContactDetails,
  answers: SurveyAnswers,
  score: ScoreResult
) {
  const transporter = createTransport();
  const sgTime = new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' });

  const row = (label: string, value: string, highlight = false) =>
    `<tr style="${highlight ? 'background: #fff7ed;' : ''}">
      <td style="padding: 9px 14px; border: 1px solid #e5e7eb; font-size: 13px; color: #6b7280; white-space: nowrap; font-weight: 500;">${label}</td>
      <td style="padding: 9px 14px; border: 1px solid #e5e7eb; font-size: 13px; color: #1c1c1c; ${highlight ? 'font-weight: 700; color: #ff5c00;' : ''}">${value}</td>
    </tr>`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 24px;">
      <div style="background: #1c1c1c; padding: 20px 24px; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">
        <span style="color: #fff; font-weight: 700; font-size: 16px;">New MY AI Compass Lead</span>
        <span style="color: #9ca3af; font-size: 13px;">${sgTime} SGT</span>
      </div>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-top: none;">
        ${row('Name', contact.name)}
        ${row('Company', contact.company)}
        ${row('Email', contact.email)}
        ${row('Phone', contact.phone)}
        ${row('Job Title', contact.jobTitle)}
        ${contact.companyWebsite ? row('Company Website', contact.companyWebsite) : ''}
        ${row('Industry', answers.industry)}
        ${row('Company Size', `${answers.companySize} employees`)}
        ${row('AI Readiness Score', `${score.total}/100 — ${score.level}`, true)}
        ${row('Business Goal', answers.businessGoal)}
        ${row('AI Frequency', answers.aiFrequency)}
        ${row('AI Level', answers.aiLevel)}
        ${row('Priority Department', `${answers.department} (${answers.deptSize} staff)`)}
        ${row('Main Pain Point', answers.painPoint)}
        ${row('Time on Repetitive Work', `${answers.timeOnRepetitive}/week`)}
        ${row('What AI Should Solve', answers.solveProblem || '—')}
        ${row('Main AI Concern', answers.aiConcern)}
        ${row('Team Openness', answers.aiOpenness)}
        ${row('Desired Outcome', answers.desiredOutcome)}
        ${contact.remarks ? row('Remarks', contact.remarks) : ''}
      </table>
      <div style="padding: 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="margin: 0; font-size: 12px; color: #6b7280;">Generated by Hustle AI Compass · Report sent to ${contact.email}</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `${process.env.GMAIL_USER}>${process.env.GMAIL_USER}>`,
    to: 'hello@hustle.com.my',
    subject: `[New Lead] ${contact.name} — ${contact.company} · Score: ${score.total}/100 (${score.level})`,
    html,
  });
}
