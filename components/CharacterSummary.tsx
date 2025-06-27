

import React, { useState } from 'react';
import { Character } from '../types';
import SectionPanel from './SectionPanel';
import TraitsAndItemsDisplay from './TraitsAndItemsDisplay';
import { 
  ShieldCheckIcon, BookOpenIcon, CheckCircleIcon, DND_ATTRIBUTE_NAMES_RU, calculateModifier,
  TrendingUpIcon, UsersIcon, parseDerivedStatValue, ListBulletIcon, 
  APERTURE_GRADES, CHARACTER_RANKS, getEssenceDetails, BeakerIcon, CircleStackIcon, UserCircleIcon, BoltIcon,
  AVAILABLE_SKILLS, StarIcon as StageIcon, ChevronDownIcon, ChevronUpIcon, getEssenceCondensationDetails,
  HeartIcon, DiceIcon, ClockIcon, ShieldExclamationIcon
} from '../constants';

interface CharacterSummaryProps {
  character: Character;
  derivedStats: string[]; 
}

const CharacterSummary: React.FC<CharacterSummaryProps> = ({ character, derivedStats }) => {
  const [showCondensationDetails, setShowCondensationDetails] = useState(false);

  const selectedGradeInfo = APERTURE_GRADES.find(g => g.id === character.apertureGradeId);
  const selectedRankInfo = CHARACTER_RANKS.find(r => r.id === character.characterRankId);
  const selectedEssenceDetails = getEssenceDetails(character.characterRankId, character.selectedEssenceStageId);
  const specificMaxEssence = character.specificMaxEssence ?? (selectedGradeInfo?.minMaxEssence || 0);
  
  const condensationInfo = selectedRankInfo && character.selectedEssenceStageId 
    ? getEssenceCondensationDetails(selectedRankInfo.id, character.selectedEssenceStageId) 
    : [];

  const formatCondensationFactor = (factor: number): string => {
    if (factor === 1) return "1.00";
    if (Math.abs(factor) > 0 && Math.abs(factor) < 0.01 && factor !== 0) return factor.toExponential(2);
    return factor.toFixed(2);
  }

  const formatGameTime = (totalHours: number): string => {
    const days = Math.floor(totalHours / 24) + 1;
    const hours = totalHours % 24;
    return `День ${days}, ${String(hours).padStart(2, '0')}:00`;
  };


  return (
    <SectionPanel title="Итоговый Лист Персонажа" className="mt-8">
        <div className="text-center">
          <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">{character.name}</h3>
          <p className="text-lg text-zinc-400 mt-1">
            Уровень {character.level} 
            {character.selectedRace ? (
              <span className="font-medium text-indigo-300"> {character.selectedRace.name}</span>
            ) : " неизвестной расы"}
            {selectedRankInfo ? `, ${selectedRankInfo.name}` : ""}
            {selectedEssenceDetails ? ` (${selectedEssenceDetails.name})` : ""}.
          </p>
          <p className="text-sm text-zinc-500 mt-2">Пришелец, внезапно телепортированный в неизвестный, жестокий мир.</p>
          <div className="inline-flex items-center text-sm text-zinc-400 mt-4 border border-zinc-700 bg-zinc-800/50 rounded-full px-4 py-1.5">
            <ClockIcon className="inline h-4 w-4 mr-2 text-sky-500" /> {formatGameTime(character.gameTimeHours)}
          </div>
        </div>

        {/* HP and HD display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-zinc-800/70 rounded-2xl text-center">
            <HeartIcon className="h-7 w-7 mb-2 text-rose-500 mx-auto" />
            <span className="text-2xl font-bold text-rose-400">{character.currentHp} / {character.maxHp}</span>
            <span className="text-xs text-zinc-400 block mt-1">Хитпоинты (HP)</span>
          </div>
          <div className="p-4 bg-zinc-800/70 rounded-2xl text-center">
            <DiceIcon className="h-7 w-7 mb-2 text-emerald-500 mx-auto" />
            <span className="text-2xl font-bold text-emerald-400">{character.currentHitDice} / {character.maxHitDice}</span>
            <span className="text-xs text-zinc-400 block mt-1">Кости Хитов (d{character.hitDieType})</span>
          </div>
          <div className="p-4 bg-zinc-800/70 rounded-2xl text-center">
            <ShieldExclamationIcon className="h-7 w-7 mb-2 text-amber-500 mx-auto" />
            <span className={`text-2xl font-bold ${character.exhaustionLevel > 0 ? 'text-amber-400' : 'text-zinc-200'}`}>{character.exhaustionLevel}</span>
            <span className="text-xs text-zinc-400 block mt-1">Уровень Истощения</span>
          </div>
        </div>

        <div>
            <h4 className="text-xl font-semibold text-zinc-200 mb-3">Итоговые Характеристики:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(character.attributes).map(([key, value]) => { 
                const modifier = calculateModifier(value);
                return (
                    <li key={key} className="flex justify-between items-center p-3 bg-zinc-800/50 rounded-xl">
                        <span className="text-zinc-300">{DND_ATTRIBUTE_NAMES_RU[key as keyof typeof DND_ATTRIBUTE_NAMES_RU]}</span> 
                        <div className="flex items-baseline gap-2">
                            <span className="font-bold text-2xl text-zinc-100">{value}</span>
                            <span className={`font-medium text-sm rounded-md px-1.5 py-0.5 ${modifier >=0 ? 'text-emerald-300 bg-emerald-900/50' : 'text-rose-300 bg-rose-900/50'}`}>({modifier >=0 ? '+':''}{modifier})</span>
                        </div>
                    </li>
                );
              })}
            </ul>
        </div>

        {derivedStats.length > 0 && (
          <div>
            <h4 className="text-xl font-semibold text-zinc-200 mb-3 flex items-center">
                <TrendingUpIcon className="mr-2 text-indigo-400 h-5 w-5" />
                Производные Эффекты:
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 items-stretch">
                {derivedStats.map((statString, index) => {
                    const parsed = parseDerivedStatValue(statString);
                    if (parsed.isApertureInfo || parsed.isHpInfo) return null; 

                    const valueFontSize = parsed.isSkill ? 'text-xl' : 'text-2xl';
                    const labelFontSize = 'text-[11px] uppercase tracking-wider font-semibold';
                    const containerClasses = !parsed.isNumeric ? 'col-span-2 sm:col-span-full md:col-span-full' : '';

                    return (
                        <li key={'ds-' + index} className={`flex flex-col items-center justify-center p-4 bg-zinc-800/70 rounded-2xl text-center h-full ${containerClasses}`}>
                             {parsed.IconComponent && <parsed.IconComponent className={`h-6 w-6 mb-2 ${parsed.iconColor}`} />}
                             {parsed.isNumeric ? ( 
                                <>
                                  <span className={`${valueFontSize} font-bold ${parsed.valueColor}`}>{parsed.value}{parsed.suffix}</span>
                                  <span className={`${labelFontSize} text-zinc-400 mt-1`}>{parsed.label}</span>
                                </>
                              ) : (
                                <div className="text-left w-full">
                                   <span className={`text-sm text-zinc-300`}><strong className={`${parsed.iconColor} font-semibold`}>{parsed.label}:</strong> {parsed.value}</span>
                                </div>
                              )}
                        </li>
                    );
                })}
            </ul>
          </div>
        )}

        {(character.age || character.height || character.weight || character.eyeColor || character.hairColor) && (
          <div>
            <h4 className="text-xl font-semibold text-zinc-200 mb-3 flex items-center">
              <UserCircleIcon className="mr-2 text-indigo-400" />
              Внешность
            </h4>
            <div className="p-4 bg-zinc-800/50 rounded-xl grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
              {character.age && <div><strong className="text-zinc-400 font-medium">Возраст:</strong> <span className="text-zinc-200">{character.age}</span></div>}
              {character.height && <div><strong className="text-zinc-400 font-medium">Рост:</strong> <span className="text-zinc-200">{character.height}</span></div>}
              {character.weight && <div><strong className="text-zinc-400 font-medium">Вес:</strong> <span className="text-zinc-200">{character.weight}</span></div>}
              {character.eyeColor && <div><strong className="text-zinc-400 font-medium">Цвет глаз:</strong> <span className="text-zinc-200">{character.eyeColor}</span></div>}
              {character.hairColor && <div><strong className="text-zinc-400 font-medium">Волосы:</strong> <span className="text-zinc-200">{character.hairColor}</span></div>}
            </div>
          </div>
        )}

        {character.manualBackstory && (
          <div>
            <h4 className="text-xl font-semibold text-zinc-200 mb-3 flex items-center">
              <BookOpenIcon className="mr-2 text-indigo-400" />
              Предыстория (до телепортации)
            </h4>
            <p className="text-sm text-zinc-300 whitespace-pre-wrap bg-zinc-800/50 p-4 rounded-xl">{character.manualBackstory}</p>
          </div>
        )}

        {selectedGradeInfo && selectedRankInfo && selectedEssenceDetails && (
          <div>
            <h4 className="text-xl font-semibold text-zinc-200 mb-3 flex items-center">
              <BeakerIcon className="mr-2 text-indigo-400" />
              Состояние Апертуры:
            </h4>
            <div className="p-4 bg-zinc-800/50 rounded-xl space-y-2 text-sm">
              <p><strong className="text-zinc-400 font-medium">Талант:</strong> <span className="text-violet-300">{selectedGradeInfo.name}</span></p>
              <p><strong className="text-zinc-400 font-medium">Ранг:</strong> <span className="text-amber-300">{selectedRankInfo.name}</span> ({selectedRankInfo.rankColorGroup})</p>
              <p><strong className="text-zinc-400 font-medium">Макс. Эссенция:</strong> <span className="text-cyan-300">{specificMaxEssence}%</span></p>
              <p><strong className="text-zinc-400 font-medium">Текущая Эссенция:</strong> <span className="text-cyan-300">{character.currentEssencePercentage?.toFixed(2)}%</span></p>
              <p><strong className="text-zinc-400 font-medium">Стадия:</strong> <span style={{color: selectedEssenceDetails.color.replace(/0\.\d+/, '1')}}>{selectedEssenceDetails.name}</span></p>
              <p><strong className="text-zinc-400 font-medium">Тип Эссенции:</strong> <span style={{color: selectedEssenceDetails.color.replace(/0\.\d+/, '1')}}>{selectedEssenceDetails.stageSpecificEssenceName}</span></p>
              <p><strong className="text-zinc-400 font-medium">Скорость Восстановления:</strong> <span className="text-emerald-300">~{ (specificMaxEssence / selectedGradeInfo.recoveryTimeHours).toFixed(1) }% в час</span></p>
            
                <div className="mt-2 border-t border-zinc-700 pt-3">
                    <button 
                        onClick={() => setShowCondensationDetails(!showCondensationDetails)}
                        className="flex items-center justify-between w-full text-sm font-medium text-sky-400 hover:text-sky-300"
                        aria-expanded={showCondensationDetails}
                    >
                        <span>Детали Конденсации Эссенции</span>
                        {showCondensationDetails ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </button>
                    {showCondensationDetails && condensationInfo.length > 0 && (
                        <div className="mt-2 space-y-1 text-xs text-zinc-400 pl-2 border-l border-zinc-600 ml-1">
                            <p className="text-sky-400 mb-1">1 ед. вашей эссенции эквивалентна:</p>
                            {condensationInfo.map((info, index) => (
                                <li key={index} className="list-disc ml-4">
                                   <span className="font-semibold text-sky-300">{formatCondensationFactor(info.factor)}</span> ед. эссенции {info.comparisonStageRankName && `${info.comparisonStageRankName}, `}{info.comparisonStageName}.
                                </li>
                            ))}
                        </div>
                    )}
                </div>
            </div>
          </div>
        )}
        
        <div>
          <h4 className="text-xl font-semibold text-zinc-200 mb-3 flex items-center">
            <ListBulletIcon className="mr-2 text-indigo-400" />
            Владение Навыками (Бонус: <span className="text-amber-300">+{character.proficiencyBonus}</span>):
          </h4>
          {character.selectedSkills.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1 pl-2">
              {character.selectedSkills.map(skill => (
                <li key={skill.id}><span className="font-medium">{skill.name}</span> <span className="text-zinc-400">({DND_ATTRIBUTE_NAMES_RU[skill.relatedAttribute]})</span></li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500 italic">Владение навыками не выбрано.</p>
          )}
        </div>
        
        <div>
          <h4 className="text-xl font-semibold text-zinc-200 mb-3 flex items-center">
            <CheckCircleIcon className="mr-2 text-indigo-400" />
            Активные Черты и Изъяны:
          </h4>
          {character.activeFeats.length > 0 ? (
            <div className="space-y-3">
              {character.activeFeats.map(feat => (
                <div key={feat.id} className={`p-4 rounded-xl ${feat.isFlaw ? 'bg-amber-900/40 border-l-4 border-amber-500' : 'bg-emerald-900/40 border-l-4 border-emerald-500'}`}>
                  <h5 className={`font-semibold ${feat.isFlaw ? 'text-amber-300' : 'text-emerald-300'}`}>
                    {feat.name}
                  </h5>
                  <p className="text-sm text-zinc-300 mt-1">{feat.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 italic">На данный момент нет активных черт или выбранных изъянов.</p>
          )}
        </div>

        <div>
          <h4 className="text-xl font-semibold text-zinc-200 mb-3 flex items-center">
            <ShieldCheckIcon className="mr-2 text-indigo-400"/>
            Особенности (Трейты) и Предметы:
          </h4>
          <TraitsAndItemsDisplay traits={character.selectedTraits} items={character.selectedItems} />
        </div>

        {character.backstory && (
          <div>
            <h4 className="text-xl font-semibold text-zinc-200 mt-2 mb-3">Сгенерированная Хроника (ИИ):</h4>
            <p className="text-sm text-zinc-300 whitespace-pre-wrap bg-zinc-800/50 p-4 rounded-xl">{character.backstory}</p>
          </div>
        )}
    </SectionPanel>
  );
};

export default CharacterSummary;