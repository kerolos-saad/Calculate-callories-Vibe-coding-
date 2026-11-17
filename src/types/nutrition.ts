export type UnitSystem = 'metric' | 'imperial';
export type BiologicalSex = 'male' | 'female';

export type ActivityLevelId =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'very'
  | 'athlete';

export type GoalId = 'fat_loss' | 'mild_deficit' | 'maintain' | 'lean_gain';

export type MacroPresetId =
  | 'balanced'
  | 'high_protein'
  | 'carb_forward'
  | 'low_carb'
  | 'custom';

export type DietStyleId =
  | 'standard'
  | 'mediterranean'
  | 'vegetarian'
  | 'vegan';

export type MealScheduleId = 'three_meals' | 'three_plus_one' | 'three_plus_two';

export interface MacroSplit {
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}

export interface UserProfile {
  unitSystem: UnitSystem;
  sex: BiologicalSex;
  age: number;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevelId;
  goal: GoalId;
  macroPreset: MacroPresetId;
  customSplit: MacroSplit;
  dietStyle: DietStyleId;
  mealSchedule: MealScheduleId;
}

export interface MacroTargets {
  bmr: number;
  activityMultiplier: number;
  tdee: number;
  goalDeltaPct: number;
  targetCalories: number;
  proteinGrams: number;
  proteinCalories: number;
  proteinPct: number;
  carbsGrams: number;
  carbsCalories: number;
  carbsPct: number;
  fatGrams: number;
  fatCalories: number;
  fatPct: number;
  fiberGrams: number;
  waterLiters: number;
  proteinPerKg: number;
  bmi: number;
}

export type MealSlotId =
  | 'breakfast'
  | 'lunch'
  | 'afternoon_snack'
  | 'dinner'
  | 'evening_snack';

export interface IngredientItem {
  name: string;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isHealthyFatSource?: boolean;
}

export interface MealOption {
  id: string;
  slot: MealSlotId;
  dietStyles: DietStyleId[];
  title: string;
  prepMinutes: number;
  healthyFatHighlight: string;
  ingredients: IngredientItem[];
}

export interface ScaledIngredient extends IngredientItem {
  scaledAmount: number;
  scaledCalories: number;
  scaledProtein: number;
  scaledCarbs: number;
  scaledFat: number;
}

export interface PlannedMeal {
  slot: MealSlotId;
  slotLabel: string;
  timeWindow: string;
  calorieSharePct: number;
  targetCalories: number;
  option: MealOption;
  scaleFactor: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: ScaledIngredient[];
}
