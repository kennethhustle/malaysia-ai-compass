import { SurveyAnswers, ScoreResult } from '@/types/survey';

export function calculateScore(answers: SurveyAnswers): ScoreResult {
  // 1. AI Usage (0-25): How frequently they use AI
  const freqScore: Record<string, number> = {
    Daily: 25,
    Weekly: 18,
    Occasionally: 10,
    Never: 0,
  };
  const aiUsage = freqScore[answers.aiFrequency] ?? 5;

  // 2. Team Adoption (0-20): AI level + team openness
  const levelScore: Record<string, number> = {
    'We have not started': 0,
    'A few staff are experimenting': 5,
    'Some teams use AI for simple tasks': 10,
    'AI is used regularly in certain workflows': 15,
    'We already have AI-enabled processes': 20,
  };
  const opennessScore: Record<string, number> = {
    'Very open': 10,
    'Somewhat open': 7,
    Neutral: 4,
    'Somewhat resistant': 2,
    'Very resistant': 0,
  };
  const teamAdoption = Math.round(
    (levelScore[answers.aiLevel] ?? 5) * 0.6 +
    (opennessScore[answers.aiOpenness] ?? 4) * 0.4
  );

  // 3. Workflow Maturity (0-20): Less time on repetitive = higher maturity
  const timeScore: Record<string, number> = {
    'Less than 5 hours': 20,
    '5-10 hours': 15,
    '11-20 hours': 10,
    '21-40 hours': 5,
    'More than 40 hours': 2,
  };
  const workflowMaturity = timeScore[answers.timeOnRepetitive] ?? 10;

  // 4. Automation Potential (0-20): Dept size + concern level
  const deptSizeScore: Record<string, number> = {
    '1-2': 4,
    '3-5': 8,
    '6-10': 12,
    '11-20': 16,
    '21+': 20,
  };
  const concernScore: Record<string, number> = {
    'No major concern': 20,
    'Not sure where to start': 14,
    Cost: 12,
    Accuracy: 10,
    'Data privacy': 8,
    'Staff resistance': 6,
  };
  const automationPotential = Math.round(
    (deptSizeScore[answers.deptSize] ?? 8) * 0.4 +
    (concernScore[answers.aiConcern] ?? 10) * 0.6
  );

  // 5. Business Clarity (0-15): Has a clear goal + knows what to solve
  const hasGoal = answers.businessGoal ? 8 : 0;
  const hasSolveProblem = (answers.solveProblem?.trim().length ?? 0) > 10 ? 7 : 3;
  const businessClarity = hasGoal + hasSolveProblem;

  const total = Math.min(
    100,
    Math.round(aiUsage + teamAdoption + workflowMaturity + automationPotential + businessClarity)
  );

  let level: ScoreResult['level'];
  let levelColor: string;

  if (total <= 20) {
    level = 'Not Started';
    levelColor = '#6B6B6B';
  } else if (total <= 40) {
    level = 'Early Stage';
    levelColor = '#F59E0B';
  } else if (total <= 60) {
    level = 'Developing';
    levelColor = '#3B82F6';
  } else if (total <= 80) {
    level = 'Progressing';
    levelColor = '#8B5CF6';
  } else {
    level = 'AI-Ready Team';
    levelColor = '#10B981';
  }

  return {
    total,
    level,
    levelColor,
    breakdown: {
      aiUsage,
      teamAdoption,
      workflowMaturity,
      automationPotential,
      businessClarity,
    },
  };
}

export function getLevelDescription(level: ScoreResult['level']): string {
  const descriptions: Record<ScoreResult['level'], string> = {
    'Not Started': 'Your team is at the starting line. There is significant opportunity ahead, and the right first step will unlock quick wins.',
    'Early Stage': 'Your team has begun exploring AI, but adoption is still limited. Building the right foundation now will accelerate progress.',
    'Developing': 'Your team is making real progress with AI. Identifying the highest-impact workflows to automate will compound results quickly.',
    'Progressing': 'Your team has solid AI foundations. Scaling what is working and upskilling strategically will take you to the next level.',
    'AI-Ready Team': 'Your team is ahead of the curve. Expanding AI capabilities and sharing best practices across departments will maintain your edge.',
  };
  return descriptions[level];
}
