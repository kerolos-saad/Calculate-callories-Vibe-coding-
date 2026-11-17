import { useState } from 'react';
import { MacroTargets, PlannedMeal } from '../types/nutrition';

interface MacroChartsProps {
  targets: MacroTargets;
  meals: PlannedMeal[];
}

type MacroKey = 'protein' | 'carbs' | 'fat';

interface MacroSegment {
  key: MacroKey;
  label: string;
  grams: number;
  calories: number;
  pct: number;
  kcalPerGram: number;
  color: string;
  textColor: string;
  note: string;
}

export function MacroCharts({ targets, meals }: MacroChartsProps) {
  const [hoveredMacro, setHoveredMacro] = useState<MacroKey | null>(null);
  const [barMetric, setBarMetric] = useState<'calories' | 'grams'>('calories');
  const [hoveredMealSlot, setHoveredMealSlot] = useState<string | null>(null);

  const segments: MacroSegment[] = [
    {
      key: 'protein',
      label: 'Protein',
      grams: targets.proteinGrams,
      calories: targets.proteinCalories,
      pct: targets.proteinPct,
      kcalPerGram: 4,
      color: '#0F766E',
      textColor: 'text-teal-700',
      note: 'Muscle repair & satiety',
    },
    {
      key: 'carbs',
      label: 'Carbohydrates',
      grams: targets.carbsGrams,
      calories: targets.carbsCalories,
      pct: targets.carbsPct,
      kcalPerGram: 4,
      color: '#D97706',
      textColor: 'text-amber-700',
      note: `Includes ${targets.fiberGrams}g fiber target`,
    },
    {
      key: 'fat',
      label: 'Healthy Fats',
      grams: targets.fatGrams,
      calories: targets.fatCalories,
      pct: targets.fatPct,
      kcalPerGram: 9,
      color: '#2563EB',
      textColor: 'text-blue-700',
      note: 'Hormones, omega-3 & absorption',
    },
  ];

  // Donut SVG geometry
  const size = 210;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePct = 0;
  const arcs = segments.map((seg) => {
    const startPct = cumulativePct;
    cumulativePct += seg.pct;
    const dashLength = (seg.pct / 100) * circumference;
    const dashOffset = -(startPct / 100) * circumference;
    return {
      ...seg,
      dashLength,
      dashOffset,
    };
  });

  const activeSegment =
    segments.find((s) => s.key === hoveredMacro) ?? null;

  // Stacked meal bar chart geometry
  const maxMealCalories = Math.max(
    400,
    ...meals.map((m) => m.calories)
  );
  const maxMealGrams = Math.max(
    40,
    ...meals.map((m) => m.protein + m.carbs + m.fat)
  );

  const inspectedMeal =
    meals.find((m) => m.slot === hoveredMealSlot) ?? meals[0] ?? null;

  return (
    <section
      id="macro-charts"
      aria-label="Visual macro breakdowns"
      className="grid grid-cols-1 xl:grid-cols-12 gap-6"
    >
      {/* Chart 1: Daily Calorie & Macro Donut Breakdown */}
      <div className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Daily Macro Breakdown
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Share of total daily energy ({targets.targetCalories.toLocaleString()} kcal)
              </p>
            </div>
          </div>

          {/* Interactive Donut + Center Readout */}
          <div className="mt-6 flex flex-col sm:flex-row xl:flex-col 2xl:flex-row items-center gap-6">
            <div className="relative w-[210px] h-[210px] shrink-0">
              <svg
                viewBox={`0 0 ${size} ${size}`}
                className="w-full h-full -rotate-90"
                role="img"
                aria-label={`Daily macro energy breakdown: Protein ${targets.proteinPct}%, Carbohydrates ${targets.carbsPct}%, Healthy Fats ${targets.fatPct}%`}
              >
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth={strokeWidth}
                />
                {arcs.map((arc) => {
                  const isHighlighted = hoveredMacro === arc.key;
                  const isDimmed = hoveredMacro !== null && !isHighlighted;
                  return (
                    <circle
                      key={arc.key}
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="none"
                      stroke={arc.color}
                      strokeWidth={isHighlighted ? strokeWidth + 4 : strokeWidth}
                      strokeDasharray={`${Math.max(0, arc.dashLength - 2)} ${circumference}`}
                      strokeDashoffset={arc.dashOffset}
                      opacity={isDimmed ? 0.35 : 1}
                      className="transition-all duration-150 cursor-pointer"
                      onMouseEnter={() => setHoveredMacro(arc.key)}
                      onMouseLeave={() => setHoveredMacro(null)}
                      onClick={() =>
                        setHoveredMacro(
                          hoveredMacro === arc.key ? null : arc.key
                        )
                      }
                    />
                  );
                })}
              </svg>

              {/* Center numeric readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6">
                {activeSegment ? (
                  <>
                    <span className={`text-xs font-semibold ${activeSegment.textColor}`}>
                      {activeSegment.label}
                    </span>
                    <span className="font-mono text-2xl font-semibold text-slate-900 tabular-nums mt-0.5">
                      {activeSegment.grams}g
                    </span>
                    <span className="font-mono text-xs text-slate-500 tabular-nums">
                      {activeSegment.pct}% · {activeSegment.calories} kcal
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-xs font-medium text-slate-500">
                      Daily Total
                    </span>
                    <span className="font-mono text-2xl font-semibold text-slate-900 tabular-nums mt-0.5">
                      {targets.targetCalories.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500">kcal / day</span>
                  </>
                )}
              </div>
            </div>

            {/* Proportional Energy Bar & Legend */}
            <div className="w-full flex-1 space-y-4">
              {/* Linear stacked bar for instant ratio perception */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Caloric Energy Ratio</span>
                  <span className="font-mono tabular-nums">100%</span>
                </div>
                <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-100">
                  {segments.map((seg) => (
                    <div
                      key={seg.key}
                      style={{
                        width: `${seg.pct}%`,
                        backgroundColor: seg.color,
                      }}
                      className="h-full transition-all duration-150"
                      title={`${seg.label}: ${seg.pct}%`}
                    />
                  ))}
                </div>
              </div>

              <div className="divide-y divide-slate-100 border-t border-slate-100">
                {segments.map((seg) => {
                  const isActive = hoveredMacro === seg.key;
                  return (
                    <button
                      key={seg.key}
                      type="button"
                      onMouseEnter={() => setHoveredMacro(seg.key)}
                      onMouseLeave={() => setHoveredMacro(null)}
                      onClick={() =>
                        setHoveredMacro(isActive ? null : seg.key)
                      }
                      className={`w-full py-2.5 px-2 -mx-2 rounded-md text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                        isActive ? 'bg-slate-50' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-xs shrink-0"
                          style={{ backgroundColor: seg.color }}
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-900 truncate">
                            {seg.label}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {seg.note}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                          {seg.grams}g
                        </div>
                        <div className="font-mono text-[11px] text-slate-500 tabular-nums">
                          {seg.pct}% · {seg.calories} kcal
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Conversion: 4 kcal/g P · 4 kcal/g C · 9 kcal/g Fat</span>
          <span className="font-mono tabular-nums font-medium text-slate-700">
            BMI {targets.bmi}
          </span>
        </div>
      </div>

      {/* Chart 2: Per-Meal Macro Distribution Bar Chart */}
      <div className="xl:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Meal-by-Meal Macro Distribution
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                How daily protein, carbs, and healthy fats are paced across meals
              </p>
            </div>

            <div
              role="group"
              aria-label="Chart display unit"
              className="inline-flex items-center p-1 bg-slate-100 rounded-lg shrink-0"
            >
              <button
                type="button"
                onClick={() => setBarMetric('calories')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  barMetric === 'calories'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Calories (kcal)
              </button>
              <button
                type="button"
                onClick={() => setBarMetric('grams')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  barMetric === 'grams'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Macros (g)
              </button>
            </div>
          </div>

          {/* Stacked Horizontal / Vertical Bar Chart */}
          <div className="mt-6 space-y-3.5">
            {meals.map((meal) => {
              const pCal = meal.protein * 4;
              const cCal = meal.carbs * 4;
              const fCal = meal.fat * 9;
              const totalBarCal = Math.max(1, pCal + cCal + fCal);

              const pVal = barMetric === 'calories' ? pCal : meal.protein;
              const cVal = barMetric === 'calories' ? cCal : meal.carbs;
              const fVal = barMetric === 'calories' ? fCal : meal.fat;
              const rowTotal =
                barMetric === 'calories'
                  ? meal.calories
                  : meal.protein + meal.carbs + meal.fat;
              const scaleMax =
                barMetric === 'calories' ? maxMealCalories : maxMealGrams;
              const rowWidthPct = Math.min(
                100,
                Math.max(12, Math.round((rowTotal / scaleMax) * 100))
              );

              const pShare = Math.round((pVal / Math.max(1, pVal + cVal + fVal)) * 100);
              const cShare = Math.round((cVal / Math.max(1, pVal + cVal + fVal)) * 100);
              const fShare = Math.max(0, 100 - pShare - cShare);
              const isSelected = inspectedMeal?.slot === meal.slot;

              return (
                <button
                  key={meal.slot}
                  type="button"
                  onMouseEnter={() => setHoveredMealSlot(meal.slot)}
                  onFocus={() => setHoveredMealSlot(meal.slot)}
                  onClick={() => setHoveredMealSlot(meal.slot)}
                  className={`w-full text-left p-2.5 -mx-2.5 rounded-lg transition-colors cursor-pointer ${
                    isSelected ? 'bg-slate-50' : 'hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium text-slate-900 truncate">
                        {meal.slotLabel}
                      </span>
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        · {meal.timeWindow}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-slate-700 tabular-nums shrink-0 flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {barMetric === 'calories'
                          ? `${meal.calories} kcal`
                          : `${rowTotal}g total`}
                      </span>
                      <span className="text-slate-400">
                        ({Math.round((meal.calories / Math.max(1, targets.targetCalories)) * 100)}%)
                      </span>
                    </div>
                  </div>

                  {/* Proportional bar track */}
                  <div className="w-full bg-slate-100 rounded-md h-6 overflow-hidden flex items-center">
                    <div
                      style={{ width: `${rowWidthPct}%` }}
                      className="h-full flex transition-all duration-200 rounded-md overflow-hidden"
                      aria-label={`${meal.slotLabel}: ${meal.protein}g protein, ${meal.carbs}g carbs, ${meal.fat}g healthy fat`}
                    >
                      <div
                        style={{ width: `${pShare}%`, backgroundColor: '#0F766E' }}
                        className="h-full flex items-center justify-center text-[10px] font-mono font-medium text-white/95 overflow-hidden"
                        title={`Protein: ${meal.protein}g (${Math.round((pCal / totalBarCal) * 100)}%)`}
                      >
                        {pShare >= 16 ? `${meal.protein}P` : ''}
                      </div>
                      <div
                        style={{ width: `${cShare}%`, backgroundColor: '#D97706' }}
                        className="h-full flex items-center justify-center text-[10px] font-mono font-medium text-white/95 overflow-hidden"
                        title={`Carbs: ${meal.carbs}g (${Math.round((cCal / totalBarCal) * 100)}%)`}
                      >
                        {cShare >= 16 ? `${meal.carbs}C` : ''}
                      </div>
                      <div
                        style={{ width: `${fShare}%`, backgroundColor: '#2563EB' }}
                        className="h-full flex items-center justify-center text-[10px] font-mono font-medium text-white/95 overflow-hidden"
                        title={`Healthy Fat: ${meal.fat}g (${Math.round((fCal / totalBarCal) * 100)}%)`}
                      >
                        {fShare >= 16 ? `${meal.fat}F` : ''}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart Legend + Inspected Meal Summary */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-teal-700" aria-hidden="true" />
              Protein (P)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-600" aria-hidden="true" />
              Carbs (C)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" aria-hidden="true" />
              Healthy Fats (F)
            </span>
          </div>

          {inspectedMeal && (
            <div className="font-mono text-xs text-slate-600 tabular-nums">
              <span className="font-sans font-medium text-slate-800 mr-1.5">
                {inspectedMeal.slotLabel}:
              </span>
              {inspectedMeal.protein}g P · {inspectedMeal.carbs}g C · {inspectedMeal.fat}g F
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
