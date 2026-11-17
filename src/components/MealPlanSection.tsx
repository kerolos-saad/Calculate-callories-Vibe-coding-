import { Check, ChevronDown, ChevronUp, Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import {
  MacroTargets,
  MealScheduleId,
  MealSlotId,
  PlannedMeal,
} from '../types/nutrition';
import { MEAL_SCHEDULES } from '../utils/calculations';

interface MealPlanSectionProps {
  targets: MacroTargets;
  meals: PlannedMeal[];
  scheduleId: MealScheduleId;
  onChangeSchedule: (id: MealScheduleId) => void;
  onSwapMeal: (slot: MealSlotId) => void;
  slotOptionsCount: Record<MealSlotId, number>;
}

export function MealPlanSection({
  targets,
  meals,
  scheduleId,
  onChangeSchedule,
  onSwapMeal,
  slotOptionsCount,
}: MealPlanSectionProps) {
  const [expandedSlots, setExpandedSlots] = useState<Record<string, boolean>>({
    breakfast: true,
    lunch: true,
  });
  const [viewMode, setViewMode] = useState<'meals' | 'grocery'>('meals');
  const [copiedGrocery, setCopiedGrocery] = useState(false);

  const toggleExpanded = (slot: string) => {
    setExpandedSlots((prev) => ({ ...prev, [slot]: !prev[slot] }));
  };

  const plannedTotals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Aggregate ingredients for the grocery list view
  const groceryMap = new Map<
    string,
    { name: string; amount: number; unit: string; isHealthyFat?: boolean }
  >();
  for (const meal of meals) {
    for (const ing of meal.ingredients) {
      const key = `${ing.name}__${ing.unit}`;
      const existing = groceryMap.get(key);
      if (existing) {
        existing.amount = Math.round((existing.amount + ing.scaledAmount) * 10) / 10;
      } else {
        groceryMap.set(key, {
          name: ing.name,
          amount: ing.scaledAmount,
          unit: ing.unit,
          isHealthyFat: ing.isHealthyFatSource,
        });
      }
    }
  }
  const groceryItems = Array.from(groceryMap.values());

  const handleCopyGrocery = async () => {
    const lines = [
      `Daily Meal Plan Ingredients (${plannedTotals.calories} kcal)`,
      ...groceryItems.map(
        (item) =>
          `- ${item.name}: ${item.amount} ${item.unit}${
            item.isHealthyFat ? ' [Healthy Fat]' : ''
          }`
      ),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(lines);
      setCopiedGrocery(true);
      setTimeout(() => setCopiedGrocery(false), 2000);
    } catch {
      // Clipboard fallback ignored silently
    }
  };

  return (
    <section id="meal-plan" aria-label="Personalized daily meal plan" className="space-y-5">
      {/* Header & Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              Daily Meal Plan
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Portions automatically scaled to match your{' '}
              <span className="font-mono font-medium text-slate-700 tabular-nums">
                {targets.targetCalories.toLocaleString()} kcal
              </span>{' '}
              daily target. Swap any meal to explore alternatives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Schedule Selector */}
            <div
              role="group"
              aria-label="Meal frequency schedule"
              className="inline-flex items-center p-1 bg-slate-100 rounded-lg"
            >
              {MEAL_SCHEDULES.map((sched) => {
                const active = scheduleId === sched.id;
                return (
                  <button
                    key={sched.id}
                    type="button"
                    onClick={() => onChangeSchedule(sched.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sched.label}
                  </button>
                );
              })}
            </div>

            {/* Meal Cards vs Grocery List Toggle */}
            <div
              role="group"
              aria-label="Plan view mode"
              className="inline-flex items-center p-1 bg-slate-100 rounded-lg"
            >
              <button
                type="button"
                onClick={() => setViewMode('meals')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  viewMode === 'meals'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Meals
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grocery')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  viewMode === 'grocery'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Grocery List ({groceryItems.length})
              </button>
            </div>
          </div>
        </div>

        {/* Planned vs Target Ledger Strip */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-slate-500">Planned Calories</div>
            <div className="font-mono text-sm font-semibold text-slate-900 tabular-nums mt-0.5">
              {plannedTotals.calories.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-500">
                / {targets.targetCalories.toLocaleString()} kcal
              </span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Planned Protein</div>
            <div className="font-mono text-sm font-semibold text-teal-700 tabular-nums mt-0.5">
              {plannedTotals.protein}g{' '}
              <span className="text-xs font-normal text-slate-500">
                / {targets.proteinGrams}g target
              </span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Planned Carbs</div>
            <div className="font-mono text-sm font-semibold text-amber-700 tabular-nums mt-0.5">
              {plannedTotals.carbs}g{' '}
              <span className="text-xs font-normal text-slate-500">
                / {targets.carbsGrams}g target
              </span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Planned Healthy Fats</div>
            <div className="font-mono text-sm font-semibold text-blue-700 tabular-nums mt-0.5">
              {plannedTotals.fat}g{' '}
              <span className="text-xs font-normal text-slate-500">
                / {targets.fatGrams}g target
              </span>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'meals' ? (
        <div className="space-y-4">
          {meals.map((meal) => {
            const isExpanded = Boolean(expandedSlots[meal.slot]);
            const optionCount = slotOptionsCount[meal.slot] ?? 1;

            return (
              <article
                key={meal.slot}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden"
              >
                <div className="p-5 sm:px-6 sm:py-5">
                  {/* Top metadata & action line */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">
                        {meal.slotLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{meal.timeWindow}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {meal.calorieSharePct}% of day
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{meal.option.prepMinutes} min prep</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {optionCount > 1 && (
                        <button
                          type="button"
                          onClick={() => onSwapMeal(meal.slot)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                          Swap Meal
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleExpanded(meal.slot)}
                        aria-expanded={isExpanded}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                      >
                        {isExpanded ? (
                          <>
                            Hide Portions
                            <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                          </>
                        ) : (
                          <>
                            View Portions
                            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Meal Title & Macro Row */}
                  <div className="mt-3 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-slate-900">
                        {meal.option.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Healthy fat source:{' '}
                        <span className="font-medium text-slate-700">
                          {meal.option.healthyFatHighlight}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-5 sm:gap-6 shrink-0 font-mono tabular-nums">
                      <div>
                        <div className="text-[11px] font-sans text-slate-500">
                          Calories
                        </div>
                        <div className="text-base font-semibold text-slate-900">
                          {meal.calories} kcal
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-sans text-slate-500">
                          Protein
                        </div>
                        <div className="text-base font-semibold text-teal-700">
                          {meal.protein}g
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-sans text-slate-500">
                          Carbs
                        </div>
                        <div className="text-base font-semibold text-amber-700">
                          {meal.carbs}g
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-sans text-slate-500">
                          Healthy Fat
                        </div>
                        <div className="text-base font-semibold text-blue-700">
                          {meal.fat}g
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable Scaled Ingredient Table */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/60 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[540px]">
                      <thead>
                        <tr className="border-b border-slate-200/80 text-[11px] font-medium text-slate-500">
                          <th className="py-2.5 pl-6 pr-4 font-medium">
                            Ingredient
                          </th>
                          <th className="py-2.5 px-3 text-right font-medium">
                            Portion
                          </th>
                          <th className="py-2.5 px-3 text-right font-medium">
                            Calories
                          </th>
                          <th className="py-2.5 px-3 text-right font-medium">
                            Protein
                          </th>
                          <th className="py-2.5 px-3 text-right font-medium">
                            Carbs
                          </th>
                          <th className="py-2.5 pl-3 pr-6 text-right font-medium">
                            Healthy Fat
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 text-sm">
                        {meal.ingredients.map((ing) => (
                          <tr
                            key={ing.name}
                            className="hover:bg-white/70 transition-colors"
                          >
                            <td className="py-2.5 pl-6 pr-4 text-slate-800">
                              <span>{ing.name}</span>
                              {ing.isHealthyFatSource && (
                                <span className="ml-2 text-xs text-blue-700 font-medium">
                                  · Healthy fat source
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-xs font-medium text-slate-900 tabular-nums whitespace-nowrap">
                              {ing.scaledAmount} {ing.unit}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-xs text-slate-700 tabular-nums">
                              {ing.scaledCalories}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-xs text-teal-700 tabular-nums">
                              {ing.scaledProtein}g
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-xs text-amber-700 tabular-nums">
                              {ing.scaledCarbs}g
                            </td>
                            <td className="py-2.5 pl-3 pr-6 text-right font-mono text-xs text-blue-700 tabular-nums">
                              {ing.scaledFat}g
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        /* Consolidated Daily Grocery List View */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-5 sm:px-6 flex items-center justify-between gap-4 border-b border-slate-100">
            <div>
              <h3 className="font-display text-base font-semibold text-slate-900">
                Daily Ingredient Totals
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Combined scaled amounts across all {meals.length} scheduled meals
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyGrocery}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              {copiedGrocery ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  Copy List
                </>
              )}
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {groceryItems.map((item) => (
              <div
                key={`${item.name}-${item.unit}`}
                className="px-6 py-3 flex items-center justify-between gap-4 text-sm hover:bg-slate-50/70"
              >
                <div className="text-slate-800">
                  <span>{item.name}</span>
                  {item.isHealthyFat && (
                    <span className="ml-2 text-xs text-blue-700 font-medium">
                      · Healthy fat source
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                  {item.amount} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
