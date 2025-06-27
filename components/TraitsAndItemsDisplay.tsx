
import React from 'react';
import { Trait, StartingItem } from '../types';

interface TraitsAndItemsDisplayProps {
  traits: Trait[];
  items: StartingItem[];
}

const TraitsAndItemsDisplay: React.FC<TraitsAndItemsDisplayProps> = ({ traits, items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-semibold text-zinc-300 mb-2">Выбранные Особенности:</h4>
        {traits.length === 0 ? (
          <p className="text-zinc-500 italic text-sm">Особенности не выбраны.</p>
        ) : (
          <ul className="space-y-2">
            {traits.map((trait) => (
              <li key={trait.id} className="text-sm text-zinc-300 bg-zinc-800/50 p-3 rounded-lg">
                <span className="font-semibold text-indigo-300">{trait.name}</span>
                <p className="text-xs text-zinc-400 mt-0.5">{trait.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h4 className="font-semibold text-zinc-300 mb-2">Выбранные Стартовые Предметы:</h4>
        {items.length === 0 ? (
          <p className="text-zinc-500 italic text-sm">Стартовые предметы не выбраны.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="text-sm text-zinc-300 bg-zinc-800/50 p-3 rounded-lg">
                <span className="font-semibold text-indigo-300">{item.name}</span>
                 <p className="text-xs text-zinc-400 mt-0.5">{item.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TraitsAndItemsDisplay;