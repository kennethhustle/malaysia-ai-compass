import { google } from 'googleapis';
import { SurveyAnswers, ScoreResult, ContactDetails } from '@/types/survey';

export async function appendToGoogleSheet(
  contact: ContactDetails,
  answers: SurveyAnswers,
  score: ScoreResult
) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
    console.warn('Google Sheets env vars not configured — skipping sheet write');
    return;
  }

  // Normalise the private key — Vercel sometimes wraps it in extra quotes
  // or stores literal \n instead of real newlines.
  let privateKey = process.env.GOOGLE_PRIVATE_KEY!;
  privateKey = privateKey.replace(/^"+|"+$/g, ''); // strip any surrounding quotes
  privateKey = privateKey.replace(/\\n/g, '\n');   // convert escaped newlines

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  const sgTime = new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' });

  const row = [
    sgTime,
    contact.name,
    contact.company,
    contact.email,
    contact.phone,
    contact.jobTitle,
    contact.companyWebsite || '',
    answers.industry,
    answers.companySize,
    answers.businessGoal,
    answers.aiFrequency,
    answers.aiLevel,
    answers.department,
    answers.deptSize,
    answers.painPoint,
    answers.timeOnRepetitive,
    answers.solveProblem || '',
    answers.aiConcern,
    answers.aiOpenness,
    answers.desiredOutcome,
    score.total,
    score.level,
    contact.remarks || '',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Leads!A:W',
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  });
}
