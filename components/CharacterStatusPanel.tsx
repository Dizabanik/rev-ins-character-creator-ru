
import React, { useState, useCallback } from 'react';
import { Character, ArmorTypeForSleep } from '../types';
import { 
    HeartIcon, DiceIcon, ClockIcon, BedIcon, SunIcon, PlusIcon, MinusIcon, 
    ARMOR_TYPES_FOR_SLEEP, calculateModifier, ShieldExclamationIcon
} from '../constants';
import DropdownSelect from './DropdownSelect';

interface CharacterStatusPanelProps {
  character: Character;
  onPassTime: (hours: number) => void;
  onShortRest: () => void;
  onLongRest: () => void;
  onSpendHitDice: (diceToSpend: number, onHeal: (totalHealed: number, rolls: string[]) => void) => void;
  onArmorTypeChange: (armorType: ArmorTypeForSleep) => void;
  onCurrentHpChange: (newHp: number) => void;
}

const CharacterStatusPanel: React.FC<CharacterStatusPanelProps> = ({
  character,
  onPassTime,
  onShortRest,
  onLongRest,
  onSpendHitDice,
  onArmorTypeChange,
  onCurrentHpChange
}) => {
  const [damageAmount, setDamageAmount] = useState<number>(1);
  const [healAmount, setHealAmount] = useState<number>(1);
  const [hdToSpend, setHdToSpend] = useState<number>(1);
  const [hdRollResult, setHdRollResult] = useState<string>('');
  const [showHdSpendUI, setShowHdSpendUI] = useState<boolean>(false);

  const formatGameTime = (totalHours: number): string => {
    const days = Math.floor(totalHours / 24) + 1;
    const hours = totalHours % 24;
    return `День ${days}, ${String(hours).padStart(2, '0')}:00`;
  };

  const handleApplyDamage = () => {
    onCurrentHpChange(Math.max(0, character.currentHp - damageAmount));
  };

  const handleApplyHeal = () => {
    onCurrentHpChange(Math.min(character.maxHp, character.currentHp + healAmount));
  };

  const handleSpendHd = () => {
    onSpendHitDice(hdToSpend, (totalHealed, rolls) => {
        if (totalHealed > 0) {
            setHdRollResult(`Исцелено: ${totalHealed} HP. Броски: ${rolls.join(', ')}.`);
        } else if (rolls.length > 0) {
            setHdRollResult(`Не удалось исцелиться. Броски: ${rolls.join(', ')}. Модификатор Телосложения: ${calculateModifier(character.attributes.constitution)}`);
        } else {
            setHdRollResult('Нечего тратить или HP полные.');
        }
    });
  };

  const canTakeLongRest = character.gameTimeHours >= character.lastLongRestEndTime + 16 || character.lastLongRestEndTime === 0;

  return (
    <div className="space-y-8">
      {/* HP Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-rose-300 flex items-center"><HeartIcon className="mr-2" />Хитпоинты (HP)</h3>
        <div className="p-4 bg-zinc-800/50 rounded-2xl text-center">
          <p className="text-4xl font-bold text-rose-400">
            {character.currentHp} <span className="text-2xl text-zinc-400">/ {character.maxHp}</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center bg-zinc-800/50 rounded-xl px-2">
              <input 
                type="number" 
                value={damageAmount} 
                onChange={(e) => setDamageAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-transparent p-2 text-zinc-100 focus:outline-none"
                aria-label="Сумма урона"
              />
              <button onClick={handleApplyDamage} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold px-3 py-1.5 rounded-lg transition-colors text-sm">Ранить</button>
          </div>
          <div className="flex items-center bg-zinc-800/50 rounded-xl px-2">
              <input 
                type="number" 
                value={healAmount} 
                onChange={(e) => setHealAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-transparent p-2 text-zinc-100 focus:outline-none"
                aria-label="Сумма исцеления"
              />
              <button onClick={handleApplyHeal} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold px-3 py-1.5 rounded-lg transition-colors text-sm">Лечить</button>
          </div>
        </div>
      </div>

      {/* Hit Dice Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-emerald-300 flex items-center"><DiceIcon className="mr-2" />Кости Хитов (Hit Dice)</h3>
        <div className="p-4 bg-zinc-800/50 rounded-2xl text-center">
          <p className="text-4xl font-bold text-emerald-400">
            {character.currentHitDice} <span className="text-2xl text-zinc-400">/ {character.maxHitDice} (d{character.hitDieType})</span>
          </p>
        </div>
        <button 
          onClick={() => { setShowHdSpendUI(!showHdSpendUI); setHdRollResult(''); }}
          className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
          disabled={character.currentHitDice === 0 || character.currentHp === character.maxHp}
          aria-expanded={showHdSpendUI}
        >
          {showHdSpendUI ? 'Скрыть трату HD' : 'Потратить Кости Хитов'}
        </button>
        {showHdSpendUI && character.currentHitDice > 0 && character.currentHp < character.maxHp && (
          <div className="p-3 bg-zinc-800/70 rounded-xl space-y-3">
            <label htmlFor="hdToSpend" className="block text-sm font-medium text-zinc-300">Сколько HD потратить (макс: {character.currentHitDice}):</label>
            <div className="flex items-center space-x-3">
              <button onClick={() => setHdToSpend(prev => Math.max(1, prev - 1))} className="p-2 bg-zinc-700 rounded-full"><MinusIcon /></button>
              <input 
                type="number" 
                id="hdToSpend"
                value={hdToSpend} 
                onChange={(e) => setHdToSpend(Math.max(1, Math.min(character.currentHitDice, parseInt(e.target.value) || 1)))}
                className="w-20 text-center bg-zinc-900 border border-zinc-700 rounded-lg p-1.5 text-zinc-200"
              />
              <button onClick={() => setHdToSpend(prev => Math.min(character.currentHitDice, prev + 1))} className="p-2 bg-zinc-700 rounded-full"><PlusIcon /></button>
              <button onClick={handleSpendHd} className="flex-grow bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-2 rounded-lg transition-colors">Бросить</button>
            </div>
            {hdRollResult && <p className="text-xs text-zinc-400 mt-2">{hdRollResult}</p>}
          </div>
        )}
      </div>

      {/* Time and Rest Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-sky-300 flex items-center"><ClockIcon className="mr-2" />Время и Отдых</h3>
        <div className="p-4 bg-zinc-800/50 rounded-2xl space-y-4">
          <p className="text-center text-2xl font-medium text-sky-200">{formatGameTime(character.gameTimeHours)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button onClick={() => onPassTime(1)} className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center text-sm">
              <SunIcon className="mr-2 h-4 w-4" /> 1 час
            </button>
            <button onClick={onShortRest} className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center text-sm">
              <ClockIcon className="mr-2 h-4 w-4" /> Короткий Отдых
            </button>
            <button 
              onClick={onLongRest} 
              className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center text-sm"
              disabled={!canTakeLongRest || character.currentHp < 1}
              title={!canTakeLongRest ? "Слишком рано для продолжительного отдыха" : character.currentHp < 1 ? "Нужно хотя бы 1 HP" : ""}
            >
              <BedIcon className="mr-2 h-4 w-4" /> Долгий Отдых
            </button>
          </div>
          <DropdownSelect
            label="Доспехи во время сна"
            value={character.armorTypeWornForSleep}
            options={ARMOR_TYPES_FOR_SLEEP}
            onChange={(value) => onArmorTypeChange(value as ArmorTypeForSleep)}
            getOptionValue={(option) => option.id}
            getOptionLabel={(option) => option.name}
            id="armor-sleep-select"
          />
          <div className="text-xs text-zinc-500 border-t border-zinc-700/50 pt-3 space-y-1">
             {character.exhaustionLevel > 0 && (
                <p className="text-amber-400 font-semibold">
                  <ShieldExclamationIcon className="inline h-4 w-4 mr-1" />
                  Уровень Истощения: {character.exhaustionLevel}
                </p>
              )}
              <p>Последний долгий отдых: {character.lastLongRestEndTime > 0 ? formatGameTime(character.lastLongRestEndTime) : "Никогда"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterStatusPanel;
