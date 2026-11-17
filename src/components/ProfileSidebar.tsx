import { RotateCcw } from 'lucide-react';
import {
  BiologicalSex,
  MacroSplit,
  UnitSystem,
  UserProfile,
} from '../types/nutrition';
import {
  ACTIVITY_OPTIONS,
  DIET_STYLE_OPTIONS,
  GOAL_OPTIONS,
  MACRO_PRESETS,
  cmToFeetInches,
  feetInchesToCm,
  kgToLbs,
  lbsToKg,
} from '../utils/calculations';

interface ProfileSidebarProps {
  profile: UserProfile;
  onChange: (next: UserProfile) => void;
  onReset: () => void;
}

export function ProfileSidebar({
  profile,
  onChange,
  onReset,
}: ProfileSidebarProps) {
  const isMetric = profile.unitSystem === 'metric';
  const weightDisplay = isMetric ? profile.weightKg : kgToLbs(profile.weightKg);
  const { feet, inches } = cmToFeetInches(profile.heightCm);

  const activeSplit: MacroSplit =
    profile.macroPreset === 'custom'
      ? profile.customSplit
      : (MACRO_PRESETS.find((p) => p.id === profile.macroPreset)?.split ??
        MACRO_PRESETS[0].split);

  const handleUnitChange = (unitSystem: UnitSystem) => {
    onChange({ ...profile, unitSystem });
  };

  const handleSexChange = (sex: BiologicalSex) => {
    onChange({ ...profile, sex });
  };

  const handleAgeChange = (val: number) => {
    if (Number.isNaN(val)) return;
    onChange({ ...profile, age: Math.min(95, Math.max(14, val)) });
  };

  const handleWeightInput = (val: number) => {
    if (Number.isNaN(val)) return;
    const kg = isMetric ? val : lbsToKg(val);
    onChange({
      ...profile,
      weightKg: Math.min(250, Math.max(35, Math.round(kg * 10) / 10)),
    });
  };

  const handleHeightCmInput = (val: number) => {
    if (Number.isNaN(val)) return;
    onChange({
      ...profile,
      heightCm: Math.min(230, Math.max(120, Math.round(val))),
    });
  };

  const handleImperialHeightChange = (nextFeet: number, nextInches: number) => {
    const safeFeet = Math.min(7, Math.max(4, nextFeet));
    const safeInches = Math.min(11, Math.max(0, nextInches));
    onChange({
      ...profile,
      heightCm: Math.min(230, Math.max(120, feetInchesToCm(safeFeet, safeInches))),
    });
  };

  const handleCustomMacroChange = (
    key: keyof MacroSplit,
    newVal: number
  ) => {
    const clamped = Math.min(70, Math.max(10, newVal));
    const current = { ...activeSplit };
    const others = (['proteinPct', 'carbsPct', 'fatPct'] as const).filter(
      (k) => k !== key
    );
    const remaining = 100 - clamped;
    const otherSum = current[others[0]] + current[others[1]];

    let nextFirst: number;
    let nextSecond: number;
    if (otherSum <= 0) {
      nextFirst = Math.floor(remaining / 2);
      nextSecond = remaining - nextFirst;
    } else {
      nextFirst = Math.round((current[others[0]] / otherSum) * remaining);
      nextSecond = remaining - nextFirst;
    }

    const nextSplit: MacroSplit = {
      ...current,
      [key]: clamped,
      [others[0]]: nextFirst,
      [others[1]]: nextSecond,
    };

    onChange({
      ...profile,
      macroPreset: 'custom',
      customSplit: nextSplit,
    });
  };

  return (
    <aside
      id="calculator"
      aria-label="Daily nutrition parameters"
      className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-6"
    >
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900">
            Body &amp; Activity Profile
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Live recalculation across charts &amp; meals
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          title="Reset to default profile"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>

      {/* Units & Biological Sex */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        <div>
          <span className="block text-xs font-medium text-slate-600 mb-1.5">
            Measurement Units
          </span>
          <div
            role="group"
            aria-label="Measurement units"
            className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg"
          >
            <button
              type="button"
              onClick={() => handleUnitChange('metric')}
              className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                isMetric
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Metric (kg / cm)
            </button>
            <button
              type="button"
              onClick={() => handleUnitChange('imperial')}
              className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                !isMetric
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Imperial (lbs / ft)
            </button>
          </div>
        </div>

        <div>
          <span className="block text-xs font-medium text-slate-600 mb-1.5">
            Biological Sex (for BMR formula)
          </span>
          <div
            role="group"
            aria-label="Biological sex"
            className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg"
          >
            <button
              type="button"
              onClick={() => handleSexChange('male')}
              className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                profile.sex === 'male'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => handleSexChange('female')}
              className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                profile.sex === 'female'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Female
            </button>
          </div>
        </div>
      </div>

      {/* Age, Weight, Height */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        {/* Age */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="input-age"
              className="text-xs font-medium text-slate-700"
            >
              Age
            </label>
            <div className="flex items-center gap-1.5">
              <input
                id="input-age"
                type="number"
                min={14}
                max={95}
                value={profile.age}
                onChange={(e) => handleAgeChange(Number(e.target.value))}
                className="w-16 px-2 py-1 text-right font-mono text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-md tabular-nums focus:outline-none focus:border-emerald-700"
              />
              <span className="text-xs text-slate-500 w-7">yrs</span>
            </div>
          </div>
          <input
            aria-label="Age slider"
            type="range"
            min={14}
            max={90}
            value={profile.age}
            onChange={(e) => handleAgeChange(Number(e.target.value))}
            className="w-full macro-slider"
          />
        </div>

        {/* Weight */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="input-weight"
              className="text-xs font-medium text-slate-700"
            >
              Weight
            </label>
            <div className="flex items-center gap-1.5">
              <input
                id="input-weight"
                type="number"
                step={isMetric ? 0.5 : 1}
                min={isMetric ? 35 : 77}
                max={isMetric ? 250 : 550}
                value={weightDisplay}
                onChange={(e) => handleWeightInput(Number(e.target.value))}
                className="w-20 px-2 py-1 text-right font-mono text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-md tabular-nums focus:outline-none focus:border-emerald-700"
              />
              <span className="text-xs text-slate-500 w-7">
                {isMetric ? 'kg' : 'lbs'}
              </span>
            </div>
          </div>
          <input
            aria-label="Weight slider"
            type="range"
            min={isMetric ? 40 : 88}
            max={isMetric ? 160 : 352}
            step={isMetric ? 0.5 : 1}
            value={weightDisplay}
            onChange={(e) => handleWeightInput(Number(e.target.value))}
            className="w-full macro-slider"
          />
        </div>

        {/* Height */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={isMetric ? 'input-height-cm' : 'input-height-ft'}
              className="text-xs font-medium text-slate-700"
            >
              Height
            </label>
            {isMetric ? (
              <div className="flex items-center gap-1.5">
                <input
                  id="input-height-cm"
                  type="number"
                  min={120}
                  max={230}
                  value={profile.heightCm}
                  onChange={(e) => handleHeightCmInput(Number(e.target.value))}
                  className="w-20 px-2 py-1 text-right font-mono text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-md tabular-nums focus:outline-none focus:border-emerald-700"
                />
                <span className="text-xs text-slate-500 w-7">cm</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <input
                  id="input-height-ft"
                  type="number"
                  min={4}
                  max={7}
                  value={feet}
                  onChange={(e) =>
                    handleImperialHeightChange(Number(e.target.value), inches)
                  }
                  className="w-14 px-2 py-1 text-right font-mono text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-md tabular-nums focus:outline-none focus:border-emerald-700"
                />
                <span className="text-xs text-slate-500">ft</span>
                <input
                  aria-label="Height inches"
                  type="number"
                  min={0}
                  max={11}
                  value={inches}
                  onChange={(e) =>
                    handleImperialHeightChange(feet, Number(e.target.value))
                  }
                  className="w-14 px-2 py-1 text-right font-mono text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-md tabular-nums focus:outline-none focus:border-emerald-700"
                />
                <span className="text-xs text-slate-500">in</span>
              </div>
            )}
          </div>
          <input
            aria-label="Height slider"
            type="range"
            min={140}
            max={215}
            value={profile.heightCm}
            onChange={(e) => handleHeightCmInput(Number(e.target.value))}
            className="w-full macro-slider"
          />
        </div>
      </div>

      {/* Activity Level */}
      <div className="pt-4 border-t border-slate-100">
        <span className="block text-xs font-medium text-slate-700 mb-2">
          Daily Activity Level
        </span>
        <div className="divide-y divide-slate-100 border-y border-slate-100 -mx-1">
          {ACTIVITY_OPTIONS.map((opt) => {
            const active = profile.activityLevel === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ ...profile, activityLevel: opt.id })}
                className={`w-full text-left px-2.5 py-2.5 transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                  active
                    ? 'bg-emerald-50/70 text-slate-900 rounded-md'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <span>{opt.label}</span>
                    {active && (
                      <span className="text-xs font-medium text-emerald-700">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                    {opt.summary}
                  </div>
                </div>
                <span className="font-mono text-xs font-medium text-slate-500 tabular-nums shrink-0 pt-0.5">
                  ×{opt.multiplier}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Goal */}
      <div className="pt-4 border-t border-slate-100">
        <span className="block text-xs font-medium text-slate-700 mb-2">
          Calorie Goal
        </span>
        <div className="grid grid-cols-2 gap-2">
          {GOAL_OPTIONS.map((goal) => {
            const active = profile.goal === goal.id;
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => onChange({ ...profile, goal: goal.id })}
                className={`px-3 py-2 text-left rounded-lg border transition-colors cursor-pointer ${
                  active
                    ? 'border-emerald-700 bg-emerald-50/70 text-slate-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-semibold text-slate-900 whitespace-nowrap">
                  {goal.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                  {goal.note}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Macro Split Strategy */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div>
          <label
            htmlFor="macro-preset-select"
            className="block text-xs font-medium text-slate-700 mb-1.5"
          >
            Macro Distribution Strategy
          </label>
          <select
            id="macro-preset-select"
            value={profile.macroPreset}
            onChange={(e) =>
              onChange({
                ...profile,
                macroPreset: e.target.value as UserProfile['macroPreset'],
              })
            }
            className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
          >
            {MACRO_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}{' '}
                {preset.id !== 'custom'
                  ? `(${preset.split.proteinPct}P / ${preset.split.carbsPct}C / ${preset.split.fatPct}F)`
                  : ''}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1.5">
            {MACRO_PRESETS.find((p) => p.id === profile.macroPreset)?.description}
          </p>
        </div>

        {/* Interactive 3-Macro Ratio Adjusters */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Protein %</span>
            <span className="font-mono font-semibold text-teal-700 tabular-nums">
              {activeSplit.proteinPct}%
            </span>
          </div>
          <input
            aria-label="Protein percentage"
            type="range"
            min={15}
            max={55}
            value={activeSplit.proteinPct}
            onChange={(e) =>
              handleCustomMacroChange('proteinPct', Number(e.target.value))
            }
            className="w-full macro-slider"
          />

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Carbohydrates %</span>
            <span className="font-mono font-semibold text-amber-700 tabular-nums">
              {activeSplit.carbsPct}%
            </span>
          </div>
          <input
            aria-label="Carbohydrates percentage"
            type="range"
            min={10}
            max={65}
            value={activeSplit.carbsPct}
            onChange={(e) =>
              handleCustomMacroChange('carbsPct', Number(e.target.value))
            }
            className="w-full macro-slider"
          />

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Healthy Fats %</span>
            <span className="font-mono font-semibold text-blue-700 tabular-nums">
              {activeSplit.fatPct}%
            </span>
          </div>
          <input
            aria-label="Healthy fats percentage"
            type="range"
            min={15}
            max={60}
            value={activeSplit.fatPct}
            onChange={(e) =>
              handleCustomMacroChange('fatPct', Number(e.target.value))
            }
            className="w-full macro-slider"
          />
        </div>
      </div>

      {/* Meal Diet Preference */}
      <div className="pt-4 border-t border-slate-100">
        <span className="block text-xs font-medium text-slate-700 mb-2">
          Meal Plan Dietary Style
        </span>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
          {DIET_STYLE_OPTIONS.map((style) => {
            const active = profile.dietStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onChange({ ...profile, dietStyle: style.id })}
                className={`py-2 px-2.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {style.label}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
