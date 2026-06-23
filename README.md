# Hustle AI Compass


A client-facing AI readiness diagnostic tool and lead-generation platform for Hustle Institute.

**Live flow:** Landing page → 14-question diagnostic → AI Readiness Score preview → Contact capture → PDF report emailed → Lead stored in Google Sheets

---

## Prerequisites

- Node.js 18+ and npm
- A Gmail account with 2FA enabled (for App Passwords)
- An Anthropic API key (claude.ai/api)
- A Google Cloud project with Sheets API enabled (optional but recommended)

---

## 1. Installation

```bash
cd hustle-ai-compass
npm install
cp .env.example .env.local
```

Then fill in the environment variables in `.env.local` (see sections below).

---

## 2. Claude API Setup

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account or sign in
3. Go to **API Keys** → Create a new key
4. Copy the key and set:

```
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 3. Gmail SMTP Setup (App Password)

Gmail requires an App Password for SMTP — you cannot use your regular password.

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (required)
3. Search for **"App passwords"** → Click it
4. Select app: **Mail** → Select device: **Other** → Name it "Hustle AI Compass"
5. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
6. Set in `.env.local`:

```
GMAIL_USER=hello@hustle.com.sg
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

> **Note:** Remove spaces from the app password when entering it.

---

## 4. Google Sheets Setup

### Step 1: Create the spreadsheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new sheet
2. Rename the default sheet tab to `Leads`
3. Add these headers in Row 1 (A1 through V1):

```
Timestamp | Name | Company | Email | Phone | Job Title | Industry | Company Size | Business Goal | AI Frequency | AI Level | Department | Dept Size | Pain Point | Time on Repetitive | Solve Problem | AI Concern | AI Openness | Desired Outcome | Score | Level | Remarks
```

4. Copy the **Sheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/`**`1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms`**`/edit`

### Step 2: Create a Google Cloud service account

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable the **Google Sheets API**: APIs & Services → Library → search "Sheets" → Enable
4. Go to **IAM & Admin** → **Service Accounts** → Create Service Account
5. Name it `hustle-ai-compass`, click Create
6. Grant role: **Editor** → Continue → Done
7. Click the service account → **Keys** tab → **Add Key** → JSON → Download

### Step 3: Share the sheet with the service account

1. Open the downloaded JSON file — find `client_email` (looks like `hustle-ai-compass@project.iam.gserviceaccount.com`)
2. In your Google Sheet, click **Share** → paste the service account email → **Editor** → Send

### Step 4: Set environment variables

```
GOOGLE_SHEET_ID=your_sheet_id_from_url
GOOGLE_SERVICE_ACCOUNT_EMAIL=hustle-ai-compass@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

> **Important:** Copy the `private_key` field from the JSON file exactly, replacing literal newlines with `\n`, and wrap the whole value in double quotes.

---

## 5. Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Test the full flow:
1. Visit the landing page
2. Click "Start Free Diagnosis" → complete the survey
3. See the score preview → enter your details → submit
4. Check your email for the PDF report
5. Check `hello@hustle.com.sg` for the internal lead notification
6. Check your Google Sheet for the new row

---

## 6. Deploying to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Hustle AI Compass"
git remote add origin https://github.com/yourusername/hustle-ai-compass.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Click **Deploy** (it will fail on first deploy — that's OK, we need to add env vars)

### Step 3: Add environment variables in Vercel

1. Go to your project dashboard → **Settings** → **Environment Variables**
2. Add each variable from `.env.local`:

| Variable | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic key |
| `GMAIL_USER` | hello@hustle.com.sg |
| `GMAIL_APP_PASSWORD` | Your 16-char app password |
| `GOOGLE_SHEET_ID` | Your sheet ID |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | service account email |
| `GOOGLE_PRIVATE_KEY` | Full private key (with `\n`) |
| `NEXT_PUBLIC_APP_URL` | https://ai-compass.hustle.com.sg |

> **Tip for GOOGLE_PRIVATE_KEY:** Paste the value with actual newlines in Vercel's UI (not `\n`) — Vercel handles it correctly.

### Step 4: Redeploy

After adding env vars: **Deployments** → click the latest → **Redeploy**

### Step 5: Custom domain (optional)

In Vercel: **Settings** → **Domains** → Add `ai-compass.hustle.com.sg`

Add a CNAME record in your DNS:
```
CNAME  ai-compass  cname.vercel-dns.com
```

---

## 7. Post-Deployment Checklist

- [ ] Complete the survey end-to-end on the live URL
- [ ] Verify PDF arrives in client email with correct content
- [ ] Verify internal notification arrives at hello@hustle.com.sg
- [ ] Verify lead row appears in Google Sheet
- [ ] Check that rate limiting works (submit 4 times from same IP — 4th should fail)
- [ ] Test on mobile device
- [ ] Confirm score calculation feels sensible for different input combinations

---

## 8. Project Structure

```
hustle-ai-compass/
├── app/
│   ├── page.tsx              Landing page
│   ├── survey/page.tsx       Interactive survey
│   ├── results/page.tsx      Score preview + contact form
│   ├── thank-you/page.tsx    Confirmation page
│   └── api/submit/route.ts   Main submission endpoint
├── components/
│   ├── Navbar.tsx
│   └── survey/
│       ├── ProgressBar.tsx
│       └── QuestionCard.tsx
├── lib/
│   ├── questions.ts          Survey questions + pain points
│   ├── scoring.ts            0-100 scoring algorithm
│   ├── report-generator.ts   Claude API report generation
│   ├── google-sheets.ts      Lead storage
│   ├── email.ts              Gmail SMTP emails
│   └── pdf-generator.tsx     @react-pdf A4 report
└── types/survey.ts           TypeScript interfaces
```

---

## 9. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| AI / Report Gen | Anthropic Claude (claude-opus-4-5) |
| PDF Generation | @react-pdf/renderer |
| Email | Nodemailer + Gmail SMTP |
| Database | Google Sheets API |
| Rate Limiting | rate-limiter-flexible (in-memory) |
| Validation | Zod |
| Deployment | Vercel |

---

## 10. Customisation

### Changing the AI model
In `lib/report-generator.ts`, update the `model` field:
```ts
model: 'claude-sonnet-4-6',  // faster and cheaper
```

### Adding more questions
In `lib/questions.ts`, add to the `QUESTIONS` array and update `SurveyAnswers` type in `types/survey.ts`.

### Adjusting scoring weights
Edit `lib/scoring.ts` — each scoring dimension is clearly labelled with its max score.

### Changing the internal notification email
In `lib/email.ts`, update the `to:` field in `sendInternalNotification`.

---

## Support

hello@hustle.com.sg · www.hustle.com.sg
