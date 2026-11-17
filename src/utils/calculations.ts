import {
  ActivityLevelId,
  DietStyleId,
  GoalId,
  MacroPresetId,
  MacroSplit,
  MacroTargets,
  MealOption,
  MealScheduleId,
  MealSlotId,
  PlannedMeal,
  ScaledIngredient,
  UserProfile,
} from '../types/nutrition';

export interface ActivityOption {
  id: ActivityLevelId;
  label: string;
  multiplier: number;
  summary: string;
}

export const ACTIVITY_OPTIONS: ActivityOption[] = [
  {
    id: 'sedentary',
    label: 'Sedentary',
    multiplier: 1.2,
    summary: 'Desk work, minimal structured exercise',
  },
  {
    id: 'light',
    label: 'Lightly Active',
    multiplier: 1.375,
    summary: 'Light exercise or brisk walking 1–3 days/week',
  },
  {
    id: 'moderate',
    label: 'Moderately Active',
    multiplier: 1.55,
    summary: 'Moderate training or sports 3–5 days/week',
  },
  {
    id: 'very',
    label: 'Very Active',
    multiplier: 1.725,
    summary: 'Hard training or physical work 6–7 days/week',
  },
  {
    id: 'athlete',
    label: 'Athlete',
    multiplier: 1.9,
    summary: 'Twice-daily training or demanding manual labor',
  },
];

export interface GoalOption {
  id: GoalId;
  label: string;
  deltaPct: number;
  note: string;
}

export const GOAL_OPTIONS: GoalOption[] = [
  { id: 'fat_loss', label: 'Fat Loss', deltaPct: -20, note: '−20% steady deficit' },
  { id: 'mild_deficit', label: 'Mild Cut', deltaPct: -10, note: '−10% gentle deficit' },
  { id: 'maintain', label: 'Maintain', deltaPct: 0, note: 'Maintenance TDEE' },
  { id: 'lean_gain', label: 'Lean Gain', deltaPct: 12, note: '+12% clean surplus' },
];

export interface MacroPresetOption {
  id: MacroPresetId;
  label: string;
  split: MacroSplit;
  description: string;
}

export const MACRO_PRESETS: MacroPresetOption[] = [
  {
    id: 'balanced',
    label: 'Balanced',
    split: { proteinPct: 30, carbsPct: 40, fatPct: 30 },
    description: 'Sustainable everyday energy & recovery',
  },
  {
    id: 'high_protein',
    label: 'High Protein',
    split: { proteinPct: 35, carbsPct: 35, fatPct: 30 },
    description: 'Extra muscle retention during fat loss or training',
  },
  {
    id: 'carb_forward',
    label: 'Endurance',
    split: { proteinPct: 25, carbsPct: 50, fatPct: 25 },
    description: 'Higher glycogen support for frequent cardio',
  },
  {
    id: 'low_carb',
    label: 'Healthy-Fat Focus',
    split: { proteinPct: 30, carbsPct: 20, fatPct: 50 },
    description: 'Lower glycemic load anchored by monounsaturated fats',
  },
  {
    id: 'custom',
    label: 'Custom Split',
    split: { proteinPct: 30, carbsPct: 40, fatPct: 30 },
    description: 'Fine-tune exact macro percentages manually',
  },
];

export interface DietStyleOption {
  id: DietStyleId;
  label: string;
}

export const DIET_STYLE_OPTIONS: DietStyleOption[] = [
  { id: 'standard', label: 'Standard' },
  { id: 'mediterranean', label: 'Mediterranean' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Plant-Based' },
];

export interface ScheduleConfig {
  id: MealScheduleId;
  label: string;
  slots: {
    slot: MealSlotId;
    label: string;
    timeWindow: string;
    sharePct: number;
  }[];
}

export const MEAL_SCHEDULES: ScheduleConfig[] = [
  {
    id: 'three_meals',
    label: '3 Main Meals',
    slots: [
      { slot: 'breakfast', label: 'Breakfast', timeWindow: '7:30 – 9:00 AM', sharePct: 28 },
      { slot: 'lunch', label: 'Lunch', timeWindow: '12:30 – 1:30 PM', sharePct: 38 },
      { slot: 'dinner', label: 'Dinner', timeWindow: '6:30 – 8:00 PM', sharePct: 34 },
    ],
  },
  {
    id: 'three_plus_one',
    label: '3 Meals + 1 Snack',
    slots: [
      { slot: 'breakfast', label: 'Breakfast', timeWindow: '7:30 – 8:30 AM', sharePct: 25 },
      { slot: 'lunch', label: 'Lunch', timeWindow: '12:30 – 1:30 PM', sharePct: 33 },
      { slot: 'afternoon_snack', label: 'Afternoon Snack', timeWindow: '4:00 – 4:30 PM', sharePct: 14 },
      { slot: 'dinner', label: 'Dinner', timeWindow: '7:00 – 8:00 PM', sharePct: 28 },
    ],
  },
  {
    id: 'three_plus_two',
    label: '3 Meals + 2 Snacks',
    slots: [
      { slot: 'breakfast', label: 'Breakfast', timeWindow: '7:00 – 8:00 AM', sharePct: 22 },
      { slot: 'lunch', label: 'Lunch', timeWindow: '12:00 – 1:00 PM', sharePct: 30 },
      { slot: 'afternoon_snack', label: 'Afternoon Snack', timeWindow: '3:30 – 4:00 PM', sharePct: 13 },
      { slot: 'dinner', label: 'Dinner', timeWindow: '6:30 – 7:30 PM', sharePct: 25 },
      { slot: 'evening_snack', label: 'Evening Snack', timeWindow: '9:00 – 9:30 PM', sharePct: 10 },
    ],
  },
];

export const DEFAULT_PROFILE: UserProfile = {
  unitSystem: 'metric',
  sex: 'male',
  age: 30,
  weightKg: 76,
  heightCm: 176,
  activityLevel: 'moderate',
  goal: 'maintain',
  macroPreset: 'balanced',
  customSplit: { proteinPct: 30, carbsPct: 40, fatPct: 30 },
  dietStyle: 'mediterranean',
  mealSchedule: 'three_plus_one',
};

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

export function lbsToKg(lbs: number): number {
  return Math.round((lbs / 2.20462) * 10) / 10;
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return { feet, inches };
}

export function feetInchesToCm(feet: number, inches: number): number {
  const totalInches = Math.max(0, feet) * 12 + Math.max(0, inches);
  return Math.round(totalInches * 2.54);
}

export function calculateMacroTargets(profile: UserProfile): MacroTargets {
  const safeWeight = Math.min(250, Math.max(35, profile.weightKg));
  const safeHeight = Math.min(230, Math.max(120, profile.heightCm));
  const safeAge = Math.min(95, Math.max(14, profile.age));

  // Mifflin-St Jeor Equation
  const sexOffset = profile.sex === 'male' ? 5 : -161;
  const bmrRaw = 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge + sexOffset;
  const bmr = Math.round(bmrRaw);

  const activity =
    ACTIVITY_OPTIONS.find((a) => a.id === profile.activityLevel) ??
    ACTIVITY_OPTIONS[2];
  const tdee = Math.round(bmrRaw * activity.multiplier);

  const goal =
    GOAL_OPTIONS.find((g) => g.id === profile.goal) ?? GOAL_OPTIONS[2];

  // Floor at 1200 kcal for women / 1400 kcal for men for safe nutrition bounds
  const safetyFloor = profile.sex === 'male' ? 1400 : 1200;
  const targetCalories = Math.max(
    safetyFloor,
    Math.round(tdee * (1 + goal.deltaPct / 100))
  );

  const split: MacroSplit =
    profile.macroPreset === 'custom'
      ? profile.customSplit
      : (MACRO_PRESETS.find((p) => p.id === profile.macroPreset)?.split ??
        MACRO_PRESETS[0].split);

  const totalPct = Math.max(1, split.proteinPct + split.carbsPct + split.fatPct);
  const normP = (split.proteinPct / totalPct) * 100;
  const normC = (split.carbsPct / totalPct) * 100;
  const normF = 100 - normP - normC;

  const proteinCalories = Math.round((targetCalories * normP) / 100);
  const carbsCalories = Math.round((targetCalories * normC) / 100);
  const fatCalories = Math.max(0, targetCalories - proteinCalories - carbsCalories);

  const proteinGrams = Math.round(proteinCalories / 4);
  const carbsGrams = Math.round(carbsCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);

  const fiberGrams = Math.max(20, Math.round((targetCalories / 1000) * 14));
  const waterLiters = Math.round((safeWeight * 0.035) * 10) / 10;
  const proteinPerKg = Math.round((proteinGrams / safeWeight) * 10) / 10;
  const heightMeters = safeHeight / 100;
  const bmi = Math.round((safeWeight / (heightMeters * heightMeters)) * 10) / 10;

  return {
    bmr,
    activityMultiplier: activity.multiplier,
    tdee,
    goalDeltaPct: goal.deltaPct,
    targetCalories,
    proteinGrams,
    proteinCalories,
    proteinPct: Math.round(normP),
    carbsGrams,
    carbsCalories,
    carbsPct: Math.round(normC),
    fatGrams,
    fatCalories,
    fatPct: Math.round(normF),
    fiberGrams,
    waterLiters,
    proteinPerKg,
    bmi,
  };
}

function roundIngredientAmount(amount: number, unit: string): number {
  if (unit === 'whole' || unit === 'slice' || unit === 'slices' || unit === 'scoop') {
    return Math.max(0.5, Math.round(amount * 2) / 2);
  }
  if (unit === 'tbsp' || unit === 'tsp') {
    return Math.max(0.5, Math.round(amount * 2) / 2);
  }
  if (amount >= 40) {
    return Math.round(amount / 5) * 5;
  }
  return Math.max(1, Math.round(amount));
}

export function buildScaledMealPlan(
  targets: MacroTargets,
  scheduleId: MealScheduleId,
  dietStyle: DietStyleId,
  mealDatabase: MealOption[],
  selectedIndexBySlot: Partial<Record<MealSlotId, number>>
): PlannedMeal[] {
  const schedule =
    MEAL_SCHEDULES.find((s) => s.id === scheduleId) ?? MEAL_SCHEDULES[1];

  return schedule.slots.map((slotMeta) => {
    const slotTargetCalories = Math.round(
      (targets.targetCalories * slotMeta.sharePct) / 100
    );

    const matchingOptions = mealDatabase.filter(
      (m) => m.slot === slotMeta.slot && m.dietStyles.includes(dietStyle)
    );
    const fallbackOptions =
      matchingOptions.length > 0
        ? matchingOptions
        : mealDatabase.filter((m) => m.slot === slotMeta.slot);

    const idx = (selectedIndexBySlot[slotMeta.slot] ?? 0) % fallbackOptions.length;
    const chosenOption = fallbackOptions[idx];

    const baseCalories = chosenOption.ingredients.reduce(
      (acc, ing) => acc + ing.calories,
      0
    );
    const rawScale = baseCalories > 0 ? slotTargetCalories / baseCalories : 1;
    // Keep portion scaling within realistic culinary bounds while tracking target closely
    const scaleFactor = Math.min(2.4, Math.max(0.55, rawScale));

    const scaledIngredients: ScaledIngredient[] = chosenOption.ingredients.map(
      (ing) => {
        const scaledAmount = roundIngredientAmount(
          ing.amount * scaleFactor,
          ing.unit
        );
        const exactRatio = ing.amount > 0 ? scaledAmount / ing.amount : scaleFactor;
        return {
          ...ing,
          scaledAmount,
          scaledCalories: Math.round(ing.calories * exactRatio),
          scaledProtein: Math.round(ing.protein * exactRatio * 10) / 10,
          scaledCarbs: Math.round(ing.carbs * exactRatio * 10) / 10,
          scaledFat: Math.round(ing.fat * exactRatio * 10) / 10,
        };
      }
    );

    const calories = scaledIngredients.reduce(
      (sum, item) => sum + item.scaledCalories,
      0
    );
    const protein = Math.round(
      scaledIngredients.reduce((sum, item) => sum + item.scaledProtein, 0)
    );
    const carbs = Math.round(
      scaledIngredients.reduce((sum, item) => sum + item.scaledCarbs, 0)
    );
    const fat = Math.round(
      scaledIngredients.reduce((sum, item) => sum + item.scaledFat, 0)
    );

    return {
      slot: slotMeta.slot,
      slotLabel: slotMeta.label,
      timeWindow: slotMeta.timeWindow,
      calorieSharePct: slotMeta.sharePct,
      targetCalories: slotTargetCalories,
      option: chosenOption,
      scaleFactor,
      calories,
      protein,
      carbs,
      fat,
      ingredients: scaledIngredients,
    };
  });
}

export function getSlotOptionsCount(
  slot: MealSlotId,
  dietStyle: DietStyleId,
  mealDatabase: MealOption[]
): number {
  const matches = mealDatabase.filter(
    (m) => m.slot === slot && m.dietStyles.includes(dietStyle)
  );
  return matches.length > 0
    ? matches.length
    : mealDatabase.filter((m) => m.slot === slot).length;
}
