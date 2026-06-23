'use client';

import { Question, PAIN_POINTS, SECTION_COLORS } from '@/lib/questions';
import { SurveyAnswers } from '@/types/survey';
import { useEffect, useRef } from 'react';

interface QuestionCardProps {
  question: Question;
  answers: SurveyAnswers;
  onAnswer: (id: keyof SurveyAnswers, value: string) => void;
  error?: string;
}

export default function QuestionCard({ question, answers, onAnswer, error }: QuestionCardProps) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const color = SECTION_COLORS[question.section] ?? '#FF5C00';
  const currentValue = answers[question.id] as string;

  useEffect(() => {
    if (question.type === 'text' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [question.id, question.type]);

  // Resolve options for dynamic-select
  const options =
    question.type === 'dynamic-select'
      ? PAIN_POINTS[answers.department] ?? []
      : question.options ?? [];

  const handleOptionClick = (value: string) => {
    onAnswer(question.id, value);
  };

  const handleTextChange = (value: string) => {
    onAnswer(question.id, value);
  };

  return (
    <div className="fade-in">
      {/* Section + question number label */}
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>
        {question.section}
      </p>

      {/* Question */}
      <h2 className="text-2xl md:text-3xl font-black text-[#1C1C1C] leading-tight mb-2">
        {question.question}
      </h2>

      {question.microcopy && (
        <p className="text-sm text-[#6B6B6B] mb-6">{question.microcopy}</p>
      )}

      {!question.microcopy && <div className="mb-6" />}

      {/* Text input */}
      {question.type === 'text' && (
        <div>
          {question.id === 'solveProblem' ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={currentValue}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={question.placeholder}
              rows={4}
              className="w-full px-5 py-4 rounded-xl border-2 border-[#E8E5DF] bg-white text-[#1C1C1C]
                         placeholder-[#B0ADA7] focus:outline-none focus:border-[#FF5C00] text-base
                         transition-colors resize-none"
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={currentValue}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={question.placeholder}
              className="w-full px-5 py-4 rounded-xl border-2 border-[#E8E5DF] bg-white text-[#1C1C1C]
                         placeholder-[#B0ADA7] focus:outline-none focus:border-[#FF5C00] text-base
                         transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            />
          )}
        </div>
      )}

      {/* Select / Dynamic Select */}
      {(question.type === 'select' || question.type === 'dynamic-select') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`answer-option ${currentValue === option ? 'selected' : ''}`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                    currentValue === option
                      ? 'border-[#FF5C00] bg-[#FF5C00]'
                      : 'border-[#C8C5BF]'
                  }`}
                />
                {option}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
