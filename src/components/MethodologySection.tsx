import { MacroTargets, UserProfile } from '../types/nutrition';

interface MethodologySectionProps {
  profile: UserProfile;
  targets: MacroTargets;
}

export function MethodologySection({
  profile,
  targets,
}: MethodologySectionProps) {
  const sexConstant = profile.sex === 'male' ? '+ 5' : '− 161';

  return (
    <section
      id="methodology"
      aria-label="Calculation methodology"
      className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900">
            How Your Targets Are Calculated
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Live Mifflin-St Jeor metabolic calculation using your exact profile values
          </p>
        </div>
        <span className="text-xs text-slate-500 font-mono tabular-nums">
          Hydration target: {targets.waterLiters} L/day
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            01. Basal Metabolic Rate (BMR)
          </h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Estimated resting energy expenditure via the Mifflin-St Jeor equation:
          </p>
          <div className="mt-2.5 p-3 bg-slate-50 rounded-lg font-mono text-xs text-slate-800 tabular-nums leading-relaxed">
            (10 × {profile.weightKg}kg) + (6.25 × {profile.heightCm}cm) − (5 ×{' '}
            {profile.age}) {sexConstant} ={' '}
            <span className="font-semibold text-slate-900">
              {targets.bmr.toLocaleString()} kcal
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            02. Total Daily Energy (TDEE)
          </h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Resting BMR scaled by your activity factor and adjusted for your goal:
          </p>
          <div className="mt-2.5 p-3 bg-slate-50 rounded-lg font-mono text-xs text-slate-800 tabular-nums leading-relaxed">
            {targets.bmr.toLocaleString()} × {targets.activityMultiplier} ={' '}
            {targets.tdee.toLocaleString()} TDEE
            <br />
            Goal ({targets.goalDeltaPct >= 0 ? `+${targets.goalDeltaPct}%` : `${targets.goalDeltaPct}%`}):{' '}
            <span className="font-semibold text-emerald-700">
              {targets.targetCalories.toLocaleString()} kcal/day
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            03. Healthy Fat &amp; Macro Density
          </h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Prioritizes monounsaturated &amp; omega-3 fats (olive oil, avocado,
            fatty fish, walnuts, chia) alongside lean protein and complex fiber:
          </p>
          <div className="mt-2.5 p-3 bg-slate-50 rounded-lg font-mono text-xs text-slate-800 tabular-nums leading-relaxed">
            Protein: {targets.proteinGrams}g × 4 = {targets.proteinCalories} kcal
            <br />
            Carbs: {targets.carbsGrams}g × 4 = {targets.carbsCalories} kcal
            <br />
            Healthy Fats: {targets.fatGrams}g × 9 = {targets.fatCalories} kcal
          </div>
        </div>
      </div>
    </section>
  );
}
