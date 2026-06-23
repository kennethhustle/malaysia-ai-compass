export type Industry =
  | 'F&B / Hospitality'
  | 'Retail / E-commerce'
  | 'Finance / Insurance'
  | 'Healthcare / Wellness'
  | 'Technology / Software'
  | 'Education / Training'
  | 'Manufacturing / Logistics'
  | 'Marketing / Media / Creative'
  | 'Professional Services'
  | 'Government / Non-profit'
  | 'Other';

export type CompanySize = '1-5' | '6-10' | '11-20' | '21-50' | '51-100' | '100+';

export type BusinessGoal =
  | 'Increase sales'
  | 'Reduce manpower cost'
  | 'Improve efficiency'
  | 'Improve customer service'
  | 'Build SOP system'
  | 'Improve reporting';

export type AIFrequency = 'Daily' | 'Weekly' | 'Occasionally' | 'Never';

export type AILevel =
  | 'We have not started'
  | 'A few staff are experimenting'
  | 'Some teams use AI for simple tasks'
  | 'AI is used regularly in certain workflows'
  | 'We already have AI-enabled processes';

export type Department =
  | 'Sales'
  | 'Marketing'
  | 'Customer Service'
  | 'HR'
  | 'Finance'
  | 'Operations'
  | 'Management';

export type DeptSize = '1-2' | '3-5' | '6-10' | '11-20' | '21+';

export type TimeOnRepetitive =
  | 'Less than 5 hours'
  | '5-10 hours'
  | '11-20 hours'
  | '21-40 hours'
  | 'More than 40 hours';

export type AIConcern =
  | 'Data privacy'
  | 'Accuracy'
  | 'Staff resistance'
  | 'Cost'
  | 'Not sure where to start'
  | 'No major concern';

export type AIOpenness =
  | 'Very open'
  | 'Somewhat open'
  | 'Neutral'
  | 'Somewhat resistant'
  | 'Very resistant';

export type DesiredOutcome =
  | 'Save time'
  | 'Reduce manual errors'
  | 'Improve customer response'
  | 'Create content faster'
  | 'Improve reporting'
  | 'Build internal tools'
  | 'Train staff to use AI confidently';

export interface SurveyAnswers {
  companyName: string;
  industry: string;
  companySize: string;
  businessGoal: string;
  aiFrequency: string;
  aiLevel: string;
  department: string;
  deptSize: string;
  painPoint: string;
  timeOnRepetitive: string;
  solveProblem: string;
  aiConcern: string;
  aiOpenness: string;
  desiredOutcome: string;
}

export interface ContactDetails {
  name: string;
  company: string;
  email: string;
  phone: string;
  jobTitle: string;
  companyWebsite?: string;
  remarks: string;
  consent: boolean;
}

export interface ScoreResult {
  total: number;
  level: 'Not Started' | 'Early Stage' | 'Developing' | 'Progressing' | 'AI-Ready Team';
  levelColor: string;
  breakdown: {
    aiUsage: number;
    teamAdoption: number;
    workflowMaturity: number;
    automationPotential: number;
    businessClarity: number;
  };
}

export interface SubmissionPayload {
  answers: SurveyAnswers;
  score: ScoreResult;
  contact: ContactDetails;
}

export interface ReportData {
  contact: ContactDetails;
  answers: SurveyAnswers;
  score: ScoreResult;
  reportContent: {
    executiveSummary: string;
    currentWorkflow: string;
    keyPainPoints: Array<{
      category: string;
      points: string[];
    }>;
    readinessSnapshot: {
      dimensions: Array<{ name: string; now: number; potential: number }>;
      consultantInsight: string;
    };
    recommendedUseCases: Array<{
      title: string;
      problem: string;
      solution: string;
      difficulty: 'Low' | 'Medium' | 'High';
      impact: 'Low' | 'Medium' | 'High';
    }>;
    automationOpportunities: Array<{
      workflow: string;
      currentProcess: string;
      aiOpportunity: string;
      timeSaving: string;
      effort: 'Low' | 'Medium' | 'High';
    }>;
    priorityRoadmap: {
      quickWins: Array<{ title: string; description: string }>;
      nextPhase: Array<{ title: string; description: string }>;
      longerTerm: Array<{ title: string; description: string }>;
    };
    nextSteps: string[];
    recommendedCourses: Array<{
      name: string;
      url: string;
      reason: string;
      whoShouldAttend: string;
      expectedOutcome: string;
    }>;
    suggestedTools: Array<{
      workflow: string;
      toolName: string;
      category: string;
      description: string;
      pricing: string;
      url: string;
    }>;
  };
}
