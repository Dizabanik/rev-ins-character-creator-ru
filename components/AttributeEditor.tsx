
import React from 'react';
import { Attributes, DndAttribute } from '../types';
import {
  DND_ATTRIBUTES_KEYS,
  ATTRIBUTE_BASE_SCORE,
  ATTRIBUTE_MIN_SCORE,
  ATTRIBUTE_MAX_BUY_SCORE,
  ATTRIBUTE_POINT_BUY_COST,
  PlusIcon, MinusIcon,
  DND_ATTRIBUTE_NAMES_RU,
  calculateModifier
} from '../constants';

interface AttributeEditorProps {
  attributes: Attributes; // These are baseAttributes from App.tsx
  onAttributesChange: (newBaseAttributes: Attributes) => void;
  attributeBuyPoints: number;
  onAttributeBuyPointsChange: (newPool: number) => void;
  modificationPoints: number;
  onModificationPointsChange: (newPool: number) => void;
  racialModifiers?: Partial<Attributes>; // Racial modifiers passed from App.tsx
}

const AttributeEditor: React.FC<AttributeEditorProps> = ({
  attributes: baseAttributes, // Renaming for clarity within this component
  onAttributesChange,
  attributeBuyPoints, onAttributeBuyPointsChange,
  modificationPoints, onModificationPointsChange,
  racialModifiers
}) => {

  const getScoreCostDifference = (currentBaseScore: number, nextBaseScore: number): number => {
    // Cost calculation is based on the base score before racial mods
    const costCurrent = ATTRIBUTE_POINT_BUY_COST[currentBaseScore] ?? (currentBaseScore > ATTRIBUTE_MAX_BUY_SCORE ? 999 : (currentBaseScore < ATTRIBUTE_BASE_SCORE ? 0 : -1 ));
    const costNext = ATTRIBUTE_POINT_BUY_COST[nextBaseScore] ?? (nextBaseScore > ATTRIBUTE_MAX_BUY_SCORE ? 999 : (nextBaseScore < ATTRIBUTE_BASE_SCORE ? 0 : -1));
    return costNext - costCurrent;
  };

  const handleAttributeChange = (attr: DndAttribute, increment: boolean) => {
    const currentBaseValue = baseAttributes[attr];

    if (increment) {
        if (currentBaseValue < ATTRIBUTE_BASE_SCORE) { // Raising a score that was lowered below base
            onAttributesChange({ ...baseAttributes, [attr]: currentBaseValue + 1 });
            onModificationPointsChange(modificationPoints - 1); // Cost 1 MP
        } else if (currentBaseValue < ATTRIBUTE_MAX_BUY_SCORE) { // Standard increase using attribute buy points
            const costToIncrease = getScoreCostDifference(currentBaseValue, currentBaseValue + 1);
            if (attributeBuyPoints >= costToIncrease) {
                onAttributesChange({ ...baseAttributes, [attr]: currentBaseValue + 1 });
                onAttributeBuyPointsChange(attributeBuyPoints - costToIncrease);
            }
        }
    } else { // Decrement
        if (currentBaseValue > ATTRIBUTE_BASE_SCORE) { // Lowering a score bought with points
            const pointsToRegain = getScoreCostDifference(currentBaseValue - 1, currentBaseValue);
            onAttributesChange({ ...baseAttributes, [attr]: currentBaseValue - 1 });
            onAttributeBuyPointsChange(attributeBuyPoints + pointsToRegain);
        } else if (currentBaseValue > ATTRIBUTE_MIN_SCORE) { // Lowering from base or below, to gain MP
            onAttributesChange({ ...baseAttributes, [attr]: currentBaseValue - 1 });
            onModificationPointsChange(modificationPoints + 1); // Gain 1 MP
        }
    }
  };
  
  const canIncrease = (attr: DndAttribute): boolean => {
    const currentBaseValue = baseAttributes[attr];
    if (currentBaseValue >= ATTRIBUTE_MAX_BUY_SCORE) return false;
    
    if (currentBaseValue < ATTRIBUTE_BASE_SCORE) return true; // Can always raise if below base (costs MP)

    const costToIncrease = getScoreCostDifference(currentBaseValue, currentBaseValue + 1);
    return attributeBuyPoints >= costToIncrease;
  }

  const canDecrease = (attr: DndAttribute): boolean => {
     const currentBaseValue = baseAttributes[attr];
     return currentBaseValue > ATTRIBUTE_MIN_SCORE;
  }


  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-zinc-400">
          Все базовые характеристики начинаются с {ATTRIBUTE_BASE_SCORE}. Повышение стоит очков, понижение дает Очки Модификации.
        </p>
        <div className="flex justify-center items-center gap-6">
            <p className="text-sm text-zinc-300">
                Очки покупки: <span className="font-bold text-lg text-indigo-400">{attributeBuyPoints}</span>
            </p>
            <p className="text-sm text-zinc-300">
                Очки Модификации: <span className="font-bold text-lg text-amber-400">{modificationPoints}</span>
            </p>
        </div>
      </div>

      <div className="space-y-3">
        {DND_ATTRIBUTES_KEYS.map((attrKey) => {
            const baseScore = baseAttributes[attrKey];
            const racialMod = racialModifiers?.[attrKey] || 0;
            const finalScore = baseScore + racialMod;
            const finalModifier = calculateModifier(finalScore);
            
            let racialModString = "";
            if (racialMod > 0) racialModString = `(База ${baseScore}, Раса +${racialMod})`;
            else if (racialMod < 0) racialModString = `(База ${baseScore}, Раса ${racialMod})`;
            else racialModString = `(База ${baseScore})`;

            return (
                <div key={attrKey} className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-2xl">
                    <div className="w-48">
                        <span className="capitalize text-zinc-200 font-medium">{DND_ATTRIBUTE_NAMES_RU[attrKey]}</span>
                        <span className="block text-xs text-zinc-400">{racialModString}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => handleAttributeChange(attrKey, false)}
                            disabled={!canDecrease(attrKey)}
                            className="p-2 bg-zinc-700/80 hover:bg-zinc-700 rounded-full text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label={'Уменьшить ' + DND_ATTRIBUTE_NAMES_RU[attrKey]}
                        >
                            <MinusIcon className="w-5 h-5"/>
                        </button>
                        
                        <div className="flex items-baseline space-x-2">
                             <span className="w-10 text-center font-semibold text-3xl text-zinc-100 tabular-nums">{finalScore}</span>
                             <span className={`w-10 text-center text-md font-medium tabular-nums ${finalModifier >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {finalModifier >= 0 ? `+${finalModifier}` : finalModifier}
                            </span>
                        </div>

                        <button
                            onClick={() => handleAttributeChange(attrKey, true)}
                            disabled={!canIncrease(attrKey)}
                            className="p-2 bg-zinc-700/80 hover:bg-zinc-700 rounded-full text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label={'Увеличить ' + DND_ATTRIBUTE_NAMES_RU[attrKey]}
                        >
                            <PlusIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            );
        })}
        </div>
    </div>
  );
};

export default AttributeEditor;