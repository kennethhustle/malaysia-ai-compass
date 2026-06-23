import Anthropic from '@anthropic-ai/sdk';
import { SurveyAnswers, ScoreResult, ContactDetails } from '@/types/survey';

// ─── Hustle Malaysia Courses ──────────────────────────────────────────────────
const COURSES = [
  {
    name: 'Generative AI for Productivity',
    url: 'https://www.hustle.com.my/courses/generative-ai-for-productivity',
    tags: ['productivity', 'operations', 'management', 'hr', 'finance', 'general',
           'save time', 'reporting', 'admin', 'planning', 'writing', 'communication'],
  },
  {
    name: 'Generative AI for Content Creation',
    url: 'https://www.hustle.com.my/courses/generative-ai-for-content-creation',
    tags: ['marketing', 'creative', 'content', 'social media', 'captions', 'design',
           'campaign', 'create content faster', 'visual assets'],
  },
  {
    name: 'Generative AI for Video Creation',
    url: 'https://www.hustle.com.my/courses/generative-ai-for-video-creation',
    tags: ['marketing', 'video', 'reels', 'explainer', 'training video', 'creative',
           'product video', 'create content faster'],
  },
  {
    name: 'Generative AI for Digital Marketing',
    url: 'https://www.hustle.com.my/courses/generative-ai-for-digital-marketing',
    tags: ['marketing', 'digital marketing', 'campaign', 'ads', 'seo', 'content calendar',
           'lead generation', 'sales', 'paid ads', 'strategy'],
  },
  {
    name: 'Generative AI for Workflow Automation',
    url: 'https://www.hustle.com.my/courses/generative-ai-for-workflow-automation',
    tags: ['automation', 'operations', 'finance', 'hr', 'workflow', 'reduce manual errors',
           'save time', 'productivity', 'management', 'reporting', 'repetitive', 'manual',
           'process', 'efficiency', 'general', 'technology', 'approvals', 'coordination'],
    priority: 4, // baseline boost — always surfaced unless a specialist course is a stronger fit
  },
  {
    name: 'Generative AI for Chatbots and Customer Support',
    url: 'https://www.hustle.com.my/courses/generative-ai-for-chatbots',
    tags: ['customer service', 'sales', 'support', 'chatbot', 'improve customer response',
           'whatsapp', 'faq', 'lead qualification', 'knowledge base', 'enquiries'],
  },
];

function recommendCourses(answers: SurveyAnswers) {
  const dept = answers.department.toLowerCase();
  const goal = answers.businessGoal.toLowerCase();
  const outcome = answers.desiredOutcome.toLowerCase();
  const painPoint = answers.painPoint.toLowerCase();
  const solveProblem = (answers.solveProblem || '').toLowerCase();

  const scored = COURSES.map((course) => {
    let score = (course as any).priority ?? 0;
    course.tags.forEach((tag) => {
      if (dept.includes(tag)) score += 3;
      if (outcome.includes(tag)) score += 3;
      if (painPoint.includes(tag)) score += 2;
      if (goal.includes(tag)) score += 2;
      if (solveProblem.includes(tag)) score += 1;
      if (tag === 'general') score += 1;
    });
    return { ...course, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((c) => ({ name: c.name, url: c.url }));
}

export async function generateReportContent(
  answers: SurveyAnswers,
  score: ScoreResult,
  contact: ContactDetails
) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const recommendedCourses = recommendCourses(answers);
  const dateStr = new Date().toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' });

  const prompt = `You are a senior AI business consultant at Hustle Malaysia. Generate a detailed, personalised AI Opportunity Scan Report for this client. Be specific, practical, and Malaysia-business-relevant. Reference their actual industry, department, pain points, and what they want AI to solve. Avoid generic AI hype.

TONE RULES — CRITICAL:
- Write in direct, practical, business-friendly language
- Do NOT use: "leverage AI", "unlock the power of AI", "in today's fast-paced digital landscape", "streamline and optimise", "transform your business with AI", "game-changer"
- Instead: describe real workflow situations and concrete outcomes
- Example — BAD: "Your team can leverage AI to optimise sales workflows."
- Example — GOOD: "Your sales team is spending time on manual follow-ups. A practical first step is to use AI to draft replies, summarise conversations, and suggest the next action for each lead."
- Be specific to their Malaysian business context. Reference Malaysian business realities where relevant.

CLIENT CONTEXT:
- Name: ${contact.name} | Company: ${contact.company} | Job Title: ${contact.jobTitle}
- Industry: ${answers.industry} | Company Size: ${answers.companySize} employees
- Main Business Goal: ${answers.businessGoal}
- Department Prioritised: ${answers.department} (${answers.deptSize} staff)

AI ASSESSMENT:
- Score: ${score.total}/100 (${score.level})
- AI frequency: ${answers.aiFrequency}
- AI level: ${answers.aiLevel}
- Key workflow pain point: ${answers.painPoint}
- Time spent on repetitive work: ${answers.timeOnRepetitive}/week
- What AI should solve: ${answers.solveProblem || 'Not specified'}
- Main AI concern: ${answers.aiConcern}
- Team openness to AI: ${answers.aiOpenness}
- Most valued outcome: ${answers.desiredOutcome}

RECOMMENDED COURSES (use exactly these 3 in order):
1. ${recommendedCourses[0]?.name}
2. ${recommendedCourses[1]?.name}
3. ${recommendedCourses[2]?.name}

Return ONLY a valid JSON object with EXACTLY these keys (no markdown, no extra text, no trailing commas):

{
  "executiveSummary": "3-4 sentence executive summary specific to their company, industry, department and pain point. Reference what AI should solve if provided. Use practical language, not AI hype.",
  "currentWorkflow": "2-3 sentences describing how the ${answers.department} team currently operates and where the manual work sits. Be specific to their pain point and time spent.",
  "keyPainPoints": [
    { "category": "Primary challenge category name", "points": ["specific point 1", "specific point 2", "specific point 3"] },
    { "category": "Second challenge category", "points": ["point 1", "point 2", "point 3"] },
    { "category": "Third challenge category", "points": ["point 1", "point 2"] },
    { "category": "Fourth challenge category", "points": ["point 1", "point 2"] }
  ],
  "readinessSnapshot": {
    "dimensions": [
      { "name": "Dimension 1 relevant to ${answers.department}", "now": 1, "potential": 4 },
      { "name": "Dimension 2", "now": 2, "potential": 4 },
      { "name": "Dimension 3", "now": 1, "potential": 3 },
      { "name": "Dimension 4", "now": 2, "potential": 4 },
      { "name": "Dimension 5", "now": 1, "potential": 4 },
      { "name": "Dimension 6", "now": 1, "potential": 3 },
      { "name": "Dimension 7", "now": 2, "potential": 3 }
    ],
    "consultantInsight": "2-3 sentences about current state vs potential. Reference the gap specifically."
  },
  "recommendedUseCases": [
    { "title": "Use case title", "problem": "Current problem in 1-2 sentences", "solution": "Practical AI solution in 1-2 sentences — no hype phrases", "difficulty": "Medium", "impact": "High" },
    { "title": "Use case 2", "problem": "Problem", "solution": "Solution", "difficulty": "Low", "impact": "Medium" },
    { "title": "Use case 3", "problem": "Problem", "solution": "Solution", "difficulty": "Medium", "impact": "High" },
    { "title": "Use case 4", "problem": "Problem", "solution": "Solution", "difficulty": "Low", "impact": "Medium" },
    { "title": "Use case 5", "problem": "Problem", "solution": "Solution", "difficulty": "Medium", "impact": "Medium" },
    { "title": "Use case 6", "problem": "Problem", "solution": "Solution", "difficulty": "Low", "impact": "Medium" }
  ],
  "automationOpportunities": [
    { "workflow": "Workflow name", "currentProcess": "How it is done today in 1 sentence", "aiOpportunity": "How AI can help in 1 sentence — practical language", "timeSaving": "X-Y hours per week", "effort": "Medium" },
    { "workflow": "Workflow 2", "currentProcess": "Current process", "aiOpportunity": "AI opportunity", "timeSaving": "X-Y hours per week", "effort": "Low" },
    { "workflow": "Workflow 3", "currentProcess": "Current process", "aiOpportunity": "AI opportunity", "timeSaving": "X-Y hours per week", "effort": "Medium" },
    { "workflow": "Workflow 4", "currentProcess": "Current process", "aiOpportunity": "AI opportunity", "timeSaving": "X-Y hours per week", "effort": "Low" },
    { "workflow": "Workflow 5", "currentProcess": "Current process", "aiOpportunity": "AI opportunity", "timeSaving": "X-Y hours per week", "effort": "Low" }
  ],
  "priorityRoadmap": {
    "quickWins": [
      { "title": "Quick win 1 title", "description": "2-3 sentences on what to do, how to do it, and why it matters right now. Practical, specific." },
      { "title": "Quick win 2 title", "description": "2-3 sentences." },
      { "title": "Quick win 3 title", "description": "2-3 sentences." }
    ],
    "nextPhase": [
      { "title": "Next phase 1 title", "description": "2-3 sentences on what to build or implement." },
      { "title": "Next phase 2 title", "description": "2-3 sentences." },
      { "title": "Next phase 3 title", "description": "2-3 sentences." }
    ],
    "longerTerm": [
      { "title": "Longer term 1 title", "description": "2-3 sentences on strategic AI direction." },
      { "title": "Longer term 2 title", "description": "2-3 sentences." }
    ]
  },
  "nextSteps": [
    "Validate these findings with your key stakeholders and department lead.",
    "Identify the first workflow to improve — start with the highest-priority quick win.",
    "Select a small pilot team (3-5 people) to trial the first AI workflow or tool.",
    "Schedule relevant AI training for your team through Hustle Malaysia.",
    "Build and test your first AI-assisted workflow with a clear success metric.",
    "Review the outcomes after 4-6 weeks and decide where to scale next."
  ],
  "courseReasons": [
    "1-2 sentences on why course 1 fits their specific pain point and department situation — practical language",
    "1-2 sentences on why course 2 fits",
    "1-2 sentences on why course 3 fits"
  ],
  "courseWhoShouldAttend": [
    "Specific description of who in their team should attend course 1",
    "Who should attend course 2",
    "Who should attend course 3"
  ],
  "courseExpectedOutcomes": [
    "Specific expected outcome for their team after course 1 — what will they be able to do differently?",
    "Expected outcome for course 2",
    "Expected outcome for course 3"
  ],
  "suggestedTools": [
    { "workflow": "The single highest-impact workflow from automationOpportunities that Claude can most directly address", "toolName": "Claude", "category": "AI Assistant & Automation", "description": "Write 2 sentences specific to THIS company's pain point (${answers.painPoint}) and department (${answers.department}): first sentence — exactly what Claude does for that workflow; second sentence — the concrete time/quality benefit for their Malaysian team.", "pricing": "Free / USD$20/mo Pro", "url": "https://claude.ai" },
    { "workflow": "Workflow 2", "toolName": "Tool name", "category": "Category", "description": "Description", "pricing": "Pricing", "url": "https://..." },
    { "workflow": "Workflow 3", "toolName": "Tool name", "category": "Category", "description": "Description", "pricing": "Pricing", "url": "https://..." },
    { "workflow": "Workflow 4", "toolName": "Tool name", "category": "Category", "description": "Description", "pricing": "Pricing", "url": "https://..." },
    { "workflow": "Workflow 5", "toolName": "Tool name", "category": "Category", "description": "Description", "pricing": "Pricing", "url": "https://..." }
  ]
}

IMPORTANT RULES:
- suggestedTools MUST have exactly 5 items, one per automationOpportunity workflow
- suggestedTools[0] MUST always be Claude (claude.ai) — it is the primary recommended tool. Its description must be personalised to the client's specific pain point, department, and the workflow it is mapped to. Explain concretely how Claude solves their problem.
- suggestedTools[1-4] should complement Claude — pick from: Canva, Notion AI, Grammarly, Zapier, HubSpot, Salesforce Einstein, Microsoft Copilot, Google Workspace AI, Otter.ai, Fireflies.ai, Loom, Mailchimp AI — avoid niche or developer-only tools
- Do NOT suggest ChatGPT or Gemini — Claude is the preferred AI assistant recommendation
- suggestedTools workflow field must match the workflow names used in automationOpportunities
- suggestedTools pricing must be accurate and current (e.g. "Free / USD$20/mo Pro", "Free tier available", "From USD$9/mo")
- readinessSnapshot dimensions MUST be 7 items relevant to ${answers.department} department
- Use department-specific dimension labels, e.g.:
  - Sales: Lead Management, Follow-Up Speed, Proposal Creation, CRM Usage, Customer Insights, Automation Readiness, Team Adoption
  - Marketing: Content Planning, Design Capability, Video Production, Campaign Execution, Analytics and Reporting, Automation Readiness, Team Adoption
  - Customer Service: Response Speed, FAQ Handling, Chatbot Readiness, Customer Data Usage, Escalation Workflow, Automation Readiness, Team Adoption
  - HR: Recruitment Automation, Onboarding Efficiency, Staff Self-Service, Training Management, Policy Access, Automation Readiness, Team Adoption
  - Finance: Invoice Processing, Reporting Automation, Data Entry Reduction, Approval Speed, Exception Spotting, Automation Readiness, Team Adoption
  - Operations: SOP Accessibility, Task Coordination, Resource Planning, Reporting Efficiency, Process Standardisation, Automation Readiness, Team Adoption
  - Management: Team Visibility, Reporting Efficiency, Process Gap Identification, Decision Speed, AI Awareness, Automation Readiness, Team Adoption
- dimension "now" values: base on score ${score.total}/100. Score 0-20 → mostly 1s, 21-40 → 1-2s, 41-60 → 2-3s, 61-80 → 3-4s, 81-100 → 4-5s
- dimension "potential" values: always 1-2 higher than now, max 5
- difficulty must be exactly "Low", "Medium", or "High"
- impact must be exactly "Low", "Medium", or "High"
- effort must be exactly "Low", "Medium", or "High"
- All strings must be properly escaped for JSON
- Return ONLY the JSON object, nothing else`;

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 5000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to extract JSON from Claude response');

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    executiveSummary: parsed.executiveSummary as string,
    currentWorkflow: parsed.currentWorkflow as string,
    keyPainPoints: parsed.keyPainPoints as Array<{ category: string; points: string[] }>,
    readinessSnapshot: parsed.readinessSnapshot as {
      dimensions: Array<{ name: string; now: number; potential: number }>;
      consultantInsight: string;
    },
    recommendedUseCases: parsed.recommendedUseCases as Array<{
      title: string;
      problem: string;
      solution: string;
      difficulty: 'Low' | 'Medium' | 'High';
      impact: 'Low' | 'Medium' | 'High';
    }>,
    automationOpportunities: parsed.automationOpportunities as Array<{
      workflow: string;
      currentProcess: string;
      aiOpportunity: string;
      timeSaving: string;
      effort: 'Low' | 'Medium' | 'High';
    }>,
    priorityRoadmap: parsed.priorityRoadmap as {
      quickWins: Array<{ title: string; description: string }>;
      nextPhase: Array<{ title: string; description: string }>;
      longerTerm: Array<{ title: string; description: string }>;
    },
    nextSteps: parsed.nextSteps as string[],
    recommendedCourses: recommendedCourses.map((course, i) => ({
      ...course,
      reason: parsed.courseReasons?.[i] ?? `Recommended for the ${answers.department} team.`,
      whoShouldAttend: parsed.courseWhoShouldAttend?.[i] ?? `The ${answers.department} team.`,
      expectedOutcome: parsed.courseExpectedOutcomes?.[i] ?? 'Improved AI capability across the team.',
    })),
    suggestedTools: (parsed.suggestedTools ?? []) as Array<{
      workflow: string;
      toolName: string;
      category: string;
      description: string;
      pricing: string;
      url: string;
    }>,
  };
}
