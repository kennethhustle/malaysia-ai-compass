import { SurveyAnswers } from '@/types/survey';

export interface Question {
  id: keyof SurveyAnswers;
  section: string;
  sectionIndex: number;
  question: string;
  type: 'text' | 'select' | 'dynamic-select';
  options?: string[];
  placeholder?: string;
  required: boolean;
  microcopy?: string;
}

export const SECTIONS = [
  'Company Profile',
  'Current AI Usage',
  'Department Focus',
  'Workflow Pain Points',
  'Team Readiness',
  'Business Impact',
];

export const SECTION_COLORS: Record<string, string> = {
  'Company Profile': '#6D28D9',
  'Current AI Usage': '#2563EB',
  'Department Focus': '#0891B2',
  'Workflow Pain Points': '#D97706',
  'Team Readiness': '#DC2626',
  'Business Impact': '#10B981',
};

export const PAIN_POINTS: Record<string, string[]> = {
  Sales: [
    'Lead follow-up is too manual',
    'Proposals take too long to prepare',
    'Customer data is scattered',
    'Sales reporting is time-consuming',
    'Hard to prioritise leads',
  ],
  Marketing: [
    'Content creation takes too much time',
    'Design output is inconsistent',
    'Campaign planning is manual',
    'Video production is slow',
    'Reporting and analysis take too long',
  ],
  'Customer Service': [
    'Too many repeated enquiries',
    'Response time is slow',
    'No proper FAQ system',
    'Difficult to track customer issues',
    'Escalation process is unclear',
  ],
  HR: [
    'Recruitment screening takes too long',
    'Onboarding is too manual',
    'Staff questions are repeated',
    'Policies are hard to find',
    'Training needs are unclear',
  ],
  Finance: [
    'Invoice or payment checking is manual',
    'Reporting takes too long',
    'Data entry is repetitive',
    'Approvals are slow',
    'Difficult to spot exceptions',
  ],
  Operations: [
    'SOPs are hard to access',
    'Task coordination is manual',
    'Reporting is time-consuming',
    'Resources are hard to plan',
    'Processes depend too much on individuals',
  ],
  Management: [
    'No clear visibility across teams',
    'Reports take too long to prepare',
    'Difficult to identify process gaps',
    'Team productivity is inconsistent',
    'Hard to decide where AI should start',
  ],
};

export const QUESTIONS: Question[] = [
  {
    id: 'companyName',
    section: 'Company Profile',
    sectionIndex: 0,
    question: 'What is your company name?',
    type: 'text',
    placeholder: 'e.g. Acme Sdn Bhd',
    required: true,
  },
  {
    id: 'industry',
    section: 'Company Profile',
    sectionIndex: 0,
    question: 'What industry are you in?',
    type: 'select',
    options: [
      'F&B / Hospitality',
      'Retail / E-commerce',
      'Finance / Insurance',
      'Healthcare / Wellness',
      'Technology / Software',
      'Education / Training',
      'Manufacturing / Logistics',
      'Marketing / Media / Creative',
      'Professional Services',
      'Government / Non-profit',
      'Other',
    ],
    required: true,
  },
  {
    id: 'companySize',
    section: 'Company Profile',
    sectionIndex: 0,
    question: 'How many employees are in your company?',
    type: 'select',
    options: ['1-5', '6-10', '11-20', '21-50', '51-100', '100+'],
    required: true,
  },
  {
    id: 'businessGoal',
    section: 'Company Profile',
    sectionIndex: 0,
    question: 'What is your main business goal right now?',
    type: 'select',
    options: [
      'Increase sales',
      'Reduce manpower cost',
      'Improve efficiency',
      'Improve customer service',
      'Build SOP system',
      'Improve reporting',
    ],
    required: true,
  },
  {
    id: 'aiFrequency',
    section: 'Current AI Usage',
    sectionIndex: 1,
    question: 'How often does your team currently use AI tools?',
    type: 'select',
    options: ['Daily', 'Weekly', 'Occasionally', 'Never'],
    required: true,
  },
  {
    id: 'aiLevel',
    section: 'Current AI Usage',
    sectionIndex: 1,
    question: "Which best describes your team's current AI level?",
    type: 'select',
    options: [
      'We have not started',
      'A few staff are experimenting',
      'Some teams use AI for simple tasks',
      'AI is used regularly in certain workflows',
      'We already have AI-enabled processes',
    ],
    required: true,
  },
  {
    id: 'department',
    section: 'Department Focus',
    sectionIndex: 2,
    question: 'Which department needs AI support first?',
    type: 'select',
    options: ['Sales', 'Marketing', 'Customer Service', 'HR', 'Finance', 'Operations', 'Management'],
    required: true,
  },
  {
    id: 'deptSize',
    section: 'Department Focus',
    sectionIndex: 2,
    question: 'How many staff are in this department?',
    type: 'select',
    options: ['1-2', '3-5', '6-10', '11-20', '21+'],
    required: true,
  },
  {
    id: 'painPoint',
    section: 'Workflow Pain Points',
    sectionIndex: 3,
    question: 'What is the biggest workflow challenge in this department?',
    type: 'dynamic-select',
    required: true,
    microcopy: 'Options are tailored to your selected department',
  },
  {
    id: 'timeOnRepetitive',
    section: 'Workflow Pain Points',
    sectionIndex: 3,
    question: 'How much time does your team spend on repetitive work each week?',
    type: 'select',
    options: [
      'Less than 5 hours',
      '5-10 hours',
      '11-20 hours',
      '21-40 hours',
      'More than 40 hours',
    ],
    required: true,
  },
  {
    id: 'solveProblem',
    section: 'Workflow Pain Points',
    sectionIndex: 3,
    question: 'If AI could solve one problem for your team, what should it solve?',
    type: 'text',
    placeholder: 'Describe in your own words...',
    required: false,
    microcopy: 'Optional — helps us personalise your report',
  },
  {
    id: 'aiConcern',
    section: 'Team Readiness',
    sectionIndex: 4,
    question: "What is your team's biggest concern about using AI?",
    type: 'select',
    options: [
      'Data privacy',
      'Accuracy',
      'Staff resistance',
      'Cost',
      'Not sure where to start',
      'No major concern',
    ],
    required: true,
  },
  {
    id: 'aiOpenness',
    section: 'Team Readiness',
    sectionIndex: 4,
    question: 'How open is your team to adopting AI?',
    type: 'select',
    options: ['Very open', 'Somewhat open', 'Neutral', 'Somewhat resistant', 'Very resistant'],
    required: true,
  },
  {
    id: 'desiredOutcome',
    section: 'Business Impact',
    sectionIndex: 5,
    question: 'What would be the most valuable outcome for your team?',
    type: 'select',
    options: [
      'Save time',
      'Reduce manual errors',
      'Improve customer response',
      'Create content faster',
      'Improve reporting',
      'Build internal tools',
      'Train staff to use AI confidently',
    ],
    required: true,
  },
];
