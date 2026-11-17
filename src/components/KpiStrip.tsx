import { MacroTargets, UserProfile } from '../types/nutrition';

interface KpiStripProps {
  targets: MacroTargets;
  profile: UserProfile;
}

export function KpiStrip({ targets, profile }: KpiStripProps) {
  const goalDiff = targets.targetCalories - targets.tdee;
  const goalText =
    goalDiff === 0
      ? 'At maintenance TDEE'
      : goalDiff > 0
      ? `+${goalDiff} kcal surplus`
      : `${goalDiff} kcal deficit`;

  return (
    <section aria-label="Daily nutritional targets">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 bg-white border border-slate-200 rounded-xl divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
        {/* Daily Calories */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-500">
              Daily Calorie Target
            </span>
            <span className="text-xs font-medium text-emerald-700">
              {goalText}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold text-slate-900 tabular-nums tracking-tight">
              {targets.targetCalories.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-slate-500">kcal</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 tabular-nums flex items-center gap-1.5 flex-wrap">
            <span>BMR {targets.bmr.toLocaleString()}</span>
            <span aria-hidden="true">·</span>
            <span>TDEE {targets.tdee.toLocaleString()}</span>
          </div>
        </div>

        {/* Protein */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-500">
              Daily Protein
            </span>
            <span className="font-mono text-xs font-semibold text-teal-700 tabular-nums">
              {targets.proteinPct}%
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold text-slate-900 tabular-nums tracking-tight">
              {targets.proteinGrams}
            </span>
            <span className="text-sm font-medium text-slate-500">g/day</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 tabular-nums flex items-center gap-1.5 flex-wrap">
            <span>{targets.proteinCalories.toLocaleString()} kcal</span>
            <span aria-hidden="true">·</span>
            <span>
              {targets.proteinPerKg} g/{profile.unitSystem === 'metric' ? 'kg' : 'kg body wt'}
            </span>
          </div>
        </div>

        {/* Carbohydrates */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-500">
              Daily Carbohydrates
            </span>
            <span className="font-mono text-xs font-semibold text-amber-700 tabular-nums">
              {targets.carbsPct}%
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold text-slate-900 tabular-nums tracking-tight">
              {targets.carbsGrams}
            </span>
            <span className="text-sm font-medium text-slate-500">g/day</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 tabular-nums flex items-center gap-1.5 flex-wrap">
            <span>{targets.carbsCalories.toLocaleString()} kcal</span>
            <span aria-hidden="true">·</span>
            <span>Fiber goal {targets.fiberGrams}g</span>
          </div>
        </div>

        {/* Healthy Fats */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-500">
              Healthy Fats
            </span>
            <span className="font-mono text-xs font-semibold text-blue-700 tabular-nums">
              {targets.fatPct}%
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold text-slate-900 tabular-nums tracking-tight">
              {targets.fatGrams}
            </span>
            <span className="text-sm font-medium text-slate-500">g/day</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 tabular-nums flex items-center gap-1.5 flex-wrap">
            <span>{targets.fatCalories.toLocaleString()} kcal</span>
            <span aria-hidden="true">·</span>
            <span>Water {targets.waterLiters}L/day</span>
          </div>
        </div>
      </div>
    </section>
  );
}
