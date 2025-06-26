
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
    <div>
      <p className="text-sm text-slate-400 mb-1">
        Все базовые характеристики начинаются с {ATTRIBUTE_BASE_SCORE}. У вас есть <span className="font-bold text-red-400">{attributeBuyPoints}</span> очков для повышения базовых характеристик до {ATTRIBUTE_MAX_BUY_SCORE}.
      </p>
      <p className="text-xs text-slate-500 mb-3">
        (Стоимость повышения базовой характеристики: 9-13: 1 очко; 14-15: 2 очка от предыдущего). Расовые модификаторы применяются поверх этих значений.
      </p>
      <p className="text-sm text-slate-400 mb-1">
        Понижение базовой характеристики ниже {ATTRIBUTE_BASE_SCORE} (до {ATTRIBUTE_MIN_SCORE}) даёт <span className="font-bold text-yellow-400">1 Очко Модификации</span> за каждое очко понижения. Повышение такой характеристики обратно к {ATTRIBUTE_BASE_SCORE} стоит ОМ.
      </p>
       <p className="text-sm text-slate-400 mb-3">
        Текущие Очки Модификации: <span className="font-bold text-yellow-400">{modificationPoints}</span>.
      </p>

      {DND_ATTRIBUTES_KEYS.map((attrKey) => {
        const baseScore = baseAttributes[attrKey];
        const racialMod = racialModifiers?.[attrKey] || 0;
        const finalScore = baseScore + racialMod;
        const finalModifier = calculateModifier(finalScore);
        
        let racialModString = "";
        if (racialMod > 0) racialModString = '(База ' + baseScore + ', Раса +' + racialMod + ')';
        else if (racialMod < 0) racialModString = '(База ' + baseScore + ', Раса ' + racialMod + ')';
        else racialModString = '(База ' + baseScore + ')';

        return (
            <div key={attrKey} className="flex justify-between items-center mb-3 p-3 bg-slate-700/50 rounded-md">
            <div className="w-48">
                <span className="capitalize text-slate-300">{DND_ATTRIBUTE_NAMES_RU[attrKey]}:</span>
                <span className="block text-xs text-slate-400 -mt-0.5">{racialModString}</span>
            </div>
            <div className="flex items-center space-x-2">
                <button
                onClick={() => handleAttributeChange(attrKey, false)}
                disabled={!canDecrease(attrKey)}
                className="p-1.5 bg-red-700 hover:bg-red-600 rounded-full text-white disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                aria-label={'Уменьшить ' + DND_ATTRIBUTE_NAMES_RU[attrKey]}
                >
                <MinusIcon />
                </button>
                <span className="w-8 text-center font-semibold text-lg text-slate-100 tabular-nums">{finalScore}</span>
                <span className={'w-10 text-center text-sm font-medium p-1 rounded-md tabular-nums ' + (finalModifier >= 0 ? 'text-green-300 bg-green-700/30' : 'text-red-300 bg-red-700/30')}>
                    {finalModifier >= 0 ? '+' + finalModifier : finalModifier}
                </span>
                <button
                onClick={() => handleAttributeChange(attrKey, true)}
                disabled={!canIncrease(attrKey)}
                className="p-1.5 bg-green-600 hover:bg-green-500 rounded-full text-white disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                aria-label={'Увеличить ' + DND_ATTRIBUTE_NAMES_RU[attrKey]}
                >
                <PlusIcon />
                </button>
            </div>
            </div>
        );
      })}
    </div>
  );
};

export default AttributeEditor;