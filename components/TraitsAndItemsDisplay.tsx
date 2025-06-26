
import React from 'react';
import { Trait, StartingItem } from '../types';

interface TraitsAndItemsDisplayProps {
  traits: Trait[];
  items: StartingItem[];
}

const TraitsAndItemsDisplay: React.FC<TraitsAndItemsDisplayProps> = ({ traits, items }) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-slate-300 mb-1">Выбранные Особенности:</h4>
        {traits.length === 0 ? (
          <p className="text-slate-400 italic text-sm">Особенности не выбраны.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {traits.map((trait) => (
              <li key={trait.id} className="text-sm text-slate-300">
                <span className="font-semibold text-red-300">{trait.name}</span>: {trait.description}
                <span className="text-xs text-slate-400"> (Стоимость: {trait.modificationPointCost})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h4 className="font-medium text-slate-300 mb-1">Выбранные Стартовые Предметы:</h4>
        {items.length === 0 ? (
          <p className="text-slate-400 italic text-sm">Стартовые предметы не выбраны.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {items.map((item) => (
              <li key={item.id} className="text-sm text-slate-300">
                <span className="font-semibold text-red-300">{item.name}</span>: {item.description}
                <span className="text-xs text-slate-400"> (Стоимость: {item.modificationPointCost})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TraitsAndItemsDisplay;