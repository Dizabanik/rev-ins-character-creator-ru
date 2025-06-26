
import React, { useState } from 'react';
import { ApertureGradeInfo, EssenceStageId } from '../types';
import { 
    APERTURE_GRADES, CHARACTER_RANKS, ESSENCE_STAGES, getEssenceDetails, 
    CircleStackIcon, UserCircleIcon, BeakerIcon, BoltIcon, StarIcon as StageIcon,
    getEssenceCondensationDetails, ChevronDownIcon, ChevronUpIcon, CondensationDetailInfo
} from '../constants';
import DropdownSelect from './DropdownSelect';

interface ApertureDisplayProps {
  selectedGradeId: string;
  onGradeChange: (gradeId: string) => void;
  selectedRankId: string;
  onRankChange: (rankId: string) => void;
  selectedStageId: EssenceStageId;
  onStageChange: (stageId: EssenceStageId) => void;
  currentEssencePercentage: number;
  onEssenceChange: (percentage: number) => void;
  specificMaxEssence: number;
  onSpecificMaxEssenceChange: (percentage: number) => void;
}

const ApertureDisplay: React.FC<ApertureDisplayProps> = ({
  selectedGradeId,
  onGradeChange,
  selectedRankId,
  onRankChange,
  selectedStageId,
  onStageChange,
  currentEssencePercentage,
  onEssenceChange,
  specificMaxEssence,
  onSpecificMaxEssenceChange,
}) => {
  const [showCondensationDetails, setShowCondensationDetails] = useState(false);

  const gradeInfo = APERTURE_GRADES.find(g => g.id === selectedGradeId) || APERTURE_GRADES[0];
  const rankInfo = CHARACTER_RANKS.find(r => r.id === selectedRankId) || CHARACTER_RANKS[0];
  const essenceStageDetails = getEssenceDetails(selectedRankId, selectedStageId) || rankInfo.stages[0];
  const condensationInfo = getEssenceCondensationDetails(selectedRankId, selectedStageId);


  const handleCurrentEssenceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;
    onEssenceChange(Math.max(0, Math.min(value, specificMaxEssence)));
  };

  const handleSpecificMaxEssenceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = gradeInfo.minMaxEssence;
    onSpecificMaxEssenceChange(Math.max(gradeInfo.minMaxEssence, Math.min(value, gradeInfo.maxMaxEssence)));
  };

  const essenceFillHeight = specificMaxEssence > 0 ? (currentEssencePercentage / specificMaxEssence) * 100 : 0;

  const formatCondensationFactor = (factor: number): string => {
    if (factor === 1) return "1.00";
    if (factor > 0 && factor < 0.01) return factor.toExponential(2);
    return factor.toFixed(2);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <DropdownSelect
          label="Талант Апертуры (Grade)"
          value={selectedGradeId}
          options={APERTURE_GRADES}
          onChange={onGradeChange}
          getOptionValue={(option: ApertureGradeInfo) => option.id}
          getOptionLabel={(option: ApertureGradeInfo) => `${option.name} (Диапазон: ${option.minMaxEssence}-${option.maxMaxEssence}%)`}
          id="aperture-grade-select"
        />
        <DropdownSelect
          label="Ранг Мастера Гу (Rank)"
          value={selectedRankId}
          options={CHARACTER_RANKS}
          onChange={onRankChange}
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.name}
          id="character-rank-select"
        />
        <DropdownSelect
          label="Стадия Эссенции"
          value={selectedStageId}
          options={ESSENCE_STAGES}
          onChange={(value) => onStageChange(value as EssenceStageId)}
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.displayName}
          id="essence-stage-select"
        />
      </div>

      <div className="my-6 flex flex-col items-center">
        <div 
          className="w-32 h-32 md:w-40 md:h-40 bg-slate-700 border-4 border-slate-600 rounded-full relative overflow-hidden shadow-inner"
          aria-label={`Апертура: ${currentEssencePercentage}% из ${specificMaxEssence}%, цвет ${essenceStageDetails.colorName}`}
        >
          <div
            className="absolute bottom-0 left-0 w-full transition-all duration-500 ease-in-out"
            style={{
              height: `${essenceFillHeight}%`,
              backgroundColor: essenceStageDetails.color,
            }}
          ></div>
           <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-white opacity-80 tabular-nums" style={{textShadow: '0 0 5px rgba(0,0,0,0.7)'}}>
              {currentEssencePercentage}%
            </span>
          </div>
        </div>
        
        <div className="mt-4 w-full max-w-xs">
          <label htmlFor="specificMaxEssence" className="block text-sm font-medium text-slate-300 mb-1 text-center">
            Максимум Эссенции для Таланта ({specificMaxEssence}%)
          </label>
          <input
            type="range"
            id="specificMaxEssence"
            min={gradeInfo.minMaxEssence}
            max={gradeInfo.maxMaxEssence}
            value={specificMaxEssence}
            onChange={handleSpecificMaxEssenceInputChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
            disabled={gradeInfo.minMaxEssence === gradeInfo.maxMaxEssence} // Disable for S Grade
          />
          <div className="flex justify-between text-xs text-slate-400 px-1 mt-1">
            <span>{gradeInfo.minMaxEssence}%</span>
            <span>{gradeInfo.maxMaxEssence}%</span>
          </div>
        </div>

        <div className="mt-3 w-full max-w-xs">
          <label htmlFor="currentEssencePercentage" className="block text-sm font-medium text-slate-300 mb-1 text-center">
            Текущая Первобытная Эссенция ({currentEssencePercentage}%)
          </label>
          <input
            type="range"
            id="currentEssencePercentage"
            min="0"
            max={specificMaxEssence}
            value={currentEssencePercentage}
            onChange={handleCurrentEssenceInputChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
          <div className="flex justify-between text-xs text-slate-400 px-1 mt-1">
            <span>0%</span>
            <span>{specificMaxEssence}%</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-700/30 rounded-md space-y-2 text-sm text-slate-300 shadow">
        <div className="flex items-center">
          <CircleStackIcon className="w-5 h-5 mr-2 text-violet-400 flex-shrink-0" />
          <p><strong>Талант Апертуры:</strong> <span className="text-violet-300">{gradeInfo.name} (Макс. Эссенции: {specificMaxEssence}%)</span></p>
        </div>
        <div className="flex items-center">
          <UserCircleIcon className="w-5 h-5 mr-2 text-amber-400 flex-shrink-0" />
          <p><strong>Ранг Мастера Гу:</strong> <span className="text-amber-300">{rankInfo.name}</span> ({rankInfo.rankColorGroup})</p>
        </div>
        <div className="flex items-center">
          <StageIcon className="w-5 h-5 mr-2 text-yellow-400 flex-shrink-0" />
           <p><strong>Стадия Эссенции:</strong> <span className="text-yellow-300">{essenceStageDetails.name}</span></p>
        </div>
         <div className="flex items-center">
          <BeakerIcon className="w-5 h-5 mr-2 text-cyan-400 flex-shrink-0" />
          <div>
            <p><strong>Тип Эссенции:</strong> <span style={{color: essenceStageDetails.color.replace(/0\.\d+/, '1')}}>{essenceStageDetails.stageSpecificEssenceName}</span></p>
            <p><strong>Цвет:</strong> <span style={{color: essenceStageDetails.color.replace(/0\.\d+/, '1')}}>{essenceStageDetails.colorName}</span>, <span className="text-slate-400">Качество: {rankInfo.condensation}</span></p>
          </div>
        </div>
        <div className="flex items-center">
           <BoltIcon className="w-5 h-5 mr-2 text-lime-400 flex-shrink-0" />
          <p>
            <strong>Восстановление:</strong> 
            <span className="text-lime-300"> ~{(specificMaxEssence / gradeInfo.recoveryTimeHours).toFixed(1)}% в час</span> (полное за ~{gradeInfo.recoveryTimeHours} ч).
          </p>
        </div>
        <p className="text-xs text-slate-500 mt-1">{gradeInfo.description}</p>

        {/* Condensation Details Toggle */}
        <div className="mt-3 border-t border-slate-600 pt-3">
            <button 
                onClick={() => setShowCondensationDetails(!showCondensationDetails)}
                className="flex items-center justify-between w-full text-sm font-medium text-sky-300 hover:text-sky-200"
                aria-expanded={showCondensationDetails}
            >
                <span>Детали Конденсации Эссенции</span>
                {showCondensationDetails ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            {showCondensationDetails && condensationInfo.length > 0 && (
                <div className="mt-2 space-y-1 text-xs text-slate-400 pl-2 border-l border-slate-500 ml-1">
                    <p className="text-sky-400 mb-1">1 единица вашей текущей эссенции ({essenceStageDetails.name} {rankInfo.rankColorGroup}) эквивалентна:</p>
                    {condensationInfo.map((info, index) => (
                        <p key={index}>
                           <span className="font-semibold text-sky-300">{formatCondensationFactor(info.factor)}</span> единицам эссенции {info.comparisonStageRankName && `${info.comparisonStageRankName}, `}{info.comparisonStageName}.
                        </p>
                    ))}
                    <p className="mt-2 text-slate-500 italic text-xs">Примечание: Эти значения основаны на правилах конверсии между стадиями и рангами.</p>
                </div>
            )}
             {showCondensationDetails && condensationInfo.length === 0 && (
                <p className="text-xs text-slate-500 italic mt-2">Не удалось рассчитать детали конденсации.</p>
             )}
        </div>
      </div>
    </div>
  );
};

export default ApertureDisplay;