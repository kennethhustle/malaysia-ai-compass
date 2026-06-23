'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { QUESTIONS, PAIN_POINTS, SECTIONS, SECTION_COLORS } from '@/lib/questions';
import { calculateScore, getLevelDescription } from '@/lib/scoring';
import { SurveyAnswers, ScoreResult, ContactDetails } from '@/types/survey';

// ─── Types ──────────────────────────────────────────────────────────────────
type Screen = 'intro' | 'survey' | 'preview' | 'capture' | 'loading' | 'thankyou';

const EMPTY_ANSWERS: SurveyAnswers = {
  companyName: '', industry: '', companySize: '', businessGoal: '',
  aiFrequency: '', aiLevel: '', department: '', deptSize: '',
  painPoint: '', timeOnRepetitive: '', solveProblem: '',
  aiConcern: '', aiOpenness: '', desiredOutcome: '',
};

const EMPTY_CONTACT: ContactDetails = {
  name: '', company: '', email: '', phone: '',
  jobTitle: '', companyWebsite: '', remarks: '', consent: false,
};

// ─── Score ring ──────────────────────────────────────────────────────────────
function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width="128" height="128" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#F0EAE3" strokeWidth="8" />
      <circle
        cx="60" cy="60" r={r} fill="none"
        stroke={color} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
        className="score-ring-animated"
      />
    </svg>
  );
}

// ─── Progress bar ────────────────────────────────────────────────────────────
function ProgressBar({ index, total, section, sectionIndex }: {
  index: number; total: number; section: string; sectionIndex: number;
}) {
  const pct = Math.round(((index + 1) / total) * 100);
  const color = SECTION_COLORS[section] ?? '#FF5C00';
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color }}>
          {section}
        </span>
        <span className="text-xs text-[#7A6F66] font-medium">{index + 1} / {total}</span>
      </div>
      <div className="h-1.5 bg-[#EDE7DF] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex gap-1 mt-1.5">
        {SECTIONS.map((s, i) => (
          <div key={s} className="flex-1 h-0.5 rounded-full transition-colors duration-300"
            style={{ backgroundColor: i < sectionIndex ? '#FF5C00' : i === sectionIndex ? color : '#EDE7DF' }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Option card ─────────────────────────────────────────────────────────────
function OptionCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button className={`option-card ${selected ? 'selected' : ''}`} onClick={onClick} type="button">
      <span className={`radio-dot ${selected ? 'selected' : ''}`} />
      <span>{label}</span>
    </button>
  );
}

// ─── Field wrapper ───────────────────────────────────────────────────────────
function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#2E2B24] mb-1.5">
        {label}{required && <span className="text-[#FF5C00] ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-[#E12323] mt-1 font-medium">{error}</p>}
    </div>
  );
}

// ─── Loading dots ────────────────────────────────────────────────────────────
function LoadingDots() {
  return (
    <div className="flex gap-1.5 items-center">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-2 h-2 rounded-full bg-[#FF5C00]"
          style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
      <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0.7);opacity:0.5} 40%{transform:scale(1);opacity:1} }`}</style>
    </div>
  );
}

// ─── Card wrapper ─────
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-3xl shadow-[0_4px_40px_rgba(46,43,36,0.08)] overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

// ─── Background ───────
function Bg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.75 }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="-30" y="30" width="200" height="200" rx="18" transform="rotate(45 70 130)" fill="#FF5C00"/>
        <rect x="20" y="80" width="90" height="90" rx="10" transform="rotate(45 65 125)" fill="#FB7500"/>
        <circle cx="1340" cy="90" r="130" fill="#B811DF"/>
        <circle cx="1255" cy="140" r="80" fill="#FFB000"/>
        <circle cx="1415" cy="210" r="22" fill="#FF5C00"/>
        <circle cx="93"  cy="480" r="42" fill="#D580F5"/>
        <circle cx="82"  cy="451" r="42" fill="#D580F5"/>
        <circle cx="55"  cy="440" r="42" fill="#D580F5"/>
        <circle cx="28"  cy="451" r="42" fill="#D580F5"/>
        <circle cx="17"  cy="480" r="42" fill="#D580F5"/>
        <circle cx="28"  cy="509" r="42" fill="#D580F5"/>
        <circle cx="55"  cy="520" r="42" fill="#D580F5"/>
        <circle cx="82"  cy="509" r="42" fill="#D580F5"/>
        <circle cx="55"  cy="480" r="42" fill="#B811DF"/>
        <circle cx="1415" cy="490" r="100" fill="#FFB000"/>
        <circle cx="1330" cy="515" r="100" fill="#FB7500"/>
        <path d="M -60 880 Q 140 540 380 880" stroke="#FF5C00" strokeWidth="56" fill="none" strokeLinecap="round"/>
        <path d="M -60 880 Q 140 540 380 880" stroke="#B811DF" strokeWidth="34" fill="none" strokeLinecap="round"/>
        <path d="M -60 880 Q 140 540 380 880" stroke="#FFB000" strokeWidth="14" fill="none" strokeLinecap="round"/>
        <rect x="1210" y="730" width="270" height="195" rx="44" fill="#FF5C00"/>
        <circle cx="1248" cy="768" r="15" fill="#FFB000"/>
        <circle cx="1296" cy="768" r="15" fill="#FFB000"/>
        <circle cx="1344" cy="768" r="15" fill="#FFB000"/>
        <circle cx="1392" cy="768" r="15" fill="#FFB000"/>
        <circle cx="1248" cy="814" r="15" fill="#FFDBAE"/>
        <circle cx="1296" cy="814" r="15" fill="#FFDBAE"/>
        <circle cx="1344" cy="814" r="15" fill="#FFDBAE"/>
        <circle cx="1392" cy="814" r="15" fill="#FFDBAE"/>
        <circle cx="1248" cy="860" r="15" fill="#2E2B24"/>
        <circle cx="1296" cy="860" r="15" fill="#2E2B24"/>
        <circle cx="1344" cy="860" r="15" fill="#2E2B24"/>
        <circle cx="1392" cy="860" r="15" fill="#2E2B24"/>
        <rect x="655" y="815" width="130" height="130" rx="16" transform="rotate(-18 720 880)" fill="#FFB000"/>
        <rect x="678" y="838" width="84" height="84" rx="10" transform="rotate(-18 720 880)" fill="#FF5C00"/>
        <circle cx="385" cy="55"  r="24" fill="#FF5C00"/>
        <circle cx="1055" cy="825" r="30" fill="#B811DF"/>
        <rect x="1075" y="55" width="54" height="54" rx="9" transform="rotate(15 1102 82)" fill="#FFB000"/>
        <rect x="285" y="806" width="48" height="48" rx="7" transform="rotate(-12 309 830)" fill="#D580F5"/>
        <circle cx="775" cy="878" r="20" fill="#FF5C00"/>
      </svg>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function DiagnosticApp() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [answers, setAnswers] = useState<SurveyAnswers>(EMPTY_ANSWERS);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [fieldError, setFieldError] = useState('');
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [contact, setContact] = useState<ContactDetails>(EMPTY_CONTACT);
  const [contactErrors, setContactErrors] = useState<Partial<Record<keyof ContactDetails, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [autoTimer, setAutoTimer] = useState<NodeJS.Timeout | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const total = QUESTIONS.length;
  const question = QUESTIONS[questionIndex];

  useEffect(() => {
    if (answers.department) setAnswers(p => ({ ...p, painPoint: '' }));
  }, [answers.department]);

  useEffect(() => () => { if (autoTimer) clearTimeout(autoTimer); }, [autoTimer]);

  const handleAnswer = useCallback((value: string) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);
    setFieldError('');

    const isSelectType = question.type === 'select' || question.type === 'dynamic-select';
    if (isSelectType && questionIndex < total - 1) {
      if (autoTimer) clearTimeout(autoTimer);
      const t = setTimeout(() => {
        setQuestionIndex(i => i + 1);
        setFieldError('');
      }, 320);
      setAutoTimer(t);
    }
  }, [answers, question, questionIndex, total, autoTimer]);

  const handleNext = useCallback(() => {
    if (question.required && !answers[question.id]) {
      setFieldError('Please choose an answer to continue.');
      return;
    }
    if (questionIndex === total - 1) {
      const s = calculateScore(answers);
      setScore(s);
      setScreen('preview');
    } else {
      setQuestionIndex(i => i + 1);
      setFieldError('');
    }
  }, [question, answers, questionIndex, total]);

  const handleBack = useCallback(() => {
    if (questionIndex === 0) { setScreen('intro'); return; }
    setQuestionIndex(i => i - 1);
    setFieldError('');
  }, [questionIndex]);

  const validateContact = () => {
    const errs: Partial<Record<keyof ContactDetails, string>> = {};
    if (!contact.name.trim()) errs.name = 'Required';
    if (!contact.company.trim()) errs.company = 'Required';
    if (!contact.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
      errs.email = 'Valid work email required';
    // Malaysia phone: mobile 01X-XXXXXXXX or landline 0X-XXXXXXXX
    const myPhone = contact.phone.trim().replace(/[\s\-().]/g, '');
    const myPhoneValid = /^(\+?60|0)1[0-9]\d{7,8}$/.test(myPhone) || /^(\+?60|0)[23489]\d{7,8}$/.test(myPhone);
    if (!myPhoneValid) errs.phone = 'Enter a valid Malaysian number (e.g. +60 12-345 6789)';
    if (!contact.jobTitle.trim()) errs.jobTitle = 'Required';
    if (!contact.consent) errs.consent = 'Please accept to continue';
    setContactErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const startProgress = () => {
    setLoadProgress(0);
    let current = 0;
    const tick = () => {
      current = current < 30 ? current + 2.5
        : current < 60 ? current + 0.8
        : current < 88 ? current + 0.25
        : current;
      setLoadProgress(Math.min(current, 88));
      if (current < 88) progressTimerRef.current = setTimeout(tick, 120);
    };
    progressTimerRef.current = setTimeout(tick, 120);
  };

  const finishProgress = (success: boolean) => {
    if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    if (success) setLoadProgress(100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateContact() || !score) return;
    setSubmitting(true);
    setApiError('');
    setSubmittedEmail(contact.email);
    setScreen('loading');
    startProgress();

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, contact }),
      });
      const data = await res.json();
      if (res.status === 429) {
        finishProgress(false);
        setApiError('Too many submissions. Please try again later.');
        setScreen('capture');
        setSubmitting(false);
        return;
      }
      if (!res.ok || !data.success) {
        finishProgress(false);
        setApiError(data.error ?? 'Something went wrong. Please try again.');
        setScreen('capture');
        setSubmitting(false);
        return;
      }
      finishProgress(true);
      setTimeout(() => setScreen('thankyou'), 600);
    } catch {
      finishProgress(false);
      setApiError('Network error. Please check your connection and try again.');
      setScreen('capture');
      setSubmitting(false);
    }
  };

  const setContactField = <K extends keyof ContactDetails>(k: K, v: ContactDetails[K]) => {
    setContact(p => ({ ...p, [k]: v }));
    if (contactErrors[k]) setContactErrors(p => ({ ...p, [k]: '' }));
  };

  const options = question?.type === 'dynamic-select'
    ? (PAIN_POINTS[answers.department] ?? [])
    : (question?.options ?? []);

  // ════════════════════════════════════════════════════════════════════════════
  // INTRO SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === 'intro') return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 relative">
      <Bg />
      <div className="w-full max-w-lg screen-enter relative z-10">
        <div className="text-center mb-10">
          <img src="/hustle-logo.png" alt="Hustle Malaysia" style={{ height: "38px" }} className="mx-auto" />
        </div>

        <Card>
          <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #FF5C00 0%, #FFB000 50%, #B811DF 100%)' }} />

          <div className="p-8 sm:p-10">
            <div className="inline-flex items-center gap-2 bg-[#FFF2EB] border border-[#FFDBAE] rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#FF5C00] rounded-full" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
              <span className="text-xs font-semibold text-[#FF5C00] uppercase tracking-widest">Built for Malaysian Businesses Adopting AI</span>
            </div>

            <h1 className="font-urbanist font-extrabold text-5xl text-[#2E2B24] leading-tight mb-4">
              Find Out Where AI<br />
              <span className="text-[#FF5C00]">Can Help Your Business.</span>
            </h1>

            <p className="text-[#7A6F66] text-lg leading-relaxed mb-3 font-urbanist">
              AI adoption should not start with tools. It should start with your team&apos;s actual workflows, challenges, and business goals.
            </p>
            <p className="text-[#BDB4AC] text-sm font-urbanist mb-8">
              Take our AI Opportunity Scan to uncover where your business can work faster, reduce repetitive tasks, and improve day-to-day productivity.
            </p>

            <button
              onClick={() => { setScreen('survey'); setQuestionIndex(0); }}
              className="btn-hustle w-full text-lg mb-4"
            >
              Start AI Opportunity Scan →
            </button>

            <p className="text-center text-xs text-[#BDB4AC] font-urbanist">
              Takes about 5 minutes &nbsp;·&nbsp; Free &amp; personalised for your business
            </p>

            {/* What you get */}
            <div className="mt-8 pt-6 border-t border-[#F0EAE3]">
              <p className="text-xs font-semibold text-[#7A6F66] uppercase tracking-widest mb-4 font-urbanist">What You&apos;ll Receive</p>
              <div className="space-y-2.5">
                {[
                  'A snapshot of your team\'s current AI readiness',
                  'Key workflow gaps and pain points identified',
                  'Suggested AI use cases for your business',
                  'Recommended AI tools and automation opportunities',
                  'Relevant Hustle Malaysia training pathways for your team',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#FF5C00] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4l1.5 1.5 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-xs text-[#7A6F66] font-urbanist leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini info row */}
            <div className="mt-6 pt-6 border-t border-[#F0EAE3] grid grid-cols-3 gap-4">
              {[
                { icon: '⚡', label: '14 questions' },
                { icon: '📄', label: 'PDF report' },
                { icon: '🎯', label: 'Free & personalised' },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="text-xs text-[#BDB4AC] font-urbanist">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="text-center text-xs text-[#BDB4AC] mt-6 font-urbanist space-y-1">
          <p>
            Powered by{' '}
            <a href="https://www.hustle.com.my" target="_blank" rel="noopener noreferrer"
              className="text-[#FF5C00] hover:underline">
              Hustle Malaysia
            </a>
          </p>
          <p>
            <a href="https://www.hustle.com.my/our-policy" target="_blank" rel="noopener noreferrer"
              className="hover:underline hover:text-[#7A6F66] transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // SURVEY SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === 'survey') return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 relative">
      <Bg />
      <div className="w-full max-w-xl screen-enter relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setScreen('intro')} className="btn-ghost text-sm">
            <img src="/hustle-logo.png" alt="Hustle Malaysia" style={{ height: "34px" }} />
          </button>
          <span className="text-xs text-[#BDB4AC] font-urbanist">AI Opportunity Scan</span>
        </div>

        <Card>
          <div className="p-7 sm:p-9">
            <ProgressBar
              index={questionIndex}
              total={total}
              section={question.section}
              sectionIndex={question.sectionIndex}
            />

            {questionIndex >= total - 3 && questionIndex < total - 1 && (
              <div className="mb-5 flex items-center gap-2 text-sm text-[#FF5C00] font-medium bg-[#FFF2EB] rounded-xl px-4 py-2.5">
                <span>🎯</span> Almost there — just a couple more!
              </div>
            )}

            <div key={questionIndex} className="question-enter">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#BDB4AC] mb-2 font-urbanist">
                Question {questionIndex + 1}
              </p>
              <h2 className="font-urbanist font-extrabold text-3xl text-[#2E2B24] leading-tight mb-2">
                {question.question}
              </h2>
              {question.microcopy && (
                <p className="text-sm text-[#BDB4AC] mb-6 font-urbanist">{question.microcopy}</p>
              )}
              {!question.microcopy && <div className="mb-5" />}

              {question.type === 'text' && question.id !== 'solveProblem' && (
                <input
                  type="text"
                  dir="ltr"
                  className="hustle-input"
                  style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
                  value={answers[question.id] as string}
                  onChange={e => handleAnswer(e.target.value)}
                  placeholder={question.placeholder}
                  onKeyDown={e => { if (e.key === 'Enter') handleNext(); }}
                  autoFocus
                />
              )}

              {question.type === 'text' && question.id === 'solveProblem' && (
                <textarea
                  dir="ltr"
                  className="hustle-input resize-none"
                  style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
                  rows={4}
                  value={answers.solveProblem}
                  onChange={e => handleAnswer(e.target.value)}
                  placeholder={question.placeholder}
                  autoFocus
                />
              )}

              {(question.type === 'select' || question.type === 'dynamic-select') && (
                <div className={`grid gap-2 ${options.length <= 4 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                  {options.map(opt => (
                    <OptionCard
                      key={opt} label={opt}
                      selected={answers[question.id] === opt}
                      onClick={() => handleAnswer(opt)}
                    />
                  ))}
                </div>
              )}

              {fieldError && (
                <p className="mt-3 text-sm text-[#E12323] font-medium font-urbanist">{fieldError}</p>
              )}
            </div>
          </div>

          <div className="px-7 sm:px-9 pb-7 flex items-center justify-between border-t border-[#F7F3EF] pt-5">
            <button onClick={handleBack} className="btn-ghost">← Back</button>
            <div className="flex items-center gap-3">
              {!question.required && (
                <button onClick={handleNext} className="btn-ghost text-[#BDB4AC]">Skip</button>
              )}
              <button onClick={handleNext} className="btn-hustle py-3 px-6 text-sm">
                {questionIndex === total - 1 ? 'See My Score →' : 'Next →'}
              </button>
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-[#BDB4AC] mt-4 font-urbanist">
          Your answers are used only to generate your personalised report.
        </p>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // PREVIEW SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === 'preview' && score) return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 relative">
      <Bg />
      <div className="w-full max-w-md screen-enter relative z-10">
        <div className="text-center mb-4">
          <img src="/hustle-logo.png" alt="Hustle Malaysia" style={{ height: "34px" }} className="mx-auto" />
        </div>

        <Card>
          <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #FF5C00 0%, #FFB000 50%, #B811DF 100%)' }} />

          <div className="p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#FF5C00] mb-4 font-urbanist">
              Your AI Readiness Snapshot
            </p>

            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <ScoreRing score={score.total} color={score.levelColor} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-knewave text-4xl text-[#2E2B24]">{score.total}</span>
                  <span className="text-xs text-[#BDB4AC] font-urbanist">/ 100</span>
                </div>
              </div>
              <div className="mt-3 px-5 py-1.5 rounded-full text-sm font-bold font-urbanist"
                style={{ backgroundColor: `${score.levelColor}18`, color: score.levelColor }}>
                {score.level}
              </div>
              <p className="text-center text-sm text-[#7A6F66] mt-3 font-urbanist max-w-xs leading-relaxed">
                {getLevelDescription(score.level)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#FFF7F3] rounded-2xl p-4">
                <p className="text-xs text-[#BDB4AC] mb-1 font-urbanist">Department</p>
                <p className="font-bold text-[#2E2B24] text-sm font-urbanist">{answers.department}</p>
              </div>
              <div className="bg-[#FFF7F3] rounded-2xl p-4 border border-[#FFDBAE]/40">
                <p className="text-xs text-[#BDB4AC] mb-1 font-urbanist">Top Challenge</p>
                <p className="font-bold text-[#2E2B24] text-xs font-urbanist leading-snug">{answers.painPoint}</p>
              </div>
            </div>

            <div className="bg-[#2E2B24] rounded-2xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-bold text-white text-sm mb-1 font-urbanist">Your full report is ready.</p>
                  <p className="text-[#9A9186] text-xs leading-relaxed font-urbanist">
                    Department diagnosis · AI use cases · Training pathway · Practical next steps
                  </p>
                </div>
              </div>
            </div>

            <button onClick={() => setScreen('capture')} className="btn-hustle w-full text-base">
              Get My AI Report →
            </button>

            <p className="text-center text-xs text-[#BDB4AC] mt-3 font-urbanist">
              Free · No spam · Sent straight to your inbox
            </p>
          </div>
        </Card>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // CAPTURE SCREEN (Lead Form)
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === 'capture') return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 relative">
      <Bg />
      <div className="w-full max-w-lg screen-enter relative z-10">
        <div className="flex items-center justify-between mb-6">
          <img src="/hustle-logo.png" alt="Hustle Malaysia" style={{ height: "24px" }} />
          <button onClick={() => setScreen('preview')} className="btn-ghost text-xs">← Back</button>
        </div>

        <Card>
          <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #FF5C00 0%, #FFB000 50%, #B811DF 100%)' }} />

          <div className="p-7 sm:p-9">
            <h2 className="font-knewave text-3xl text-[#2E2B24] mb-2">Almost there.</h2>
            <p className="text-[#7A6F66] text-sm mb-7 font-urbanist">
              Enter your details and we&apos;ll send your customised AI Opportunity Scan report straight to your inbox.
            </p>

            {score && (
              <div className="flex items-center gap-3 bg-[#FFF7F3] rounded-xl px-4 py-3 mb-6 border border-[#FFDBAE]/30">
                <div className="font-knewave text-2xl text-[#FF5C00]">{score.total}</div>
                <div>
                  <div className="text-xs font-bold text-[#2E2B24] font-urbanist">{score.level}</div>
                  <div className="text-xs text-[#BDB4AC] font-urbanist">AI Readiness Score</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Full Name" required error={contactErrors.name}>
                    <input dir="ltr" type="text" className={`hustle-input ${contactErrors.name ? 'error' : ''}`}
                      style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
                      value={contact.name} onChange={e => setContactField('name', e.target.value)}
                      placeholder="Ahmad bin Hassan" />
                  </Field>
                  <Field label="Company Name" required error={contactErrors.company}>
                    <input dir="ltr" type="text" className={`hustle-input ${contactErrors.company ? 'error' : ''}`}
                      style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
                      value={contact.company} onChange={e => setContactField('company', e.target.value)}
                      placeholder="Acme Sdn Bhd" />
                  </Field>
                </div>

                <Field label="Work Email" required error={contactErrors.email}>
                  <input dir="ltr" type="email" className={`hustle-input ${contactErrors.email ? 'error' : ''}`}
                    style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
                    value={contact.email} onChange={e => setContactField('email', e.target.value)}
                    placeholder="ahmad@company.com.my" />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Phone Number" required error={contactErrors.phone}>
                    <input dir="ltr" type="tel" className={`hustle-input ${contactErrors.phone ? 'error' : ''}`}
                      style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
                      value={contact.phone} onChange={e => setContactField('phone', e.target.value)}
                      placeholder="+60 12-345 6789" />
                  </Field>
                  <Field label="Job Title" required error={contactErrors.jobTitle}>
                    <input dir="ltr" type="text" className={`hustle-input ${contactErrors.jobTitle ? 'error' : ''}`}
                      style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
                      value={contact.jobTitle} onChange={e => setContactField('jobTitle', e.target.value)}
                      placeholder="Marketing Manager" />
                  </Field>
                </div>

                <Field label="Company Website" error={contactErrors.companyWebsite}>
                  <input dir="ltr" type="text" className={`hustle-input ${contactErrors.companyWebsite ? 'error' : ''}`}
                    style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
                    value={contact.companyWebsite ?? ''} onChange={e => setContactField('companyWebsite', e.target.value)}
                    placeholder="https://yourcompany.com.my (optional)" />
                </Field>

                {/* Consent */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer" onClick={() => setContactField('consent', !contact.consent)}>
                    <div className={`hustle-checkbox ${contact.consent ? 'checked' : ''} mt-0.5`}>
                      {contact.consent && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-[#7A6F66] leading-relaxed font-urbanist">
                      By submitting this form, you agree for Hustle Malaysia to contact you regarding your AI readiness report, training recommendations, and related corporate training programmes.
                    </span>
                  </label>
                  {contactErrors.consent && (
                    <p className="text-xs text-[#E12323] mt-1 ml-8 font-medium font-urbanist">{contactErrors.consent}</p>
                  )}
                </div>
              </div>

              {apiError && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-sm text-[#E12323] font-urbanist">{apiError}</p>
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn-hustle w-full mt-6 text-base">
                {submitting ? <><LoadingDots /><span className="ml-2">Generating Report...</span></> : 'Generate My AI Report →'}
              </button>

              <p className="text-center text-xs text-[#BDB4AC] mt-3 font-urbanist">
                No spam — just your report and relevant follow-up from Hustle Malaysia.
              </p>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // LOADING SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === 'loading') {
    const progressLabel =
      loadProgress < 20 ? 'Analysing your responses…' :
      loadProgress < 45 ? 'Generating AI insights…' :
      loadProgress < 70 ? 'Crafting your report…' :
      loadProgress < 90 ? 'Preparing your recommendations…' :
      loadProgress < 100 ? 'Almost done…' :
      'Complete! ✓';

    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 relative">
        <Bg />
        <div className="w-full max-w-sm screen-enter relative z-10 text-center">
          <div className="mb-8">
            <img src="/hustle-logo.png" alt="Hustle Malaysia" style={{ height: "34px" }} className="mx-auto" />
          </div>

          <Card>
            <div className="p-8 sm:p-10 flex flex-col items-center">
              <div className="mb-4">
                <span className="font-knewave text-6xl text-[#FF5C00]">{Math.round(loadProgress)}</span>
                <span className="font-urbanist text-2xl font-bold text-[#FF5C00]">%</span>
              </div>

              <div className="w-full h-3 bg-[#F0EAE3] rounded-full overflow-hidden mb-4">
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${loadProgress}%`,
                    background: loadProgress === 100
                      ? '#10B981'
                      : 'linear-gradient(90deg, #FF5C00 0%, #FFB000 100%)',
                  }}
                />
              </div>

              <p className="text-sm font-semibold text-[#2E2B24] font-urbanist mb-1">
                {progressLabel}
              </p>
              <p className="text-xs text-[#BDB4AC] font-urbanist leading-relaxed">
                Building your personalised AI Opportunity Scan report.
              </p>

              <div className="flex items-center gap-2 mt-5">
                <LoadingDots />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // THANK YOU SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === 'thankyou') return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 relative">
      <Bg />
      <div className="w-full max-w-md screen-enter relative z-10">
        <div className="text-center mb-6">
          <a href="https://www.hustle.com.my" target="_blank" rel="noopener noreferrer">
            <img src="/hustle-logo.png" alt="Hustle Malaysia" style={{ height: "34px" }} className="mx-auto" />
          </a>
        </div>

        <Card>
          <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #FF5C00 0%, #FFB000 50%, #B811DF 100%)' }} />

          <div className="p-8 sm:p-10 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-[#ECFDF5]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 className="font-knewave text-3xl text-[#2E2B24] mb-3">
              Your report is<br />on the way.
            </h2>

            <p className="text-[#7A6F66] text-sm font-urbanist leading-relaxed mb-2">
              Thank you for completing the Hustle Malaysia AI Opportunity Scan.
            </p>
            {submittedEmail && (
              <p className="text-[#7A6F66] text-sm font-urbanist mb-6">
                We&apos;ll send your customised report to{' '}
                <span className="font-bold text-[#2E2B24]">{submittedEmail}</span> shortly.
              </p>
            )}

            <div className="bg-[#FFF7F3] rounded-2xl p-5 text-left mb-6 space-y-4">
              {[
                { n: '1', title: 'Check your inbox', desc: 'Your AI Opportunity Scan Report (PDF) is on its way.' },
                { n: '2', title: 'Review your recommendations', desc: 'Find AI use cases and training options matched to your team.' },
                { n: '3', title: 'We may follow up', desc: 'A Hustle Malaysia consultant may reach out with practical suggestions.' },
              ].map(step => (
                <div key={step.n} className="flex gap-3 items-start">
                  <div className="w-7 h-7 bg-[#FF5C00] rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 font-urbanist">
                    {step.n}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#2E2B24] font-urbanist">{step.title}</p>
                    <p className="text-xs text-[#7A6F66] font-urbanist">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://www.hustle.com.my"
              target="_blank" rel="noopener noreferrer"
              className="btn-hustle w-full text-base mb-3"
            >
              Speak To Hustle Malaysia
            </a>

            <button
              onClick={() => {
                setScreen('intro');
                setAnswers(EMPTY_ANSWERS);
                setQuestionIndex(0);
                setScore(null);
                setContact(EMPTY_CONTACT);
                setSubmittedEmail('');
                setSubmitting(false);
                setApiError('');
                setLoadProgress(0);
              }}
              className="w-full py-3 rounded-2xl border-2 border-[#F0EAE3] text-[#7A6F66] text-sm font-semibold font-urbanist hover:border-[#FF5C00] hover:text-[#FF5C00] transition-colors"
            >
              Submit Another Response
            </button>

            <p className="text-xs text-[#BDB4AC] mt-4 font-urbanist">
              Questions?{' '}
              <a href="mailto:hello@hustle.com.my" className="text-[#FF5C00] hover:underline">hello@hustle.com.my</a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );

  return null;
}
