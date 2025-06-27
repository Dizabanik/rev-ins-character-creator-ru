
import React, { useState } from 'react';
import { ApertureGradeInfo, CharacterRankInfoNew, EssenceStageId } from '../types';
import { 
    APERTURE_GRADES, CHARACTER_RANKS, ESSENCE_STAGES, getEssenceDetails, 
    CircleStackIcon, UserCircleIcon, BeakerIcon, BoltIcon, StarIcon as StageIcon,
    getEssenceCondensationDetails, ChevronDownIcon, ChevronUpIcon
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

  const selectedGradeInfo = APERTURE_GRADES.find(g => g.id === selectedGradeId);
  const selectedRankInfo = CHARACTER_RANKS.find(r => r.id === selectedRankId);
  const selectedEssenceDetails = getEssenceDetails(selectedRankId, selectedStageId);

  const condensationInfo = selectedRankInfo && selectedStageId 
    ? getEssenceCondensationDetails(selectedRankInfo.id, selectedStageId) 
    : [];
    
  const formatCondensationFactor = (factor: number): string => {
    if (factor === 1) return "1.00";
    if (Math.abs(factor) > 0 && Math.abs(factor) < 0.01 && factor !== 0) return factor.toExponential(2);
    return factor.toFixed(2);
  };

  const fillPercentage = specificMaxEssence > 0 ? (currentEssencePercentage / specificMaxEssence) * 100 : 0;
  const essenceColor = selectedEssenceDetails?.color || 'rgba(100, 116, 139, 0.5)'; // default slate color

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 items-center">
      {/* Column 1: Aperture Visualization */}
      <div className="relative flex items-center justify-center h-full min-h-[300px] md:min-h-0">
          <div className="w-56 h-56 rounded-full bg-zinc-900/70 border-4 border-zinc-700/50 relative overflow-hidden flex items-center justify-center shadow-inner"
              style={{
                  boxShadow: `inset 0 0 15px rgba(0,0,0,0.5), 0 0 10px ${essenceColor.replace(/,\s*\d\.\d+\)/, ', 0.3)')}`
              }}
          >
              {/* The essence wave */}
              <div
                  className="absolute bottom-0 w-full transition-all duration-500 ease-in-out"
                  style={{
                      height: `${fillPercentage}%`,
                      backgroundColor: essenceColor,
                      boxShadow: `0 0 45px 20px ${essenceColor}`,
                  }}
              ></div>
              {/* Glassy overlay/glare */}
              <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.1), rgba(255,255,255,0) 70%)' }}></div>
              {/* Text inside */}
              <span className="relative text-4xl font-bold text-white/90" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                  {currentEssencePercentage.toFixed(1)}%
              </span>
          </div>
      </div>

      {/* Column 2: Controls */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <DropdownSelect
            label="Талант Апертуры (Грейд)"
            value={selectedGradeId}
            options={APERTURE_GRADES}
            onChange={onGradeChange}
            getOptionValue={(g: ApertureGradeInfo) => g.id}
            getOptionLabel={(g: ApertureGradeInfo) => g.name}
            id="aperture-grade-select"
          />
          <DropdownSelect
            label="Ранг Мастера Гу"
            value={selectedRankId}
            options={CHARACTER_RANKS}
            onChange={onRankChange}
            getOptionValue={(r: CharacterRankInfoNew) => r.id}
            getOptionLabel={(r: CharacterRankInfoNew) => r.name}
            id="character-rank-select"
          />
          <DropdownSelect
            label="Стадия Первобытной Эссенции"
            value={selectedStageId}
            options={ESSENCE_STAGES}
            onChange={(val) => onStageChange(val as EssenceStageId)}
            getOptionValue={(s: {id: EssenceStageId, displayName: string}) => s.id}
            getOptionLabel={(s: {id: EssenceStageId, displayName: string}) => s.displayName}
            id="essence-stage-select"
          />
        </div>

        {selectedGradeInfo && (
          <div className="p-4 bg-zinc-800/50 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label htmlFor="specificMaxEssence" className="block text-sm font-medium text-zinc-400 mb-2">
                  Точный Максимум ({selectedGradeInfo.minMaxEssence}% - {selectedGradeInfo.maxMaxEssence}%)
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    id="specificMaxEssence"
                    min={selectedGradeInfo.minMaxEssence}
                    max={selectedGradeInfo.maxMaxEssence}
                    value={specificMaxEssence}
                    onChange={(e) => onSpecificMaxEssenceChange(Number(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="number"
                    value={specificMaxEssence}
                    onChange={(e) => onSpecificMaxEssenceChange(Number(e.target.value))}
                    className="w-20 text-center ml-4 bg-zinc-800 border border-zinc-700 rounded-xl p-2"
                  />
                </div>
              </div>
            </div>
             <div className="flex-1">
                <label htmlFor="currentEssence" className="block text-sm font-medium text-zinc-400 mb-2">
                  Текущая Эссенция (0% - {specificMaxEssence}%)
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    id="currentEssence"
                    min={0}
                    max={specificMaxEssence}
                    step={0.1}
                    value={currentEssencePercentage}
                    onChange={(e) => onEssenceChange(Number(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="number"
                    step={0.1}
                    value={currentEssencePercentage.toFixed(1)}
                    onChange={(e) => onEssenceChange(Number(e.target.value))}
                    className="w-20 text-center ml-4 bg-zinc-800 border border-zinc-700 rounded-xl p-2"
                  />
                </div>
              </div>


            <div className="pt-4 border-t border-zinc-700/50 text-sm grid grid-cols-1 gap-x-6 gap-y-2">
              <div className="flex items-center text-zinc-300">
                  <CircleStackIcon className="h-5 w-5 mr-2 text-violet-400 flex-shrink-0" />
                  <p><span className="font-medium text-zinc-400 mr-1">Талант:</span> {selectedGradeInfo.description}</p>
              </div>
              <div className="flex items-center text-zinc-300">
                  <UserCircleIcon className="h-5 w-5 mr-2 text-amber-400 flex-shrink-0" />
                  <p><span className="font-medium text-zinc-400 mr-1">Ранг:</span> {selectedRankInfo?.name} ({selectedRankInfo?.rankColorGroup})</p>
              </div>
              {selectedEssenceDetails && (
                <>
                   <div className="flex items-center text-zinc-300">
                      <StageIcon className="h-5 w-5 mr-2 flex-shrink-0" style={{color: selectedEssenceDetails.color.replace(/0\.\d+/, '1')}}/>
                      <p><span className="font-medium text-zinc-400 mr-1">Стадия:</span> {selectedEssenceDetails.name}</p>
                   </div>
                   <div className="flex items-center text-zinc-300">
                      <BeakerIcon className="h-5 w-5 mr-2 flex-shrink-0" style={{color: selectedEssenceDetails.color.replace(/0\.\d+/, '1')}}/>
                      <p><span className="font-medium text-zinc-400 mr-1">Тип Эссенции:</span> {selectedEssenceDetails.stageSpecificEssenceName}</p>
                   </div>
                </>
              )}
              <div className="flex items-center text-zinc-300">
                  <BoltIcon className="h-5 w-5 mr-2 text-emerald-400 flex-shrink-0" />
                  <p><span className="font-medium text-zinc-400 mr-1">Восстановление:</span> ~{selectedGradeInfo.recoveryTimeHours > 0 ? (specificMaxEssence / selectedGradeInfo.recoveryTimeHours).toFixed(1) : '∞'}% / час</p>
              </div>
            </div>

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
        )}
      </div>
    </div>
  );
};

export default ApertureDisplay;
