import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { KpiStrip } from './components/KpiStrip';
import { MacroCharts } from './components/MacroCharts';
import { MealPlanSection } from './components/MealPlanSection';
import { MethodologySection } from './components/MethodologySection';
import { ProfileSidebar } from './components/ProfileSidebar';
import { MEAL_DATABASE } from './data/meals';
import { MealScheduleId, MealSlotId, UserProfile } from './types/nutrition';
import {
  DEFAULT_PROFILE,
  buildScaledMealPlan,
  calculateMacroTargets,
  getSlotOptionsCount,
} from './utils/calculations';

const STORAGE_KEY = 'macroledger_profile_v1';

function loadSavedProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      customSplit: {
        ...DEFAULT_PROFILE.customSplit,
        ...(parsed.customSplit ?? {}),
      },
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(loadSavedProfile);
  const [selectedMealIdx, setSelectedMealIdx] = useState<
    Partial<Record<MealSlotId, number>>
  >({});

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore storage quota errors
    }
  }, [profile]);

  const targets = useMemo(() => calculateMacroTargets(profile), [profile]);

  const meals = useMemo(
    () =>
      buildScaledMealPlan(
        targets,
        profile.mealSchedule,
        profile.dietStyle,
        MEAL_DATABASE,
        selectedMealIdx
      ),
    [targets, profile.mealSchedule, profile.dietStyle, selectedMealIdx]
  );

  const slotOptionsCount = useMemo<Record<MealSlotId, number>>(
    () => ({
      breakfast: getSlotOptionsCount('breakfast', profile.dietStyle, MEAL_DATABASE),
      lunch: getSlotOptionsCount('lunch', profile.dietStyle, MEAL_DATABASE),
      afternoon_snack: getSlotOptionsCount(
        'afternoon_snack',
        profile.dietStyle,
        MEAL_DATABASE
      ),
      dinner: getSlotOptionsCount('dinner', profile.dietStyle, MEAL_DATABASE),
      evening_snack: getSlotOptionsCount(
        'evening_snack',
        profile.dietStyle,
        MEAL_DATABASE
      ),
    }),
    [profile.dietStyle]
  );

  const handleSwapMeal = (slot: MealSlotId) => {
    setSelectedMealIdx((prev) => ({
      ...prev,
      [slot]: ((prev[slot] ?? 0) + 1) % Math.max(1, slotOptionsCount[slot]),
    }));
  };

  const handleChangeSchedule = (mealSchedule: MealScheduleId) => {
    setProfile((prev) => ({ ...prev, mealSchedule }));
  };

  const handleReset = () => {
    setProfile(DEFAULT_PROFILE);
    setSelectedMealIdx({});
  };

  const handleExportPlan = () => {
    const lines = [
      'MacroLedger — Daily Nutrition & Meal Plan',
      '==========================================',
      '',
      `Profile: ${profile.sex === 'male' ? 'Male' : 'Female'}, ${profile.age} yrs, ${profile.weightKg} kg, ${profile.heightCm} cm`,
      `BMR: ${targets.bmr} kcal | TDEE: ${targets.tdee} kcal`,
      `Daily Target: ${targets.targetCalories} kcal/day`,
      `Macros: Protein ${targets.proteinGrams}g (${targets.proteinPct}%) | Carbs ${targets.carbsGrams}g (${targets.carbsPct}%) | Healthy Fats ${targets.fatGrams}g (${targets.fatPct}%)`,
      `Fiber Goal: ${targets.fiberGrams}g | Hydration Goal: ${targets.waterLiters} L/day`,
      '',
      'Daily Meal Plan',
      '---------------',
      ...meals.flatMap((meal) => [
        '',
        `${meal.slotLabel} (${meal.timeWindow}) — ${meal.option.title}`,
        `Totals: ${meal.calories} kcal | ${meal.protein}g Protein | ${meal.carbs}g Carbs | ${meal.fat}g Healthy Fat`,
        ...meal.ingredients.map(
          (ing) =>
            `  - ${ing.name}: ${ing.scaledAmount} ${ing.unit} (${ing.scaledCalories} kcal)`
        ),
      ]),
      '',
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `macroledger-plan-${targets.targetCalories}kcal.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header onExportPlan={handleExportPlan} />

      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Title Header */}
        <div className="mb-6 sm:mb-8">
          <h1
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
            style={{ textWrap: 'balance' }}
          >
            Daily Calorie, Macro &amp; Meal Plan Calculator
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600 max-w-2xl">
            Calculate your daily calories, protein, carbohydrates, and healthy
            fats from your body metrics and activity level, with live visual
            breakdowns and portion-scaled meals.
          </p>
        </div>

        {/* Workspace Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-4 xl:col-span-3">
            <ProfileSidebar
              profile={profile}
              onChange={setProfile}
              onReset={handleReset}
            />
          </div>

          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            <KpiStrip targets={targets} profile={profile} />
            <MacroCharts targets={targets} meals={meals} />
            <MealPlanSection
              targets={targets}
              meals={meals}
              scheduleId={profile.mealSchedule}
              onChangeSchedule={handleChangeSchedule}
              onSwapMeal={handleSwapMeal}
              slotOptionsCount={slotOptionsCount}
            />
            <MethodologySection profile={profile} targets={targets} />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            MacroLedger · Estimates based on Mifflin-St Jeor metabolic equations
            for informational nutrition planning.
          </span>
          <span className="tabular-nums">
            Energy density: 4 kcal/g protein &amp; carbs · 9 kcal/g healthy fats
          </span>
        </div>
      </footer>
    </div>
  );
}
