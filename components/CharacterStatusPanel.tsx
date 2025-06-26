
import React, { useState, useCallback } from 'react';
import { Character, ArmorTypeForSleep } from '../types';
import { 
    HeartIcon, DiceIcon, ClockIcon, BedIcon, SunIcon, PlusIcon, MinusIcon, 
    ARMOR_TYPES_FOR_SLEEP, calculateModifier, ShieldExclamationIcon
} from '../constants';
import SectionPanel from './SectionPanel';
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
    <SectionPanel title="Состояние Персонажа и Управление Отдыхом">
      <div className="space-y-6">
        {/* HP Section */}
        <div>
          <h3 className="text-lg font-semibold text-red-300 mb-2 flex items-center"><HeartIcon className="mr-2" />Хитпоинты (HP)</h3>
          <div className="p-3 bg-slate-700/50 rounded-md text-center">
            <p className="text-3xl font-bold text-red-400">
              {character.currentHp} <span className="text-xl text-slate-400">/ {character.maxHp}</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label htmlFor="damageAmount" className="block text-sm font-medium text-slate-300 mb-1">Получить урон:</label>
              <div className="flex">
                <input 
                  type="number" 
                  id="damageAmount"
                  value={damageAmount} 
                  onChange={(e) => setDamageAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-l-md p-2 text-slate-200 focus:ring-red-500 focus:border-red-500"
                />
                <button onClick={handleApplyDamage} className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-r-md transition-colors">Ранить</button>
              </div>
            </div>
            <div>
              <label htmlFor="healAmount" className="block text-sm font-medium text-slate-300 mb-1">Исцелиться:</label>
              <div className="flex">
                <input 
                  type="number" 
                  id="healAmount"
                  value={healAmount} 
                  onChange={(e) => setHealAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-l-md p-2 text-slate-200 focus:ring-green-500 focus:border-green-500"
                />
                <button onClick={handleApplyHeal} className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-r-md transition-colors">Лечить</button>
              </div>
            </div>
          </div>
        </div>

        {/* Hit Dice Section */}
        <div>
          <h3 className="text-lg font-semibold text-green-300 mb-2 flex items-center"><DiceIcon className="mr-2" />Кости Хитов (Hit Dice)</h3>
          <div className="p-3 bg-slate-700/50 rounded-md text-center">
            <p className="text-3xl font-bold text-green-400">
              {character.currentHitDice} <span className="text-xl text-slate-400">/ {character.maxHitDice} (d{character.hitDieType})</span>
            </p>
          </div>
          <button 
            onClick={() => { setShowHdSpendUI(!showHdSpendUI); setHdRollResult(''); }}
            className="mt-3 w-full bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
            disabled={character.currentHitDice === 0 || character.currentHp === character.maxHp}
            aria-expanded={showHdSpendUI}
          >
            {showHdSpendUI ? 'Скрыть трату HD' : 'Потратить Кости Хитов (во время короткого отдыха)'}
          </button>
          {showHdSpendUI && character.currentHitDice > 0 && character.currentHp < character.maxHp && (
            <div className="mt-3 p-3 bg-slate-600/50 rounded-md space-y-2">
              <label htmlFor="hdToSpend" className="block text-sm font-medium text-slate-300">Сколько HD потратить (макс: {character.currentHitDice}):</label>
              <div className="flex items-center space-x-2">
                <button onClick={() => setHdToSpend(prev => Math.max(1, prev - 1))} className="p-1 bg-slate-500 rounded-full"><MinusIcon /></button>
                <input 
                  type="number" 
                  id="hdToSpend"
                  value={hdToSpend} 
                  onChange={(e) => setHdToSpend(Math.max(1, Math.min(character.currentHitDice, parseInt(e.target.value) || 1)))}
                  className="w-20 text-center bg-slate-700 border border-slate-500 rounded-md p-1 text-slate-200"
                />
                <button onClick={() => setHdToSpend(prev => Math.min(character.currentHitDice, prev + 1))} className="p-1 bg-slate-500 rounded-full"><PlusIcon /></button>
                <button onClick={handleSpendHd} className="flex-grow bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-md transition-colors">Бросить</button>
              </div>
              {hdRollResult && <p className="text-xs text-slate-300 mt-1">{hdRollResult}</p>}
            </div>
          )}
        </div>

        {/* Time and Rest Section */}
        <div>
          <h3 className="text-lg font-semibold text-sky-300 mb-2 flex items-center"><ClockIcon className="mr-2" />Время и Отдых</h3>
          <div className="p-3 bg-slate-700/50 rounded-md">
            <p className="text-center text-xl font-medium text-sky-200 mb-3">{formatGameTime(character.gameTimeHours)}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <button onClick={() => onPassTime(1)} className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center">
                <SunIcon className="mr-2 h-4 w-4" /> Пропустить 1 час
              </button>
              <button onClick={onShortRest} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center">
                <ClockIcon className="mr-2 h-4 w-4" /> Короткий Отдых (1 ч)
              </button>
              <button 
                onClick={onLongRest} 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={!canTakeLongRest || character.currentHp < 1}
                title={!canTakeLongRest ? "Слишком рано для продолжительного отдыха" : character.currentHp < 1 ? "Нужно хотя бы 1 HP" : ""}
              >
                <BedIcon className="mr-2 h-4 w-4" /> Продолжительный Отдых (8 ч)
              </button>
            </div>
            <DropdownSelect
              label="Доспехи во время сна (влияет на восстановление HD при долгом отдыхе)"
              value={character.armorTypeWornForSleep}
              options={ARMOR_TYPES_FOR_SLEEP}
              onChange={(value) => onArmorTypeChange(value as ArmorTypeForSleep)}
              getOptionValue={(option) => option.id}
              getOptionLabel={(option) => option.name}
              id="armor-sleep-select"
            />
            {character.exhaustionLevel > 0 && (
              <p className="text-yellow-400 text-sm mt-2">
                <ShieldExclamationIcon className="inline h-5 w-5 mr-1" />
                Уровень Истощения: {character.exhaustionLevel}. Будьте осторожны!
              </p>
            )}
            <p className="text-xs text-slate-400 mt-1">Последний продолжительный отдых завершен: {character.lastLongRestEndTime > 0 ? formatGameTime(character.lastLongRestEndTime) : "Никогда"}</p>
          </div>
        </div>
      </div>
    </SectionPanel>
  );
};

export default CharacterStatusPanel;
