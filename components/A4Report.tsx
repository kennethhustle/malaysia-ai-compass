import React from 'react';
import type { ReportData } from '@/types/survey';

/* ─── Brand tokens ───────────────────────────────────────────────────────── */
const ORANGE   = '#FF5C00';
const BLUE     = '#2563EB';
const NAVY     = '#1B3A6B';
const GREEN    = '#059669';
const AMBER    = '#D97706';
const DARK     = '#111827';
const MID      = '#374151';
const GRAY     = '#4B5563';
const LIGHT    = '#6B7280';
const BORDER   = '#E5E7EB';
const BG_GRAY  = '#F9FAFB';
const WHITE    = '#FFFFFF';

const HUSTLE_LOGO_URL = 'https://portal.hustle.com.sg/wp-content/uploads/2026/02/Hustle-Singapore-Logo.png';

/* ─── Badge colour maps ──────────────────────────────────────────────────── */
const DIFF_BADGE: Record<string, { bg: string; color: string }> = {
  Low:    { bg: '#ECFDF5', color: GREEN },
  Medium: { bg: '#FFF7ED', color: AMBER },
  High:   { bg: '#FEF2F2', color: '#DC2626' },
};
const IMPACT_BADGE: Record<string, { bg: string; color: string }> = {
  Low:    { bg: '#FEF2F2', color: '#DC2626' },
  Medium: { bg: '#FFF7ED', color: AMBER },
  High:   { bg: '#ECFDF5', color: GREEN },
};
const ROADMAP_COLORS = [GREEN, BLUE, AMBER];
const COURSE_COLORS  = [BLUE, ORANGE, GREEN];
const PAIN_COLORS    = [ORANGE, BLUE, GREEN, AMBER];
const STEP_COLORS    = [BLUE, ORANGE, GREEN, BLUE, ORANGE, GREEN];

/* ─── Radar chart helpers ────────────────────────────────────────────────── */
function radarPath(values: number[], cx: number, cy: number, r: number): string {
  const n = values.length;
  const pts = values.map((v, i) => {
    const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
    const scale = Math.max(0.05, v / 5);
    return [cx + scale * r * Math.cos(angle), cy + scale * r * Math.sin(angle)];
  });
  return 'M ' + pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ') + ' Z';
}

function gridRing(frac: number, n: number, cx: number, cy: number, r: number): string {
  const pts = Array.from({ length: n }, (_, i) => {
    const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
    return `${(cx + frac * r * Math.cos(angle)).toFixed(2)},${(cy + frac * r * Math.sin(angle)).toFixed(2)}`;
  });
  return pts.join(' ');
}

function axisEnd(i: number, n: number, cx: number, cy: number, r: number) {
  const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
  return { x: (cx + r * Math.cos(angle)), y: (cy + r * Math.sin(angle)) };
}

function labelPos(i: number, n: number, cx: number, cy: number, r: number) {
  const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
  const d = r + 20;
  return { x: cx + d * Math.cos(angle), y: cy + d * Math.sin(angle) };
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function PageTopBar() {
  return (
    <div style={{ height: 4, background: ORANGE, width: '100%' }} />
  );
}

function PageHeader({ company }: { company: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 44px', borderBottom: `1px solid ${BORDER}`, marginBottom: 24,
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HUSTLE_LOGO_URL} alt="Hustle Malaysia" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
      <span style={{ fontSize: 14, color: LIGHT }}>AI Opportunity Scan Report · {company}</span>
    </div>
  );
}

function PageFooter() {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      borderTop: `1px solid ${BORDER}`, padding: '8px 44px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span style={{ fontSize: 12, color: LIGHT, maxWidth: '80%' }}>
        Proprietary and confidential. Developed by Hustle Malaysia. For recipient's internal use only.
        No part of this report may be reproduced or shared externally without prior written permission from Hustle Malaysia.
      </span>
    </div>
  );
}

function SectionHeading({ num, title, subtitle }: { num: string; title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: ORANGE }}>{num}</span>
        <span style={{ fontSize: 27, fontWeight: 800, color: DARK, lineHeight: 1.1 }}>{title}</span>
      </div>
      {subtitle && (
        <p style={{ fontSize: 15, color: GRAY, fontStyle: 'italic', margin: '4px 0 8px' }}>{subtitle}</p>
      )}
      <div style={{ display: 'flex', height: 2, marginTop: subtitle ? 0 : 4 }}>
        <div style={{ flex: 1, background: ORANGE }} />
        <div style={{ flex: 1, background: BLUE }} />
      </div>
    </div>
  );
}

function Badge({
  label, bg, color,
}: { label: string; bg: string; color: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 4,
      background: bg, color, fontSize: 14, fontWeight: 700,
    }}>{label}</span>
  );
}

function RadarChart({ dimensions }: { dimensions: Array<{ name: string; now: number; potential: number }> }) {
  const cx = 140, cy = 140, r = 90;
  const n = dimensions.length;
  const nowPath  = radarPath(dimensions.map(d => d.now), cx, cy, r);
  const potPath  = radarPath(dimensions.map(d => d.potential), cx, cy, r);

  return (
    <div style={{ width: 320, flexShrink: 0 }}>
      <svg viewBox="0 0 280 280" style={{ width: 280, height: 280, display: 'block' }}>
        {/* Grid rings */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map(frac => (
          <polygon
            key={frac}
            points={gridRing(frac, n, cx, cy, r)}
            fill="none"
            stroke={BORDER}
            strokeWidth="0.8"
          />
        ))}
        {/* Axis lines */}
        {dimensions.map((_, i) => {
          const end = axisEnd(i, n, cx, cy, r);
          return (
            <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y}
              stroke={BORDER} strokeWidth="0.8" />
          );
        })}
        {/* Potential area */}
        <path d={potPath} fill="rgba(255,92,0,0.12)" stroke={ORANGE} strokeWidth="2" />
        {/* Current area */}
        <path d={nowPath} fill="rgba(37,99,235,0.18)" stroke={BLUE} strokeWidth="2" />
        {/* Centre dot */}
        <circle cx={cx} cy={cy} r="3" fill={WHITE} stroke={BORDER} strokeWidth="1" />
        {/* Axis labels */}
        {dimensions.map((dim, i) => {
          const lp = labelPos(i, n, cx, cy, r);
          const anchor = lp.x < cx - 5 ? 'end' : lp.x > cx + 5 ? 'start' : 'middle';
          // Word wrap: split at space if too long
          const words = dim.name.split(' ');
          const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
          const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
          return (
            <text key={i} x={lp.x} y={lp.y} textAnchor={anchor}
              fontSize="11" fill={DARK} fontFamily="Urbanist, sans-serif" fontWeight="600">
              <tspan x={lp.x} dy="0">{line1}</tspan>
              {line2 && <tspan x={lp.x} dy="10">{line2}</tspan>}
            </text>
          );
        })}
      </svg>
      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: BLUE }} />
          <span style={{ fontSize: 14, color: GRAY }}>Current</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: ORANGE }} />
          <span style={{ fontSize: 14, color: GRAY }}>Potential</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────────────── */
export default function A4Report({ data }: { data: ReportData }) {
  const { contact, answers, score, reportContent } = data;
  const dateStr = new Date().toLocaleDateString('en-MY', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const scoreOf5 = score.total <= 20 ? 1 : score.total <= 40 ? 2 : score.total <= 60 ? 3 : score.total <= 80 ? 4 : 5;

  /* shared style helpers */
  const page: React.CSSProperties = {
    width: '210mm',
    minHeight: '297mm',
    position: 'relative',
    background: WHITE,
    fontFamily: "'Urbanist', sans-serif",
    paddingBottom: 48,
    boxSizing: 'border-box',
    overflow: 'hidden',
  };
  const content: React.CSSProperties = { padding: '0 44px' };

  return (
    <div id="a4-report-outer" style={{ fontFamily: "'Urbanist', sans-serif" }}>

      {/* ══════════════════════════════════════════════════════════════
           PAGE 1 — COVER
         ══════════════════════════════════════════════════════════════ */}
      <div className="a4-cover" style={{
        ...page,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '297mm',
        paddingBottom: 0,
      }}>
        <PageTopBar />

        {/* Nav row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 36px', borderBottom: `1px solid ${BORDER}`,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HUSTLE_LOGO_URL} alt="Hustle Malaysia" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
          <span style={{ color: '#9ca3af', fontSize: 15, fontWeight: 500, letterSpacing: 0.3 }}>AI Opportunity Scan Report</span>
        </div>

        {/* Body split */}
        <div style={{ display: 'flex', flex: 1, borderTop: `1px solid ${BORDER}` }}>

          {/* Left: light panel (same beige/white as rest of report) */}
          <div style={{
            flex: 1,
            background: '#FFF8F4',
            padding: '52px 44px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: `1px solid ${BORDER}`,
          }}>
            <div>
              <p style={{
                fontSize: 14, fontWeight: 700, color: ORANGE,
                textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20,
              }}>Opportunity Scan Report</p>
              <h1 style={{
                fontSize: 41, fontWeight: 800, color: DARK,
                lineHeight: 1.15, marginBottom: 24,
              }}>
                AI Opportunity<br />Scan<br />Report
              </h1>
              <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, maxWidth: 220 }}>
                A practical roadmap to identify AI opportunities, improve workflows, and build future-ready capabilities in your organisation.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 24, height: 3, background: ORANGE, borderRadius: 2 }} />
              <span style={{ fontSize: 14, color: GRAY }}>hustle.com.my</span>
            </div>
          </div>

          {/* Right: light panel */}
          <div style={{
            flex: 1,
            padding: '52px 44px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <p style={{
                fontSize: 14, color: LIGHT, textTransform: 'uppercase',
                letterSpacing: 1.5, marginBottom: 14,
              }}>Prepared For</p>
              <h2 style={{ fontSize: 33, fontWeight: 800, color: DARK, marginBottom: 6 }}>
                {contact.company}
              </h2>
              <p style={{ fontSize: 15, color: GRAY, marginBottom: 40 }}>
                {answers.department} · {dateStr}
              </p>

              {[
                { label: 'Industry',     value: answers.industry },
                { label: 'AI Readiness', value: score.level },
                { label: 'Score',        value: `${scoreOf5} / 5`, highlight: true },
              ].map((row, i) => (
                <div key={i} style={{
                  padding: '10px 0',
                  borderTop: `1px solid ${BORDER}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 14, color: LIGHT, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {row.label}
                  </span>
                  <span style={{
                    fontSize: 14, fontWeight: 700,
                    color: row.highlight ? ORANGE : DARK,
                  }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* AI badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              border: `1px solid ${ORANGE}`, borderRadius: 20,
              padding: '5px 14px', alignSelf: 'flex-start',
            }}>
              <div style={{ width: 7, height: 7, borderRadius: 4, background: ORANGE }} />
              <span style={{ fontSize: 14, color: ORANGE, fontWeight: 700 }}>AI-Powered Analysis</span>
            </div>
          </div>
        </div>

        {/* Cover footer */}
        <div style={{
          borderTop: `1px solid ${BORDER}`, padding: '8px 44px',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 12, color: LIGHT }}>Proprietary and confidential. Developed by Hustle Malaysia.</span>
          <span style={{ fontSize: 12, color: LIGHT }}>www.hustle.com.my</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
           PAGE 2 — EXECUTIVE SUMMARY + BUSINESS CONTEXT
         ══════════════════════════════════════════════════════════════ */}
      <div className="a4-section a4-page-break" style={page}>
        <PageTopBar />
        <PageHeader company={contact.company} />
        <div style={content}>

          <SectionHeading num="01" title="Executive Summary" />
          <div style={{
            borderLeft: `3px solid ${BLUE}`, background: BG_GRAY,
            padding: '14px 18px', borderRadius: '0 4px 4px 0', marginBottom: 28,
          }}>
            <p style={{ fontSize: 15, color: MID, lineHeight: 1.75, margin: 0 }}>
              {reportContent.executiveSummary}
            </p>
          </div>

          <SectionHeading num="02" title="Business Context" />
          <div style={{ display: 'flex', gap: 20, marginTop: 4 }}>
            {/* Data table */}
            <div style={{
              flex: 1, border: `1px solid ${BORDER}`, borderRadius: 6, overflow: 'hidden',
            }}>
              {[
                { label: 'Company',         value: contact.company },
                { label: 'Industry',        value: answers.industry },
                { label: 'Company Size',    value: `${answers.companySize} employees` },
                { label: 'Department',      value: answers.department },
                { label: 'Business Goal',   value: answers.businessGoal },
                { label: 'AI Readiness',    value: score.level },
                { label: 'Readiness Score', value: `${scoreOf5} / 5` },
              ].map((row, i, arr) => (
                <div key={i} style={{
                  display: 'flex', padding: '8px 14px',
                  borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none',
                  background: i % 2 === 1 ? BG_GRAY : WHITE,
                }}>
                  <span style={{ flex: 1, fontSize: 14, color: GRAY }}>{row.label}</span>
                  <span style={{ flex: 1.5, fontSize: 14, fontWeight: 700, color: DARK }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Current Workflow */}
            <div style={{ flex: 1 }}>
              <div style={{ borderLeft: `3px solid ${BLUE}`, paddingLeft: 14 }}>
                <p style={{
                  fontSize: 13, fontWeight: 700, color: BLUE,
                  textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
                }}>Current Workflow</p>
                <p style={{ fontSize: 14, color: MID, lineHeight: 1.7, margin: 0 }}>
                  {reportContent.currentWorkflow}
                </p>
              </div>
            </div>
          </div>
        </div>
        <PageFooter />
      </div>

      {/* ══════════════════════════════════════════════════════════════
           PAGE 3 — KEY PAIN POINTS
         ══════════════════════════════════════════════════════════════ */}
      <div className="a4-section a4-page-break" style={page}>
        <PageTopBar />
        <PageHeader company={contact.company} />
        <div style={content}>
          <SectionHeading
            num="03"
            title="Key Pain Points Identified"
            subtitle="The main pressure points identified from the diagnostic assessment."
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {reportContent.keyPainPoints.slice(0, 4).map((kp, i) => (
              <div key={i} style={{
                width: 'calc(50% - 7px)',
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}>
                <div style={{
                  padding: '10px 14px',
                  borderTop: `3px solid ${PAIN_COLORS[i]}`,
                  borderBottom: `1px solid ${BORDER}`,
                  background: WHITE,
                }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: 0 }}>{kp.category}</p>
                </div>
                <div style={{ padding: '10px 14px' }}>
                  {kp.points.map((pt, j) => (
                    <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                      <span style={{ color: GRAY, fontSize: 14, flexShrink: 0, marginTop: 1 }}>›</span>
                      <span style={{ fontSize: 14, color: MID, lineHeight: 1.55 }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <PageFooter />
      </div>

      {/* ══════════════════════════════════════════════════════════════
           PAGE 4 — AI READINESS SNAPSHOT
         ══════════════════════════════════════════════════════════════ */}
      <div className="a4-section a4-page-break" style={page}>
        <PageTopBar />
        <PageHeader company={contact.company} />
        <div style={content}>
          <SectionHeading
            num="04"
            title="AI Readiness Snapshot"
            subtitle="Current state vs realistic potential after AI training and implementation."
          />
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <RadarChart dimensions={reportContent.readinessSnapshot.dimensions} />

            {/* Table + insight */}
            <div style={{ flex: 1 }}>
              {/* Table header */}
              <div style={{
                display: 'flex', background: NAVY,
                padding: '8px 14px', borderRadius: 4, marginBottom: 2,
              }}>
                <span style={{ flex: 2, fontSize: 14, fontWeight: 700, color: WHITE }}>Dimension</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: WHITE, textAlign: 'center' }}>Now</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: WHITE, textAlign: 'center' }}>Potential</span>
              </div>
              {reportContent.readinessSnapshot.dimensions.map((dim, i) => (
                <div key={i} style={{
                  display: 'flex', padding: '7px 14px',
                  borderBottom: `1px solid ${BORDER}`,
                  background: i % 2 === 1 ? BG_GRAY : WHITE,
                }}>
                  <span style={{ flex: 2, fontSize: 14, color: DARK }}>{dim.name}</span>
                  <span style={{
                    flex: 1, fontSize: 14, fontWeight: 700, color: BLUE, textAlign: 'center',
                  }}>{dim.now}</span>
                  <span style={{
                    flex: 1, fontSize: 14, fontWeight: 700, color: ORANGE, textAlign: 'center',
                  }}>{dim.potential}</span>
                </div>
              ))}

              {/* Consultant insight */}
              <div style={{
                border: `1px solid ${BORDER}`, borderLeft: `3px solid ${BLUE}`,
                borderRadius: '0 6px 6px 0', padding: '12px 14px', marginTop: 12,
              }}>
                <p style={{
                  fontSize: 13, fontWeight: 700, color: BLUE,
                  textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6,
                }}>Consultant Insight</p>
                <p style={{ fontSize: 14, color: MID, lineHeight: 1.65, fontStyle: 'italic', margin: 0 }}>
                  {reportContent.readinessSnapshot.consultantInsight}
                </p>
              </div>
            </div>
          </div>
        </div>
        <PageFooter />
      </div>

      {/* ══════════════════════════════════════════════════════════════
           PAGE 5 — RECOMMENDED AI USE CASES
         ══════════════════════════════════════════════════════════════ */}
      <div className="a4-section a4-page-break" style={page}>
        <PageTopBar />
        <PageHeader company={contact.company} />
        <div style={content}>
          <SectionHeading
            num="05"
            title="Recommended AI Use Cases"
            subtitle={`Practical applications matched to the ${answers.department} team's specific challenges.`}
          />
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'flex', background: NAVY, padding: '8px 12px' }}>
              <span style={{ flex: 3, fontSize: 13, fontWeight: 700, color: WHITE }}>Use Case</span>
              <span style={{ flex: 3, fontSize: 13, fontWeight: 700, color: WHITE }}>AI Solution</span>
              <span style={{ flex: 1.2, fontSize: 13, fontWeight: 700, color: WHITE, textAlign: 'center' }}>Difficulty</span>
              <span style={{ flex: 1.2, fontSize: 13, fontWeight: 700, color: WHITE, textAlign: 'center' }}>Impact</span>
            </div>
            {reportContent.recommendedUseCases.map((uc, i) => (
              <div key={i} style={{
                display: 'flex', padding: '8px 12px',
                borderBottom: `1px solid ${BORDER}`,
                background: i % 2 === 1 ? BG_GRAY : WHITE,
                alignItems: 'center',
              }}>
                <div style={{ flex: 3, paddingRight: 12 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: '0 0 2px' }}>{uc.title}</p>
                  <p style={{ fontSize: 13, color: GRAY, margin: 0, lineHeight: 1.5 }}>{uc.problem}</p>
                </div>
                <div style={{ flex: 3, paddingRight: 12 }}>
                  <p style={{ fontSize: 13, color: MID, margin: 0, lineHeight: 1.5 }}>{uc.solution}</p>
                </div>
                <div style={{ flex: 1.2, textAlign: 'center' }}>
                  <Badge
                    label={uc.difficulty}
                    bg={DIFF_BADGE[uc.difficulty]?.bg ?? '#F3F4F6'}
                    color={DIFF_BADGE[uc.difficulty]?.color ?? GRAY}
                  />
                </div>
                <div style={{ flex: 1.2, textAlign: 'center' }}>
                  <Badge
                    label={uc.impact}
                    bg={IMPACT_BADGE[uc.impact]?.bg ?? '#F3F4F6'}
                    color={IMPACT_BADGE[uc.impact]?.color ?? GRAY}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <PageFooter />
      </div>

      {/* ══════════════════════════════════════════════════════════════
           PAGE 6 — AUTOMATION OPPORTUNITIES
         ══════════════════════════════════════════════════════════════ */}
      <div className="a4-section a4-page-break" style={page}>
        <PageTopBar />
        <PageHeader company={contact.company} />
        <div style={content}>
          <SectionHeading
            num="06"
            title="Automation Opportunities"
            subtitle="Workflows that are ready to be partially or fully automated."
          />
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ display: 'flex', background: NAVY, padding: '8px 12px' }}>
              <span style={{ flex: 1.8, fontSize: 13, fontWeight: 700, color: WHITE }}>Workflow</span>
              <span style={{ flex: 2, fontSize: 13, fontWeight: 700, color: WHITE }}>Current Process</span>
              <span style={{ flex: 2, fontSize: 13, fontWeight: 700, color: WHITE }}>AI Opportunity</span>
              <span style={{ flex: 1.5, fontSize: 13, fontWeight: 700, color: WHITE }}>Time Saving</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: WHITE, textAlign: 'center' }}>Effort</span>
            </div>
            {reportContent.automationOpportunities.map((ao, i) => (
              <div key={i} style={{
                display: 'flex', padding: '8px 12px',
                borderBottom: `1px solid ${BORDER}`,
                background: i % 2 === 1 ? BG_GRAY : WHITE,
                alignItems: 'center',
              }}>
                <div style={{ flex: 1.8, paddingRight: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0 }}>{ao.workflow}</p>
                </div>
                <div style={{ flex: 2, paddingRight: 8 }}>
                  <p style={{ fontSize: 13, color: MID, margin: 0, lineHeight: 1.5 }}>{ao.currentProcess}</p>
                </div>
                <div style={{ flex: 2, paddingRight: 8 }}>
                  <p style={{ fontSize: 13, color: MID, margin: 0, lineHeight: 1.5 }}>{ao.aiOpportunity}</p>
                </div>
                <div style={{ flex: 1.5, paddingRight: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: BLUE, margin: 0 }}>{ao.timeSaving}</p>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <Badge
                    label={ao.effort}
                    bg={DIFF_BADGE[ao.effort]?.bg ?? '#F3F4F6'}
                    color={DIFF_BADGE[ao.effort]?.color ?? GRAY}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <PageFooter />
      </div>

      {/* ══════════════════════════════════════════════════════════════
           PAGE 7 — SUGGESTED AI TOOLS
         ══════════════════════════════════════════════════════════════ */}
      <div className="a4-section a4-page-break" style={page}>
        <PageTopBar />
        <PageHeader company={contact.company} />
        <div style={content}>
          <SectionHeading num="07" title="Suggested AI Tools" subtitle="Recommended tools mapped to your key workflow opportunities" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(reportContent.suggestedTools ?? []).map((tool, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                background: WHITE, border: `1px solid ${BORDER}`,
                borderRadius: 8, padding: '12px 14px',
              }}>
                {/* Coloured initial badge */}
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: [ORANGE, BLUE, GREEN, AMBER, NAVY][i % 5],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 17, fontWeight: 800, color: WHITE }}>
                    {tool.toolName.charAt(0)}
                  </span>
                </div>

                {/* Main content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: DARK }}>{tool.toolName}</span>
                    <span style={{
                      fontSize: 12, fontWeight: 600, color: BLUE,
                      background: '#EFF6FF', borderRadius: 4, padding: '1px 7px',
                    }}>{tool.category}</span>
                    <span style={{
                      fontSize: 12, fontWeight: 500, color: GRAY,
                      marginLeft: 'auto', flexShrink: 0,
                    }}>{tool.pricing}</span>
                  </div>
                  <p style={{ fontSize: 14, color: MID, lineHeight: 1.55, margin: '0 0 5px' }}>
                    {tool.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 3, height: 3, borderRadius: '50%', background: ORANGE, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: GRAY, fontStyle: 'italic' }}>For: {tool.workflow}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: LIGHT }}>{tool.url}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 16, background: BG_GRAY, borderRadius: 8,
            padding: '10px 14px', borderLeft: `3px solid ${ORANGE}`,
          }}>
            <p style={{ fontSize: 13, color: MID, lineHeight: 1.6, margin: 0 }}>
              <strong>Note:</strong> All tools listed have free tiers or trials. We recommend piloting one tool per workflow before committing to a paid plan. Hustle Malaysia can guide your team through onboarding any of these tools as part of our AI training programmes.
            </p>
          </div>
        </div>
        <PageFooter />
      </div>

      {/* ══════════════════════════════════════════════════════════════
           PAGE 8 — PRIORITY ROADMAP (renumbered from 7)
         ══════════════════════════════════════════════════════════════ */}
      <div className="a4-section a4-page-break" style={page}>
        <PageTopBar />
        <PageHeader company={contact.company} />
        <div style={content}>
          <SectionHeading
            num="08"
            title="Priority Roadmap"
            subtitle="A phased approach to AI adoption, from immediate quick wins to strategic longer-term changes."
          />
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              {
                label: 'Quick Wins',
                color: ROADMAP_COLORS[0],
                items: reportContent.priorityRoadmap.quickWins,
              },
              {
                label: 'Next Phase',
                color: ROADMAP_COLORS[1],
                items: reportContent.priorityRoadmap.nextPhase,
              },
              {
                label: 'Longer Term',
                color: ROADMAP_COLORS[2],
                items: reportContent.priorityRoadmap.longerTerm,
              },
            ].map((col) => (
              <div key={col.label} style={{ flex: 1 }}>
                <div style={{
                  background: col.color, padding: '8px 14px',
                  borderRadius: 6, marginBottom: 10,
                }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: WHITE, margin: 0 }}>{col.label}</p>
                </div>
                {col.items.map((item, j) => (
                  <div key={j} style={{
                    marginBottom: 10, paddingBottom: 10,
                    borderBottom: `1px solid ${BORDER}`,
                  }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: '0 0 4px' }}>{item.title}</p>
                    <p style={{ fontSize: 13, color: MID, lineHeight: 1.55, margin: 0 }}>{item.description}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <PageFooter />
      </div>

      {/* ══════════════════════════════════════════════════════════════
           PAGE 8 — RECOMMENDED AI TRAINING PATHWAY
         ══════════════════════════════════════════════════════════════ */}
      <div className="a4-section a4-page-break" style={page}>
        <PageTopBar />
        <PageHeader company={contact.company} />
        <div style={content}>
          <SectionHeading
            num="09"
            title="Recommended AI Training Pathway"
            subtitle={`Courses selected based on the ${answers.department} team's specific pain points and priorities.`}
          />

          {reportContent.recommendedCourses.map((course, i) => {
            const color = COURSE_COLORS[i] ?? BLUE;
            return (
              <div key={i} style={{
                border: `1px solid ${BORDER}`, borderRadius: 6,
                marginBottom: 14, overflow: 'hidden',
              }}>
                <div style={{ display: 'flex' }}>
                  {/* Left colour bar */}
                  <div style={{ width: 4, background: color, flexShrink: 0 }} />
                  <div style={{ flex: 1, padding: 14 }}>
                    {/* Top row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 4, background: color,
                        fontSize: 13, fontWeight: 700, color: WHITE,
                      }}>Course {i + 1}</span>
                      <span style={{ fontSize: 18, fontWeight: 700, color: DARK }}>{course.name}</span>
                    </div>
                    <p style={{ fontSize: 14, color, marginBottom: 10 }}>{course.url}</p>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 4 }}>Why relevant:</p>
                        <p style={{ fontSize: 14, color: MID, lineHeight: 1.6, margin: 0 }}>{course.reason}</p>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 4 }}>Who should attend:</p>
                        <p style={{ fontSize: 14, color: MID, lineHeight: 1.6, marginBottom: 8 }}>{course.whoShouldAttend}</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 4 }}>Expected outcome:</p>
                        <p style={{ fontSize: 14, color: MID, lineHeight: 1.6, margin: 0 }}>{course.expectedOutcome}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <PageFooter />
      </div>

      {/* ══════════════════════════════════════════════════════════════
           PAGE 9 — NEXT STEPS + ABOUT
         ══════════════════════════════════════════════════════════════ */}
      <div className="a4-section a4-page-break" style={page}>
        <PageTopBar />
        <PageHeader company={contact.company} />
        <div style={content}>
          <SectionHeading num="10" title="Suggested Next Steps" />

          <div style={{ marginBottom: 30 }}>
            {reportContent.nextSteps.map((step, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start',
                padding: '10px 0', borderBottom: `1px solid ${BORDER}`,
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 12,
                  background: STEP_COLORS[i] ?? BLUE,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginRight: 14,
                }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: WHITE }}>{i + 1}</span>
                </div>
                <p style={{ fontSize: 15, color: MID, lineHeight: 1.65, margin: 0 }}>{step}</p>
              </div>
            ))}
          </div>

          <SectionHeading num="11" title="About Hustle Malaysia" />

          <div style={{ borderLeft: `3px solid ${ORANGE}`, paddingLeft: 16, marginBottom: 18 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 8 }}>Hustle Malaysia</p>
            <p style={{ fontSize: 14, color: MID, lineHeight: 1.65, marginBottom: 10 }}>
              Hustle Malaysia helps individuals and organisations build practical creative, digital, and AI capabilities through hands-on training.
            </p>
            <p style={{ fontSize: 14, color: MID, lineHeight: 1.65, marginBottom: 12 }}>
              Our programmes are designed to help teams apply new tools confidently, improve real workflows, and build practical AI skills that translate directly into day-to-day productivity gains for Malaysian businesses.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                'Generative AI for Productivity', 'Generative AI for Content Creation', 'Generative AI for Video Creation',
                'Generative AI for Digital Marketing', 'Generative AI for Workflow Automation', 'Generative AI for Chatbots and Customer Support',
              ].map(tag => (
                <span key={tag} style={{
                  border: `1px solid ${BLUE}`, padding: '2px 10px',
                  borderRadius: 4, fontSize: 13, color: BLUE,
                }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* CTA box */}
          <div style={{
            background: NAVY, borderRadius: 8, padding: '18px 24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 19, fontWeight: 700, color: WHITE, marginBottom: 4 }}>
                Ready to take the next step?
              </p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0 }}>
                Speak with our team to explore a suitable AI training pathway for your organisation.
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 24 }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: ORANGE, marginBottom: 4 }}>www.hustle.com.my</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                Prepared by Hustle Malaysia · {dateStr}
              </p>
            </div>
          </div>
        </div>
        <PageFooter />
      </div>

    </div>
  );
}
