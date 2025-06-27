import React, { useState } from 'react';
import { Character } from '../types';
import SectionPanel from './SectionPanel';
import TraitsAndItemsDisplay from './TraitsAndItemsDisplay';
import { 
  ShieldCheckIcon, BookOpenIcon, CheckCircleIcon, DND_ATTRIBUTE_NAMES_RU, calculateModifier,
  TrendingUpIcon, UsersIcon, parseDerivedStatValue, ListBulletIcon, 
  APERTURE_GRADES, CHARACTER_RANKS, getEssenceDetails, BeakerIcon, CircleStackIcon, UserCircleIcon, BoltIcon,
  AVAILABLE_SKILLS, StarIcon as StageIcon, ChevronDownIcon, ChevronUpIcon, getEssenceCondensationDetails,
  HeartIcon, DiceIcon, ClockIcon, ShieldExclamationIcon, ArmorClassIcon
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
  const currentEssence = character.currentEssencePercentage ?? 0;
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
    <SectionPanel title="Обзор Персонажа" className="mt-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-red-300">{character.name}</h3>
          <p className="text-md text-slate-400">
            Уровень {character.level} 
            {character.selectedRace ? (
              <span className="font-medium text-red-400"> {character.selectedRace.name}</span>
            ) : " неизвестной расы"}
            {selectedRankInfo ? `, ${selectedRankInfo.name}` : ""}
            {selectedEssenceDetails ? ` (${selectedEssenceDetails.name})` : ""}
            , пришелец, внезапно телепортированный в неизвестный, жестокий мир.
          </p>
          <p className="text-sm text-slate-400 mt-1">Текущее игровое время: <ClockIcon className="inline h-4 w-4 mr-1 text-sky-400" /> {formatGameTime(character.gameTimeHours)}</p>
        </div>

        {(character.age || character.height || character.weight || character.eyeColor || character.hairColor) && (
          <div>
            <h4 className="text-lg font-semibold text-slate-200 mb-2 flex items-center">
              <UserCircleIcon className="mr-2 text-red-400" />
              Внешность
            </h4>
            <div className="p-3 bg-slate-800/50 rounded-md shadow grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm">
              {character.age && <p><strong className="text-slate-300">Возраст:</strong> <span className="text-slate-200">{character.age}</span></p>}
              {character.height && <p><strong className="text-slate-300">Рост:</strong> <span className="text-slate-200">{character.height}</span></p>}
              {character.weight && <p><strong className="text-slate-300">Вес:</strong> <span className="text-slate-200">{character.weight}</span></p>}
              {character.eyeColor && <p><strong className="text-slate-300">Цвет глаз:</strong> <span className="text-slate-200">{character.eyeColor}</span></p>}
              {character.hairColor && <p><strong className="text-slate-300">Волосы:</strong> <span className="text-slate-200">{character.hairColor}</span></p>}
            </div>
          </div>
        )}

        {character.manualBackstory && (
          <div>
            <h4 className="text-lg font-semibold text-slate-200 mb-2 flex items-center">
              <BookOpenIcon className="mr-2 text-red-400" />
              Предыстория (до телепортации)
            </h4>
            <p className="text-sm text-slate-300 whitespace-pre-wrap bg-slate-700/30 p-4 rounded-md shadow-inner">{character.manualBackstory}</p>
          </div>
        )}

        {/* HP and HD display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-800/70 rounded-lg text-center shadow-lg">
            <HeartIcon className="h-6 w-6 mb-1.5 text-red-400 mx-auto" />
            <span className="text-xl font-bold text-red-300">{character.currentHp} / {character.maxHp}</span>
            <span className="text-xs text-slate-400 block mt-1">Хитпоинты (HP)</span>
            {character.manualMaxHpModifier !== 0 && (
                <span className="text-xs text-slate-500 block mt-0.5">
                    (включая {character.manualMaxHpModifier > 0 ? '+' : ''}{character.manualMaxHpModifier} ручного модификатора)
                </span>
            )}
          </div>
          <div className="p-3 bg-slate-800/70 rounded-lg text-center shadow-lg">
            <DiceIcon className="h-6 w-6 mb-1.5 text-green-400 mx-auto" />
            <span className="text-xl font-bold text-green-300">{character.currentHitDice} / {character.maxHitDice}</span>
            <span className="text-xs text-slate-400 block mt-1">Кости Хитов (d{character.hitDieType})</span>
          </div>
          <div className="p-3 bg-slate-800/70 rounded-lg text-center shadow-lg">
            <ShieldExclamationIcon className="h-6 w-6 mb-1.5 text-yellow-400 mx-auto" />
            <span className={`text-xl font-bold ${character.exhaustionLevel > 0 ? 'text-yellow-300' : 'text-slate-200'}`}>{character.exhaustionLevel}</span>
            <span className="text-xs text-slate-400 block mt-1">Уровень Истощения</span>
          </div>
        </div>


        {character.selectedRace && (
           <div>
            <h4 className="text-lg font-semibold text-slate-200 mb-2 flex items-center">
                <UsersIcon className="mr-2 text-red-400 h-5 w-5" />
                Расовые Особенности ({character.selectedRace.name}):
            </h4>
            <div className="p-3 bg-slate-800/50 rounded-md shadow">
                <p className="text-sm text-slate-300 mb-2">{character.selectedRace.description}</p>
                {character.selectedRace.hitDieInfoText && (
                    <p className="text-sm text-yellow-300 font-medium mb-1.5">{character.selectedRace.hitDieInfoText}</p>
                )}
                {character.selectedRace.specialAbilities.length > 0 && (
                  <div className="mb-1.5">
                    <h5 className="text-sm font-medium text-slate-200 mb-0.5">Ключевые способности:</h5>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5">
                      {character.selectedRace.specialAbilities.map((ability, idx) => (
                        <li key={'sa-' + idx}>{ability}</li>
                      ))}
                    </ul>
                  </div>
                )}
                 {character.selectedRace.attributeModifiers && Object.keys(character.selectedRace.attributeModifiers).length > 0 && (
                    <div className="mb-1.5">
                        <h5 className="text-sm font-medium text-slate-200 mb-0.5">Расовые модификаторы характеристик:</h5>
                        <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5">
                        {Object.entries(character.selectedRace.attributeModifiers).map(([attr, mod]) => (
                            <li key={'attr-' + attr}>{DND_ATTRIBUTE_NAMES_RU[attr as keyof typeof DND_ATTRIBUTE_NAMES_RU]}: {mod! > 0 ? '+' : ''}{mod}</li>
                        ))}
                        </ul>
                    </div>
                 )}
                 {character.selectedRace.skillModifiers && Object.keys(character.selectedRace.skillModifiers).length > 0 && (
                    <div className="mt-1.5">
                        <h5 className="text-sm font-medium text-slate-200 mb-0.5">Расовые модификаторы навыков:</h5>
                        <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5">
                        {Object.entries(character.selectedRace.skillModifiers).map(([skillId, mod]) => {
                            const skill = AVAILABLE_SKILLS.find(s => s.id === skillId);
                            return (
                                <li key={skillId}>{skill ? skill.name : skillId}: {mod > 0 ? '+' : ''}{mod}</li>
                            );
                        })}
                        </ul>
                    </div>
                  )}
            </div>
           </div>
        )}

        {derivedStats.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-slate-200 mb-3 flex items-center">
                <TrendingUpIcon className="mr-2 text-red-400 h-5 w-5" />
                Производные Эффекты и Состояния:
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 items-stretch">
                {derivedStats.map((statString, index) => {
                    const parsed = parseDerivedStatValue(statString);
                    if (parsed.isApertureInfo || parsed.isHpInfo) return null; 

                    const valueFontSize = parsed.isSkill ? 'text-xl' : 'text-3xl';
                    const labelFontSize = parsed.isSkill ? 'text-xs' : 'text-xs';
                    const containerClasses = !parsed.isNumeric ? 'col-span-2 sm:col-span-full md:col-span-full' : '';

                    return (
                        <li key={'ds-' + index} className={`flex flex-col items-center justify-center p-3 bg-slate-800/70 rounded-lg text-center h-full shadow-lg ${containerClasses}`}>
                             {parsed.IconComponent && <parsed.IconComponent className={`h-6 w-6 mb-1.5 ${parsed.iconColor}`} />}
                             {parsed.isNumeric ? ( 
                                <>
                                  <span className={`${valueFontSize} font-bold ${parsed.valueColor}`}>{parsed.value}{parsed.suffix}</span>
                                  <span className={`${labelFontSize} text-slate-400 mt-1`}>{parsed.label}
                                     {parsed.label.startsWith("Класс Брони (КБ)") && character.manualAcModifier !== 0 && (
                                        <span className="text-xs text-slate-500 block mt-0.5">
                                            (включая {character.manualAcModifier > 0 ? '+' : ''}{character.manualAcModifier} ручного модификатора)
                                        </span>
                                    )}
                                  </span>
                                </>
                              ) : (
                                <div className="text-left w-full">
                                   <span className={`text-sm text-slate-300`}><strong className={parsed.iconColor || 'text-sky-400'}>{parsed.label}:</strong> {parsed.value}</span>
                                </div>
                              )}
                        </li>
                    );
                })}
            </ul>
          </div>
        )}

        {selectedGradeInfo && selectedRankInfo && selectedEssenceDetails && (
          <div>
            <h4 className="text-lg font-semibold text-slate-200 mt-4 mb-2 flex items-center">
              <BeakerIcon className="mr-2 text-red-400" />
              Состояние Апертуры:
            </h4>
            <div className="p-3 bg-slate-800/50 rounded-md shadow space-y-1 text-sm">
              <p><strong className="text-slate-300">Талант Апертуры:</strong> <span className="text-violet-300">{selectedGradeInfo.name}</span></p>
              <p><strong className="text-slate-300">Ранг Мастера Гу:</strong> <span className="text-amber-300">{selectedRankInfo.name}</span> ({selectedRankInfo.rankColorGroup})</p>
              <p><strong className="text-slate-300">Макс. Эссенция (установлено):</strong> <span className="text-cyan-300">{specificMaxEssence}%</span> (Диапазон таланта: {selectedGradeInfo.minMaxEssence}-{selectedGradeInfo.maxMaxEssence}%)</p>
              <p><strong className="text-slate-300">Текущая Эссенция:</strong> <span className="text-cyan-300">{character.currentEssencePercentage?.toFixed(2)}% / {specificMaxEssence}%</span></p>
              <p><strong className="text-slate-300">Стадия Эссенции:</strong> <span style={{color: selectedEssenceDetails.color.replace(/0\.\d+/, '1')}}>{selectedEssenceDetails.name}</span></p>
              <p><strong className="text-slate-300">Тип Эссенции:</strong> <span style={{color: selectedEssenceDetails.color.replace(/0\.\d+/, '1')}}>{selectedEssenceDetails.stageSpecificEssenceName}</span></p>
              <p><strong className="text-slate-300">Цвет Эссенции:</strong> <span style={{color: selectedEssenceDetails.color.replace(/0\.\d+/, '1')}}>{selectedEssenceDetails.colorName}</span></p>
              <p><strong className="text-slate-300">Качество:</strong> <span className="text-slate-300">{selectedRankInfo.condensation}</span></p>
              <p><strong className="text-slate-300">Скорость Восстановления:</strong> <span className="text-lime-300">~{ (specificMaxEssence / selectedGradeInfo.recoveryTimeHours).toFixed(1) }% в час (полное за ~{selectedGradeInfo.recoveryTimeHours} ч.)</span></p>
            
                <div className="mt-3 border-t border-slate-700 pt-3">
                    <button 
                        onClick={() => setShowCondensationDetails(!showCondensationDetails)}
                        className="flex items-center justify-between w-full text-sm font-medium text-sky-300 hover:text-sky-200"
                        aria-expanded={showCondensationDetails}
                    >
                        <span>Детали Конденсации Эссенции</span>
                        {showCondensationDetails ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </button>
                    {showCondensationDetails && condensationInfo.length > 0 && (
                        <div className="mt-2 space-y-1 text-xs text-slate-400 pl-2 border-l border-slate-600 ml-1">
                            <p className="text-sky-400 mb-1">1 единица эссенции <strong style={{color: selectedEssenceDetails.color.replace(/0\.\d+/, '1')}}>{selectedEssenceDetails.name} {selectedRankInfo.rankColorGroup}</strong> эквивалентна:</p>
                            {condensationInfo.map((info, index) => (
                                <li key={index} className="list-disc ml-4">
                                   <span className="font-semibold text-sky-300">{formatCondensationFactor(info.factor)}</span> ед. эссенции {info.comparisonStageRankName && `${info.comparisonStageRankName}, `}{info.comparisonStageName}.
                                </li>
                            ))}
                             <p className="mt-2 text-slate-500 italic text-xs">Примечание: Это отражает относительную "ценность" или "силу" 1% эссенции.</p>
                        </div>
                    )}
                    {showCondensationDetails && condensationInfo.length === 0 && (
                        <p className="text-xs text-slate-500 italic mt-2">Не удалось рассчитать детали конденсации.</p>
                    )}
                </div>
            </div>
          </div>
        )}
        
        <div>
            <h4 className="text-lg font-semibold text-slate-200 mb-2">Итоговые Характеристики:</h4>
            <ul className="list-none text-sm text-slate-300 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
              {Object.entries(character.attributes).map(([key, value]) => { 
                const modifier = calculateModifier(value);
                return (
                    <li key={key} className="flex justify-between p-2 bg-slate-700/30 rounded">
                    <span>{DND_ATTRIBUTE_NAMES_RU[key as keyof typeof DND_ATTRIBUTE_NAMES_RU]}:</span> 
                    <span className="font-bold text-red-300">{value} <span className={'text-xs ' + (modifier >=0 ? 'text-green-400' : 'text-red-400')}>({modifier >=0 ? '+':''}{modifier})</span></span>
                    </li>
                );
              })}
            </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-slate-200 mb-2 flex items-center">
            <BookOpenIcon className="mr-2 text-red-400" />
            Владение Навыками (Бонус Умения: <span className="text-yellow-300">+{character.proficiencyBonus}</span>):
          </h4>
          {character.selectedSkills.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
              {character.selectedSkills.map(skill => (
                <li key={skill.id}><span className="font-medium">{skill.name}</span> ({DND_ATTRIBUTE_NAMES_RU[skill.relatedAttribute]})</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 italic">Владение навыками не выбрано.</p>
          )}
        </div>
        
        <div>
          <h4 className="text-lg font-semibold text-slate-200 mb-2 flex items-center">
            <CheckCircleIcon className="mr-2 text-green-400" />
            Активные Черты и Изъяны:
          </h4>
          {character.activeFeats.length > 0 ? (
            <div className="space-y-2">
              {character.activeFeats.map(feat => (
                <div key={feat.id} className={'p-3 rounded-md ' + (feat.isFlaw ? 'bg-yellow-700/40 border-l-2 border-yellow-500' : 'bg-slate-700/50 border-l-2 border-green-500')}>
                  <h5 className={'font-semibold ' + (feat.isFlaw ? 'text-yellow-300' : 'text-green-300')}>
                    {feat.name}
                  </h5>
                  <p className="text-xs text-slate-300">{feat.description}</p>
                   {feat.isFlaw && feat.requirements.length === 0 && feat.modificationPointAdjustment && feat.modificationPointAdjustment > 0 && (
                      <p className="text-xs text-green-400 mt-0.5">Дает ОМ: {feat.modificationPointAdjustment}</p>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">На данный момент нет активных черт или выбранных изъянов.</p>
          )}
        </div>

        <div>
          <h4 className="text-lg font-semibold text-slate-200 mb-2 flex items-center">
            <ShieldCheckIcon className="mr-2 text-red-400"/>
            Особенности (Трейты) и Предметы:
          </h4>
          <TraitsAndItemsDisplay traits={character.selectedTraits} items={character.selectedItems} />
        </div>

        {character.madnessEffect && character.madnessEffect.id !== "none" && (
          <div>
            <h4 className="text-lg font-semibold text-slate-200 mt-2">Начальное Безумие:</h4>
            <div className="p-3 bg-slate-700/50 rounded-md">
                <h5 className="font-semibold text-yellow-300">{character.madnessEffect.name} ({character.madnessEffect.type === "short-term" ? "краткосрочное" : character.madnessEffect.type === "long-term" ? "долгосрочное" : "бессрочное"})</h5>
                <p className="text-sm text-slate-300">{character.madnessEffect.description}</p>
            </div>
          </div>
        )}

        {character.backstory && (
          <div>
            <h4 className="text-lg font-semibold text-slate-200 mt-2">Сгенерированная Хроника (ИИ):</h4>
            <p className="text-sm text-slate-300 whitespace-pre-wrap bg-slate-700/30 p-4 rounded-md shadow-inner">{character.backstory}</p>
          </div>
        )}
         <div className="mt-4 text-xs text-slate-500">
            <p>Оставшиеся очки покупки базовых характеристик: {character.attributeBuyPoints}</p>
            <p>Оставшиеся Очки Модификации: {character.modificationPoints}</p>
        </div>
      </div>
    </SectionPanel>
  );
};

export default CharacterSummary;