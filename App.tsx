



import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Character, Attributes, DndAttribute, Trait, StartingItem, MadnessEffect, Skill, Feat, Race, EssenceStageId, ArmorTypeForSleep, CharacterSaveData, EquipmentSlots, InventoryItem, EquipmentSlotId, ArmorType } from './types';
import {
  DND_ATTRIBUTES_KEYS, ATTRIBUTE_BASE_SCORE, INITIAL_ATTRIBUTE_BUY_POINTS,
  INITIAL_MODIFICATION_POINTS, AVAILABLE_TRAITS, AVAILABLE_STARTING_ITEMS, 
  AVAILABLE_MADNESS_EFFECTS, AVAILABLE_SKILLS, MAX_SKILL_PROFICIENCIES,
  AVAILABLE_FEATS, DND_ATTRIBUTE_NAMES_RU, calculateModifier, 
  BASE_ARMOR_CLASS, SAVING_THROW_KEYS, SAVING_THROW_NAMES_RU, AVAILABLE_RACES,
  InfoIcon, ShieldCheckIcon, BookOpenIcon, CheckCircleIcon, XCircleIcon, TrendingUpIcon, UsersIcon,
  ShieldExclamationIcon, parseDerivedStatValue, ListBulletIcon, StarIcon,
  calculateProficiencyBonus, PlusIcon, MinusIcon,
  APERTURE_GRADES, CHARACTER_RANKS, ESSENCE_STAGES, BeakerIcon, DEFAULT_HIT_DIE_TYPE, ARMOR_TYPES_FOR_SLEEP,
  PencilSquareIcon, HeartIcon, ArmorClassIcon, BackpackIcon, WEAPON_PROPERTY_DEFINITIONS, ScaleIcon
} from './constants';
import SectionPanel from './components/SectionPanel';
import DropdownSelect from './components/DropdownSelect';
import AttributeEditor from './components/AttributeEditor';
import TraitsAndItemsDisplay from './components/TraitsAndItemsDisplay';
import CharacterSummary from './components/CharacterSummary';
import ApertureDisplay from './components/ApertureDisplay'; 
import CharacterStatusPanel from './components/CharacterStatusPanel';
import HitDieTypeEditor from './components/HitDieTypeEditor';
import Inventory from './components/Inventory';
import AddCustomItemModal from './components/AddCustomItemModal';


type MadnessOption = Omit<MadnessEffect, 'type'> & { type: MadnessEffect['type'] | 'none' };

const calculateFinalAttributes = (baseAttributes: Attributes, race?: Race): Attributes => {
  const finalAttributes = { ...baseAttributes };
  if (race && race.attributeModifiers) {
    for (const key in race.attributeModifiers) {
      const attrKey = key as DndAttribute;
      if (finalAttributes[attrKey] !== undefined) { 
        finalAttributes[attrKey] += (race.attributeModifiers[attrKey] || 0);
      }
    }
  }
  return finalAttributes;
};

// const getTopAttributeKeysForSkillSelection = (finalAttributes: Attributes): DndAttribute[] => {
//   const scores = DND_ATTRIBUTES_KEYS
//     .map(key => ({ key, score: finalAttributes[key] as number }))
//     .sort((a, b) => b.score - a.score);

//   if (scores.length === 0) return [];
//   const cutoffScore = scores[Math.min(1, scores.length - 1)].score;
//   return scores
//     .filter(s => s.score >= cutoffScore)
//     .map(s => s.key);
// };
const getTopAttributeKeysForSkillSelection = (finalAttributes: Attributes): DndAttribute[] => {
  const scores = DND_ATTRIBUTES_KEYS
    .map(key => ({ key, score: finalAttributes[key] as number }))
    .sort((a, b) => b.score - a.score);

  if (scores.length === 0) return [];

  const cutoffScore = scores[Math.min(1, scores.length - 1)].score;
  const topKeys = scores
    .filter(s => s.score >= cutoffScore)
    .map(s => s.key);

  // If exactly two attributes were selected and one is "constitution",
  // replace constitution with the next best non-constitution attribute(s),
  // including any ties at that replacement score.
  if (topKeys.length === 2 && topKeys.includes('constitution' as DndAttribute)) {
    const replacement: DndAttribute[] = [];
    // iterate sorted scores, skipping "constitution"
    for (let i = 0; i < scores.length; i++) {
      const entry = scores[i];
      if (entry.key === ('constitution' as DndAttribute)) continue;

      replacement.push(entry.key);

      // once we've collected at least 2, include any further ties at the same score
      if (replacement.length >= 2) {
        const lastScore = entry.score;
        // include subsequent non-constitution entries with the same score
        for (let j = i + 1; j < scores.length; j++) {
          if (scores[j].key === ('constitution' as DndAttribute)) continue;
          if (scores[j].score === lastScore) replacement.push(scores[j].key);
          else break;
        }
        break;
      }
    }
    // If there weren't enough non-constitution attributes to reach 2,
    // replacement will contain whatever non-constitution attributes exist.
    return replacement;
  }

  return topKeys;
};

const arraysHaveSameElements = (arr1: DndAttribute[], arr2: DndAttribute[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.every((val, index) => val === sorted2[index]);
};


const App = (): JSX.Element => {
  const [characterName, setCharacterName] = useState<string>('Незнакомец');
  const [characterLevel, setCharacterLevel] = useState<number>(1);
  
  const initialBaseAttributes: Attributes = DND_ATTRIBUTES_KEYS.reduce((acc, key) => {
    acc[key] = ATTRIBUTE_BASE_SCORE;
    return acc;
  }, {} as Attributes);

  const [baseAttributes, setBaseAttributes] = useState<Attributes>(initialBaseAttributes); 
  const [attributeBuyPoints, setAttributeBuyPoints] = useState<number>(INITIAL_ATTRIBUTE_BUY_POINTS);
  const [modificationPoints, setModificationPoints] = useState<number>(INITIAL_MODIFICATION_POINTS);
  
  const defaultRace = AVAILABLE_RACES.find(r => r.id === 'human') || (AVAILABLE_RACES.length > 0 ? AVAILABLE_RACES[0] : undefined);
  const [selectedRace, setSelectedRace] = useState<Race | undefined>(defaultRace);
  
  // New appearance state
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [eyeColor, setEyeColor] = useState<string>('');
  const [hairColor, setHairColor] = useState<string>('');
  const [manualBackstory, setManualBackstory] = useState<string>('');

  const [selectedTraits, setSelectedTraits] = useState<Trait[]>([]);
  const [selectedItems, setSelectedItems] = useState<StartingItem[]>([]);
  const [selectedMadness, setSelectedMadness] = useState<MadnessEffect | undefined>(undefined);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [activeFeats, setActiveFeats] = useState<Feat[]>([]); 
  const [selectedFlawFeats, setSelectedFlawFeats] = useState<Feat[]>([]); 
  
  // Inventory State
  const [equipment, setEquipment] = useState<EquipmentSlots>({});
  const [backpack, setBackpack] = useState<InventoryItem[]>([]);
  const [customItems, setCustomItems] = useState<StartingItem[]>([]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);


  // Aperture State
  const defaultApertureGrade = APERTURE_GRADES[1]; 
  const [selectedApertureGradeId, setSelectedApertureGradeId] = useState<string>(defaultApertureGrade.id);
  const [specificMaxEssence, setSpecificMaxEssence] = useState<number>(defaultApertureGrade.minMaxEssence);
  const [selectedCharacterRankId, setSelectedCharacterRankId] = useState<string>(CHARACTER_RANKS[0].id); 
  const [selectedEssenceStageId, setSelectedEssenceStageId] = useState<EssenceStageId>(ESSENCE_STAGES[0].id); 
  const [currentEssencePercentage, setCurrentEssencePercentage] = useState<number>(defaultApertureGrade.minMaxEssence);

  // HP, HD, Time, Rest State
  const [maxHp, setMaxHp] = useState<number>(DEFAULT_HIT_DIE_TYPE); // Will be calculated
  const [currentHp, setCurrentHp] = useState<number>(DEFAULT_HIT_DIE_TYPE); // Will be calculated
  const [hitDieType, setHitDieType] = useState<number>(DEFAULT_HIT_DIE_TYPE);
  const [maxHitDice, setMaxHitDice] = useState<number>(1); // Will be characterLevel
  const [currentHitDice, setCurrentHitDice] = useState<number>(1); // Will be characterLevel
  const [gameTimeHours, setGameTimeHours] = useState<number>(8); // Start at 8 AM, Day 1
  const [lastLongRestEndTime, setLastLongRestEndTime] = useState<number>(0); 
  const [lastExhaustionCheckTime, setLastExhaustionCheckTime] = useState<number>(0);
  const [exhaustionLevel, setExhaustionLevel] = useState<number>(0);
  const [armorTypeWornForSleep, setArmorTypeWornForSleep] = useState<ArmorTypeForSleep>('none');
  const [conSavesProficiency, setConSavesProficiency] = useState<boolean>(false); // For CON saves for exhaustion
  const [manualMaxHpModifier, setManualMaxHpModifier] = useState<number>(0);
  const [manualAcModifier, setManualAcModifier] = useState<number>(0);


  const [backstory, setBackstory] = useState<string | undefined>(undefined);
  const [showSummary, setShowSummary] = useState<boolean>(false); // May be used later for a "View Summary" button
  const [derivedStats, setDerivedStats] = useState<string[]>([]);
  
  const finalAttributes = useMemo(() => calculateFinalAttributes(baseAttributes, selectedRace), [baseAttributes, selectedRace]);
  const currentProficiencyBonus = useMemo(() => calculateProficiencyBonus(characterLevel), [characterLevel]);
  const currentApertureGrade = useMemo(() => APERTURE_GRADES.find(g => g.id === selectedApertureGradeId) || APERTURE_GRADES[0], [selectedApertureGradeId]);

  const [eligibleAttributesForFirstSkills, setEligibleAttributesForFirstSkills] = useState<DndAttribute[]>(
    getTopAttributeKeysForSkillSelection(finalAttributes) 
  );
  
  const fileInputRef = useRef<HTMLInputElement>(null);


  const checkFeatRequirements = (feat: Feat, currentFinalAttributes: Attributes): boolean => {
    return feat.requirements.every(req => {
      const attrValue = currentFinalAttributes[req.attribute];
      if (req.minValue !== undefined && attrValue < req.minValue) return false;
      if (req.maxValue !== undefined && attrValue > req.maxValue) return false;
      return true;
    });
  };
  
  useEffect(() => {
    const newEligibleAttrs = getTopAttributeKeysForSkillSelection(finalAttributes);
    if (!arraysHaveSameElements(newEligibleAttrs, eligibleAttributesForFirstSkills)) {
      setSelectedSkills([]); 
      setEligibleAttributesForFirstSkills(newEligibleAttrs);
    }
  }, [finalAttributes, eligibleAttributesForFirstSkills]);

  useEffect(() => {
    const autoActivatedBeneficial = AVAILABLE_FEATS.filter(feat => 
      !feat.isFlaw && 
      feat.requirements.length > 0 && 
      checkFeatRequirements(feat, finalAttributes) 
    );
    const autoActivatedStatFlaws = AVAILABLE_FEATS.filter(feat =>
        feat.isFlaw &&
        feat.requirements.length > 0 && 
        checkFeatRequirements(feat, finalAttributes) 
    );
    setActiveFeats([...autoActivatedBeneficial, ...autoActivatedStatFlaws]);
  }, [finalAttributes]); 
  
  useEffect(() => {
    let currentMP = INITIAL_MODIFICATION_POINTS;

    DND_ATTRIBUTES_KEYS.forEach(attrKey => {
      const score = baseAttributes[attrKey]; 
      if (score < ATTRIBUTE_BASE_SCORE) {
        currentMP += (ATTRIBUTE_BASE_SCORE - score);
      }
    });

    selectedTraits.forEach(trait => currentMP -= trait.modificationPointCost);
    selectedItems.forEach(item => currentMP -= item.modificationPointCost);
    if (selectedMadness) {
      currentMP -= selectedMadness.modificationPointAdjustment; 
    }
    
    selectedFlawFeats.forEach(feat => {
        if (feat.modificationPointAdjustment && feat.modificationPointAdjustment > 0) {
            currentMP += feat.modificationPointAdjustment;
        }
    });

    setModificationPoints(currentMP);
  }, [baseAttributes, selectedTraits, selectedItems, selectedMadness, selectedFlawFeats]); 

  // Sync selected items with inventory
  useEffect(() => {
      const targetItemIds = new Set(selectedItems.map(i => i.id));
      const allInventoryItems = [...backpack, ...Object.values(equipment).filter(Boolean) as InventoryItem[]];

      const instanceIdsToRemove = new Set<string>();
      for (const invItem of allInventoryItems) {
          const isCustom = invItem.itemId.startsWith('custom-');
          if (!isCustom && !targetItemIds.has(invItem.itemId)) {
              instanceIdsToRemove.add(invItem.instanceId);
          }
      }
      
      const currentItemCounts = allInventoryItems.reduce((acc, item) => {
          if (!item.itemId.startsWith('custom-')) {
            acc[item.itemId] = (acc[item.itemId] || 0) + 1;
          }
          return acc;
      }, {} as Record<string, number>);

      const itemsToAdd: StartingItem[] = [];
      for (const selectedItem of selectedItems) {
          const currentCount = currentItemCounts[selectedItem.id] || 0;
          const targetCount = selectedItems.filter(i => i.id === selectedItem.id).length;
          if (currentCount < targetCount) {
              itemsToAdd.push(selectedItem);
          }
      }
      
      if (instanceIdsToRemove.size === 0 && itemsToAdd.length === 0) {
          return;
      }

      setBackpack(prev => {
          const filtered = prev.filter(i => !instanceIdsToRemove.has(i.instanceId));
          const added = itemsToAdd.map(def => ({
              itemId: def.id,
              instanceId: `item-${Date.now()}-${Math.random()}`
          }));
          return [...filtered, ...added];
      });

      setEquipment(prev => {
          const newEquipment = {...prev};
          let changed = false;
          for (const slot in newEquipment) {
              const s = slot as EquipmentSlotId;
              if (newEquipment[s] && instanceIdsToRemove.has(newEquipment[s]!.instanceId)) {
                  newEquipment[s] = null;
                  changed = true;
              }
          }
          return changed ? newEquipment : prev;
      });

  }, [selectedItems]);


  // Set Hit Die Type based on Race
  useEffect(() => {
    if (selectedRace) {
      if (selectedRace.id === 'rockman') {
        setHitDieType(12);
      } else if (selectedRace.id === 'eggman') {
        setHitDieType(6);
      } else {
        setHitDieType(DEFAULT_HIT_DIE_TYPE); // Default for human and others
      }
    } else {
      setHitDieType(DEFAULT_HIT_DIE_TYPE); // Fallback if no race selected
    }
  }, [selectedRace]);

  // Calculate Max HP
  useEffect(() => {
    const conMod = calculateModifier(finalAttributes.constitution);
    let calculatedMaxHp;

    // HP for Level 1: Max HD roll + CON modifier
    let levelOneHp = hitDieType + conMod;
    levelOneHp = Math.max(1, levelOneHp); // Ensure at least 1 HP at level 1

    if (characterLevel === 1) {
        calculatedMaxHp = levelOneHp;
    } else {
        calculatedMaxHp = levelOneHp; // Start with L1 HP
        // For levels 2+
        for (let i = 2; i <= characterLevel; i++) {
            // Average roll (rounded up via floor+1) + CON mod
            calculatedMaxHp += (Math.floor(hitDieType / 2) + 1 + conMod); 
        }
    }
    
    const allCurrentEffectiveFeats = [
        ...activeFeats, 
        ...selectedFlawFeats
    ].filter((feat, index, self) => index === self.findIndex(f => f.id === feat.id));

    if (selectedTraits.find(t => t.id === 'trait_tough')) calculatedMaxHp += 2; // Flat +2 HP from "Крепкий"
    if (allCurrentEffectiveFeats.find(f => f.id === 'feat_tough_upgrade')) calculatedMaxHp += (2 * characterLevel); // +2 HP per level from "Закаленный"
    
    calculatedMaxHp += manualMaxHpModifier; // Apply manual modifier

    calculatedMaxHp = Math.max(characterLevel, calculatedMaxHp); // Ensure HP is at least 1 per level

    setMaxHp(calculatedMaxHp);
    setCurrentHp(prev => Math.min(prev, calculatedMaxHp)); 
    setMaxHitDice(characterLevel);
    setCurrentHitDice(prev => Math.min(prev, characterLevel)); 
  }, [finalAttributes.constitution, characterLevel, hitDieType, selectedTraits, activeFeats, selectedFlawFeats, manualMaxHpModifier]);

  // Update CON save proficiency based on traits/feats
  useEffect(() => {
    const resilientCon = selectedTraits.find(t => t.id === 'trait_resilient_con');
    setConSavesProficiency(!!resilientCon);
  }, [selectedTraits]);


  const handleToggleTrait = (trait: Trait) => {
    setSelectedTraits(prev => 
      prev.find(t => t.id === trait.id) 
      ? prev.filter(t => t.id !== trait.id) 
      : [...prev, trait]
    );
  };

  const handleToggleItem = (item: StartingItem) => {
    setSelectedItems(prev =>
      prev.find(i => i.id === item.id)
      ? prev.filter(i => i.id !== item.id)
      : [...prev, item]
    );
  };

  const handleToggleSkill = (skill: Skill) => {
    setSelectedSkills(prev => {
      const isCurrentlySelected = prev.some(s => s.id === skill.id);
      if (isCurrentlySelected) {
        return prev.filter(s => s.id !== skill.id); 
      } else {
        if (prev.length >= MAX_SKILL_PROFICIENCIES) return prev; 
        if (prev.length < 2) { 
          if (eligibleAttributesForFirstSkills.includes(skill.relatedAttribute)) return [...prev, skill];
        } else { 
          return [...prev, skill]; 
        }
      }
      return prev; 
    });
  };

  const handleToggleFlawFeat = (feat: Feat) => {
    if (feat.isFlaw && feat.requirements.length === 0) {
        setSelectedFlawFeats(prev => {
        const isSelected = prev.find(f => f.id === feat.id);
        return isSelected ? prev.filter(f => f.id !== feat.id) : [...prev, feat];
        });
    }
  };
  
  const handleMadnessChange = (madnessId: string) => {
    setSelectedMadness(madnessId === "none" ? undefined : AVAILABLE_MADNESS_EFFECTS.find(m => m.id === madnessId));
  };

  const handleRaceChange = (raceId: string) => {
    const newRace = AVAILABLE_RACES.find(r => r.id === raceId);
    setSelectedRace(newRace);

    // If changing to Merman, unequip items from feet
    if (newRace?.id === 'merman' && equipment.feet) {
        setBackpack(prev => [...prev, equipment.feet!]);
        setEquipment(prev => ({...prev, feet: null}));
    }
  };

  const handleBackstoryGenerated = useCallback((newBackstory: string) => {
    setBackstory(newBackstory);
  }, []);

  const handleApertureGradeChange = (gradeId: string) => {
    const newGrade = APERTURE_GRADES.find(g => g.id === gradeId) || APERTURE_GRADES[0];
    setSelectedApertureGradeId(gradeId);
    
    let newSpecificMax = specificMaxEssence;
    if (specificMaxEssence < newGrade.minMaxEssence) {
      newSpecificMax = newGrade.minMaxEssence;
    } else if (specificMaxEssence > newGrade.maxMaxEssence) {
      newSpecificMax = newGrade.maxMaxEssence;
    }
    setSpecificMaxEssence(newSpecificMax);

    if (currentEssencePercentage > newSpecificMax) {
        setCurrentEssencePercentage(newSpecificMax);
    }
  };

  const handleSpecificMaxEssenceChange = (newMax: number) => {
    const grade = currentApertureGrade;
    const clampedMax = Math.max(grade.minMaxEssence, Math.min(newMax, grade.maxMaxEssence));
    setSpecificMaxEssence(clampedMax);
    if (currentEssencePercentage > clampedMax) {
      setCurrentEssencePercentage(clampedMax);
    }
  };

  const handleCharacterRankChange = (rankId: string) => setSelectedCharacterRankId(rankId);
  const handleEssenceStageChange = (stageId: EssenceStageId) => setSelectedEssenceStageId(stageId);
  
  const handleEssencePercentageChange = (percentage: number) => {
    setCurrentEssencePercentage(Math.max(0, Math.min(percentage, specificMaxEssence)));
  };


  // TIME AND REST LOGIC
  const passTime = useCallback((hours: number) => {
    const newGameTimeHours = gameTimeHours + hours;

    if (currentApertureGrade.recoveryTimeHours > 0 && specificMaxEssence > 0) {
        const regenerationRatePerHour = specificMaxEssence / currentApertureGrade.recoveryTimeHours;
        const essenceToRegen = regenerationRatePerHour * hours;
        setCurrentEssencePercentage(prev => Math.min(specificMaxEssence, parseFloat((prev + essenceToRegen).toFixed(2))));
    }
    
    if (newGameTimeHours - lastExhaustionCheckTime >= 24 && newGameTimeHours - lastLongRestEndTime >= 24) {
        const conMod = calculateModifier(finalAttributes.constitution);
        const conSaveBonus = conMod + (conSavesProficiency ? currentProficiencyBonus : 0);
        const conSaveRoll = Math.floor(Math.random() * 20) + 1 + conSaveBonus;
        
        const periodsWithoutRest = Math.floor((newGameTimeHours - lastLongRestEndTime) / 24);
        const exhaustionDC = 10 + Math.max(0, periodsWithoutRest - 1) * 5;

        if (conSaveRoll < exhaustionDC) {
            setExhaustionLevel(prev => Math.min(6, prev + 1));
        }
        setLastExhaustionCheckTime(newGameTimeHours);
    }
    setGameTimeHours(newGameTimeHours);
  }, [gameTimeHours, currentApertureGrade, specificMaxEssence, finalAttributes.constitution, currentProficiencyBonus, conSavesProficiency, lastLongRestEndTime, lastExhaustionCheckTime]);

  const handleShortRest = useCallback(() => {
    passTime(1);
  }, [passTime]);

  const handleLongRest = useCallback(() => {
    if (gameTimeHours < lastLongRestEndTime + 16 && lastLongRestEndTime !== 0) {
        alert("Вы не можете получить преимущества от еще одного продолжительного отдыха так скоро.");
        return;
    }
    if (currentHp < 1) {
        alert("У персонажа должен быть хотя бы 1 хит для получения преимуществ от продолжительного отдыха.");
        return;
    }

    passTime(8);
    setCurrentHp(maxHp);
    
    const hdToRecoverFactor = armorTypeWornForSleep === 'medium' || armorTypeWornForSleep === 'heavy' ? 4 : 2;
    const hdRecovered = Math.max(1, Math.floor(maxHitDice / hdToRecoverFactor));
    setCurrentHitDice(prev => Math.min(maxHitDice, prev + hdRecovered));

    if (armorTypeWornForSleep !== 'medium' && armorTypeWornForSleep !== 'heavy') {
      setExhaustionLevel(prev => Math.max(0, prev - 1));
    }
    
    setLastLongRestEndTime(gameTimeHours + 8); 
    setLastExhaustionCheckTime(gameTimeHours + 8); 

  }, [passTime, currentHp, maxHp, maxHitDice, armorTypeWornForSleep, gameTimeHours, lastLongRestEndTime]);

  const spendHitDice = useCallback((diceToSpend: number, onHeal: (totalHealed: number, rolls: string[]) => void) => {
    if (diceToSpend <= 0 || diceToSpend > currentHitDice || currentHp >= maxHp) {
      onHeal(0, []);
      return;
    }
    let totalHealed = 0;
    const conMod = calculateModifier(finalAttributes.constitution);
    const rolls: number[] = [];
    for (let i = 0; i < diceToSpend; i++) {
      const roll = Math.floor(Math.random() * hitDieType) + 1;
      rolls.push(roll);
      totalHealed += Math.max(0, roll + conMod); 
    }
    setCurrentHp(prev => Math.min(maxHp, prev + totalHealed));
    setCurrentHitDice(prev => prev - diceToSpend);
    onHeal(totalHealed, rolls.map(String)); 
  }, [currentHitDice, currentHp, maxHp, finalAttributes.constitution, hitDieType]);

  const handleHitDieTypeChange = (newType: number) => {
    setHitDieType(newType);
  };
  
  const handleManualMaxHpModifierChange = (value: number) => {
    setManualMaxHpModifier(value);
  };

  const handleManualAcModifierChange = (value: number) => {
    setManualAcModifier(value);
  };
  
  const allItemsLookup = useMemo(() => {
    const allItems = [...AVAILABLE_STARTING_ITEMS, ...customItems];
    return new Map(allItems.map(item => [item.id, item]));
  }, [customItems]);

  const handleItemDrop = useCallback((data: { instanceId: string; source: EquipmentSlotId | 'backpack' }, targetSlot: EquipmentSlotId | 'backpack') => {
    let newEquipment = { ...equipment };
    let newBackpack = [...backpack];

    // Find and remove item from source
    let itemToMove: InventoryItem | null = null;
    if (data.source === 'backpack') {
        const itemIndex = newBackpack.findIndex(i => i.instanceId === data.instanceId);
        if (itemIndex > -1) {
            itemToMove = newBackpack[itemIndex];
            newBackpack.splice(itemIndex, 1);
        }
    } else {
        itemToMove = newEquipment[data.source] ?? null;
        newEquipment[data.source] = null;
    }

    if (!itemToMove) return;

    // --- Pre-drop validation ---
    if (selectedRace?.id === 'merman' && targetSlot === 'feet') {
        newBackpack.push(itemToMove); // Invalid: put back
        setBackpack(newBackpack);
        setEquipment(newEquipment);
        return;
    }

    const mainHandItem = newEquipment.mainHand;
    if (mainHandItem) {
        const mainHandDef = allItemsLookup.get(mainHandItem.itemId);
        const mainHandIsTwoHanded = mainHandDef?.properties?.twoHanded;
        if (mainHandIsTwoHanded && targetSlot === 'offHand') {
            newBackpack.push(itemToMove); // Invalid: put back
            setBackpack(newBackpack);
            setEquipment(newEquipment);
            return;
        }
    }

    // --- Execute drop ---
    const movedItemDef = allItemsLookup.get(itemToMove.itemId);
    const isTwoHanded = movedItemDef?.properties?.twoHanded;

    if (targetSlot === 'backpack') {
        newBackpack.push(itemToMove);
    } else {
        const existingItemInTarget = newEquipment[targetSlot];
        if (existingItemInTarget) {
            newBackpack.push(existingItemInTarget);
        }
        newEquipment[targetSlot] = itemToMove;
    }
    
    if (targetSlot === 'mainHand' && isTwoHanded) {
        const offHandItem = newEquipment.offHand;
        if (offHandItem) {
            newBackpack.push(offHandItem);
            newEquipment.offHand = null;
        }
    }

    setBackpack(newBackpack);
    setEquipment(newEquipment);
  }, [backpack, equipment, selectedRace, allItemsLookup]);

  const handleItemDelete = useCallback((instanceId: string) => {
    let itemToDeleteInstance: InventoryItem | null = null;
    let newEquipment = { ...equipment };
    let newBackpack = [...backpack];

    // Find in equipment
    for (const slot in newEquipment) {
        const s = slot as EquipmentSlotId;
        if (newEquipment[s]?.instanceId === instanceId) {
            itemToDeleteInstance = newEquipment[s]!;
            newEquipment[s] = null;
            break;
        }
    }

    // Find in backpack if not in equipment
    if (!itemToDeleteInstance) {
        const index = newBackpack.findIndex(i => i.instanceId === instanceId);
        if (index > -1) {
            itemToDeleteInstance = newBackpack[index];
            newBackpack.splice(index, 1);
        }
    }
    
    if (!itemToDeleteInstance) return; // Not found

    const itemDef = allItemsLookup.get(itemToDeleteInstance.itemId);

    // If it's a default item, remove from selectedItems
    if (itemDef && !itemDef.id.startsWith('custom-')) {
        setSelectedItems(prev => {
            const indexToRemove = prev.findIndex(item => item.id === itemDef.id);
            if (indexToRemove > -1) {
                const newSelectedItems = [...prev];
                newSelectedItems.splice(indexToRemove, 1);
                return newSelectedItems;
            }
            return prev;
        });
    }

    // If it's a custom item, remove from the customItems master list
    if (itemDef && itemDef.id.startsWith('custom-')) {
        setCustomItems(prev => prev.filter(ci => ci.id !== itemDef.id));
    }

    setEquipment(newEquipment);
    setBackpack(newBackpack);
    
  }, [equipment, backpack, allItemsLookup]);


  const handleCreateCustomItem = useCallback((itemData: Omit<StartingItem, 'id' | 'modificationPointCost'>) => {
      const newItem: StartingItem = {
          ...itemData,
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          modificationPointCost: 0,
      };
      setCustomItems(prev => [...prev, newItem]);

      const newItemInstance: InventoryItem = {
          itemId: newItem.id,
          instanceId: `inst-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      setBackpack(prev => [...prev, newItemInstance]);
      setIsAddItemModalOpen(false);
  }, []);


  useEffect(() => {
    const newDerivedStats: string[] = [];
    const dexMod = calculateModifier(finalAttributes.dexterity);
    const strMod = calculateModifier(finalAttributes.strength);
    const wisMod = calculateModifier(finalAttributes.wisdom);   
    const intMod = calculateModifier(finalAttributes.intelligence); 
    const strScore = finalAttributes.strength;

    const allCurrentEffectiveFeats = [
        ...activeFeats, 
        ...selectedFlawFeats
    ].filter((feat, index, self) => index === self.findIndex(f => f.id === feat.id));

    newDerivedStats.push(`Хитпоинты: ${currentHp} / ${maxHp}`);
    newDerivedStats.push(`Кости Хитов: ${currentHitDice} / ${maxHitDice} (d${hitDieType})`);
    if (exhaustionLevel >= 0) {
        newDerivedStats.push(`Уровень Истощения: ${exhaustionLevel}`);
    }

    // Encumbrance and Weight
    let totalWeight = 0;
    const allCarriedItems: InventoryItem[] = [
        ...Object.values(equipment).filter(Boolean) as InventoryItem[],
        ...backpack
    ];
    for (const itemInstance of allCarriedItems) {
        const itemDef = allItemsLookup.get(itemInstance.itemId);
        if (itemDef?.weight) {
            totalWeight += itemDef.weight;
        }
    }
    totalWeight = parseFloat(totalWeight.toFixed(2));
    
    const carryingCapacity = strScore * 15;
    const encumberedThreshold = strScore * 5;
    const heavilyEncumberedThreshold = strScore * 10;
    
    const isEncumbered = totalWeight > encumberedThreshold && totalWeight <= heavilyEncumberedThreshold;
    const isHeavilyEncumbered = totalWeight > heavilyEncumberedThreshold;

    newDerivedStats.push(`Грузоподъемность: ${totalWeight} / ${carryingCapacity} фунтов`);

    if (isHeavilyEncumbered) {
        newDerivedStats.push(`Состояние: Сильно перегружен (Скорость -20, помеха на Силу/Ловкость/Телосложение)`);
    } else if (isEncumbered) {
        newDerivedStats.push(`Состояние: Перегружен (Скорость -10)`);
    }

    newDerivedStats.push(`Бонус Умения: +${currentProficiencyBonus}`);
    
    // NEW ARMOR CLASS CALCULATION
    let finalAC = 0;
    const equippedArmorInstance = equipment.armor;
    const equippedArmorDef = equippedArmorInstance ? allItemsLookup.get(equippedArmorInstance.itemId) : null;

    if (equippedArmorDef && equippedArmorDef.baseArmorClass && equippedArmorDef.armorType) {
        // Character is wearing a custom item with armor properties
        let dexBonusForAC = 0;
        switch (equippedArmorDef.armorType) {
            case 'light':
                dexBonusForAC = dexMod;
                break;
            case 'medium':
                dexBonusForAC = Math.min(dexMod, 2);
                break;
            case 'heavy':
                dexBonusForAC = 0;
                break;
        }
        finalAC = equippedArmorDef.baseArmorClass + dexBonusForAC;
    } else if (equippedArmorDef?.id === 'item_leather_armor') {
        // Handle the default leather armor (equivalent to light armor with base AC 11)
        finalAC = 11 + dexMod;
    } else {
        // No armor worn, or armor worn has no AC properties
        finalAC = BASE_ARMOR_CLASS + dexMod; // Base AC 10 + dex
    }

    finalAC += manualAcModifier; // Apply manual flat modifier at the end
    
    newDerivedStats.push(`Класс Брони (КБ): ${finalAC}`);


    SAVING_THROW_KEYS.forEach(key => {
        const modifier = calculateModifier(finalAttributes[key]); 
        const isProficient = (key === 'constitution' && conSavesProficiency); 
        const totalSaveBonus = modifier + (isProficient ? currentProficiencyBonus : 0);
        newDerivedStats.push(SAVING_THROW_NAMES_RU[key] + ': ' + (totalSaveBonus >= 0 ? '+' : '') + totalSaveBonus + (isProficient ? ' (Умение)' : ''));
    });

    let initiative = dexMod;
    if (selectedTraits.find(t => t.id === 'trait_alert')) initiative += 2; 
    newDerivedStats.push(`Концептуальная Инициатива: ${initiative >= 0 ? '+' : ''}${initiative}`);

    let passivePerception = 10 + wisMod;
    if (selectedSkills.find(s => s.id === 'skill_perception')) passivePerception += currentProficiencyBonus;
    if (selectedTraits.find(t => t.id === 'trait_observant')) passivePerception += 5;
    newDerivedStats.push(`Пассивная Внимательность (концепт): ${passivePerception}`);
    
    let speed = 30;
    if (isHeavilyEncumbered) speed -= 20;
    else if (isEncumbered) speed -= 10;
    if (allCurrentEffectiveFeats.find(f => f.id === 'feat_mobile')) speed += 10;
    newDerivedStats.push(`Скорость (концепт): ${speed} футов`);

    let languages = 1 + (intMod > 0 ? intMod : 0); 
    if (selectedTraits.find(t => t.id === 'trait_linguist')) languages += 3;
    newDerivedStats.push(`Известные языки (концепт): ${languages}`);
    
    if (selectedRace && selectedRace.textualEffects) {
      selectedRace.textualEffects.forEach(effect => newDerivedStats.push(effect));
    }

    const formatMod = (mod: number) => mod >= 0 ? `+${mod}` : `${mod}`;
    
    const processWeaponForStats = (itemDef: StartingItem | null, hand: 'Осн. рука' | 'Втор. рука') => {
        if (!itemDef || !itemDef.damageDice) return;

        const isRangedWeapon = itemDef.properties?.ammunition;
        const isThrownWeapon = itemDef.properties?.thrown;
        const isFinesseWeapon = itemDef.properties?.finesse;

        if (isRangedWeapon) {
            newDerivedStats.push(`Атака (Дальнобойная, ${hand}): 1d20 ${formatMod(dexMod)} (Ловкость)`);
        } else {
            const canUseDex = isFinesseWeapon && dexMod >= strMod;
            const meleeModValue = canUseDex ? dexMod : strMod;
            const meleeModAttr = canUseDex ? 'Ловкость' : 'Сила';
            newDerivedStats.push(`Атака (Рукопашная, ${hand}): 1d20 ${formatMod(meleeModValue)} (${meleeModAttr})`);

            if (isThrownWeapon) {
                // Thrown uses the same modifier as melee for that weapon
                newDerivedStats.push(`Атака (Метание, ${hand}): 1d20 ${formatMod(meleeModValue)} (${meleeModAttr})`);
            }
        }

        if (itemDef.damageDice) {
            let damageString = `Урон (${itemDef.name}, ${hand}): ${itemDef.damageDice}`;
            if (itemDef.damageType && itemDef.damageType !== 'не указан') {
                damageString += ` ${itemDef.damageType}`;
            }
            newDerivedStats.push(damageString);
        }
        
        if (itemDef.properties) {
            const propertyStrings: string[] = [];
            for (const propKey in itemDef.properties) {
                const propDef = WEAPON_PROPERTY_DEFINITIONS.find(p => p.id === propKey);
                if (propDef) {
                    let propValueString = '';
                    const propValue = (itemDef.properties as any)[propKey];
                    if (propValue && typeof propValue !== 'boolean') {
                        if (typeof propValue === 'object' && propValue.normal !== undefined) {
                            propValueString = ` (${propValue.normal}/${propValue.max} фт.)`;
                        } else {
                            propValueString = ` (${propValue})`;
                        }
                    }
                    propertyStrings.push(`${propDef.name}${propValueString}`);
                }
            }
            if(propertyStrings.length > 0) {
                newDerivedStats.push(`Свойства (${hand}): ${propertyStrings.join(', ')}`);
            }
        }
    };

    processWeaponForStats(equipment.mainHand ? allItemsLookup.get(equipment.mainHand.itemId) : null, 'Осн. рука');
    processWeaponForStats(equipment.offHand ? allItemsLookup.get(equipment.offHand.itemId) : null, 'Втор. рука');


    AVAILABLE_SKILLS.forEach(skill => {
      const finalAttrScoreForSkill = finalAttributes[skill.relatedAttribute];
      const attrMod = calculateModifier(finalAttrScoreForSkill);
      const racialSkillMod = selectedRace?.skillModifiers?.[skill.id] || 0;
      const proficiencyBonusForSkill = selectedSkills.some(s => s.id === skill.id) ? currentProficiencyBonus : 0;
      const totalSkillMod = attrMod + racialSkillMod + proficiencyBonusForSkill;

      if (racialSkillMod !== 0 || proficiencyBonusForSkill !== 0) { 
        newDerivedStats.push(`Навык: ${skill.name}: ${totalSkillMod >= 0 ? '+' : ''}${totalSkillMod}`);
      }
    });

    setDerivedStats(newDerivedStats);
  }, [baseAttributes, finalAttributes, selectedRace, selectedTraits, selectedSkills, activeFeats, selectedFlawFeats, characterLevel, currentProficiencyBonus, currentHp, maxHp, currentHitDice, hitDieType, exhaustionLevel, conSavesProficiency, manualMaxHpModifier, manualAcModifier, equipment, backpack, customItems, allItemsLookup]);


  const currentCharacter: Character = {
    name: characterName,
    level: characterLevel,
    proficiencyBonus: currentProficiencyBonus,
    attributes: finalAttributes, 
    selectedRace,
    height,
    weight,
    eyeColor,
    hairColor,
    age,
    manualBackstory,
    selectedTraits,
    selectedItems,
    selectedSkills,
    activeFeats: [ 
        ...activeFeats, 
        ...selectedFlawFeats.filter(sf => !activeFeats.find(af => af.id === sf.id))
    ].filter((feat, index, self) => index === self.findIndex(f => f.id === feat.id)), 
    madnessEffect: selectedMadness,
    attributeBuyPoints, 
    modificationPoints,
    backstory,
    apertureGradeId: selectedApertureGradeId,
    characterRankId: selectedCharacterRankId,
    selectedEssenceStageId: selectedEssenceStageId,
    currentEssencePercentage: currentEssencePercentage,
    specificMaxEssence: specificMaxEssence,
    maxHp,
    currentHp,
    hitDieType,
    maxHitDice,
    currentHitDice,
    gameTimeHours,
    lastLongRestEndTime,
    lastExhaustionCheckTime,
    exhaustionLevel,
    armorTypeWornForSleep,
    conSavesProficiency,
    manualMaxHpModifier,
    manualAcModifier,
    equipment,
    backpack,
    customItems,
  };

  const handleSaveCharacter = () => {
    if (!selectedRace) { alert("Пожалуйста, выберите расу для вашего персонажа."); return; }
    if (attributeBuyPoints > 0) { alert('У вас осталось ' + attributeBuyPoints + ' очков для распределения характеристик.'); return; }
    if (attributeBuyPoints < 0) { alert('Вы потратили слишком много очков характеристик! Скорректируйте значения.'); return;}
    if (modificationPoints < 0) { alert('У вас дефицит в ' + Math.abs(modificationPoints) + ' Очков Модификации. Скорректируйте особенности, предметы, безумие или изъяны.'); return; }
    if (selectedSkills.length !== MAX_SKILL_PROFICIENCIES && MAX_SKILL_PROFICIENCIES > 0) { alert('Пожалуйста, выберите ровно ' + MAX_SKILL_PROFICIENCIES + ' владений навыками.'); return; }
    if (!characterName.trim()) { alert("Пожалуйста, введите имя персонажа."); return; }

    const characterToSave: CharacterSaveData = {
        name: characterName,
        level: characterLevel,
        baseAttributes: baseAttributes,
        attributeBuyPoints: attributeBuyPoints,
        modificationPoints: modificationPoints,
        selectedRaceId: selectedRace?.id,
        height: height,
        weight: weight,
        eyeColor: eyeColor,
        hairColor: hairColor,
        age: age,
        manualBackstory: manualBackstory,
        selectedTraitIds: selectedTraits.map(t => t.id),
        selectedItemIds: selectedItems.map(i => i.id),
        selectedSkillIds: selectedSkills.map(s => s.id),
        selectedFlawFeatIds: selectedFlawFeats.map(f => f.id),
        madnessEffectId: selectedMadness?.id,
        backstory: backstory,
        apertureGradeId: selectedApertureGradeId,
        characterRankId: selectedCharacterRankId,
        selectedEssenceStageId: selectedEssenceStageId,
        currentEssencePercentage: currentEssencePercentage,
        specificMaxEssence: specificMaxEssence,
        currentHp: currentHp,
        hitDieType: hitDieType,
        currentHitDice: currentHitDice,
        gameTimeHours: gameTimeHours,
        lastLongRestEndTime: lastLongRestEndTime,
        lastExhaustionCheckTime: lastExhaustionCheckTime,
        exhaustionLevel: exhaustionLevel,
        armorTypeWornForSleep: armorTypeWornForSleep,
        manualMaxHpModifier: manualMaxHpModifier,
        manualAcModifier: manualAcModifier,
        equipment: equipment,
        backpack: backpack,
        customItems: customItems,
    };

    const jsonData = JSON.stringify(characterToSave, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeCharacterName = characterName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'character';
    link.download = `${safeCharacterName}_character_RI.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // setShowSummary(true); // No longer switch to summary
  }

  const handleLoadCharacterFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/json") {
        alert("Пожалуйста, выберите действительный файл JSON.");
        if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const json = e.target?.result as string;
            const loadedData = JSON.parse(json) as any; // Use `any` for migration purposes

            // Basic validation of loaded data structure (can be expanded)
            if (!loadedData.name || !loadedData.baseAttributes || !loadedData.selectedTraitIds) {
                throw new Error("Файл персонажа имеет неверный формат.");
            }

            // MIGRATION: from 'hands' to 'hands_L'
            if (loadedData.equipment && loadedData.equipment.hands) {
                if (!loadedData.equipment.hands_L) { // Only migrate if hands_L doesn't exist
                    loadedData.equipment.hands_L = loadedData.equipment.hands;
                }
                delete loadedData.equipment.hands; // Remove old key
            }

            // Prepare data that affects useEffects before setting state
            const race = AVAILABLE_RACES.find(r => r.id === loadedData.selectedRaceId);
            const loadedFinalAttributes = calculateFinalAttributes(loadedData.baseAttributes, race);
            const newEligibleAttrs = getTopAttributeKeysForSkillSelection(loadedFinalAttributes);

            // Set all states in one batch to prevent race conditions with useEffect
            setCharacterName(loadedData.name);
            setCharacterLevel(loadedData.level);
            
            setAge(loadedData.age || '');
            setHeight(loadedData.height || '');
            setWeight(loadedData.weight || '');
            setEyeColor(loadedData.eyeColor || '');
            setHairColor(loadedData.hairColor || '');
            setManualBackstory(loadedData.manualBackstory || '');
            
            setBaseAttributes(loadedData.baseAttributes);
            setAttributeBuyPoints(loadedData.attributeBuyPoints);
            // modificationPoints will be recalculated by useEffect

            setSelectedRace(race || defaultRace);
            setEligibleAttributesForFirstSkills(newEligibleAttrs); // <-- FIX: Set eligible attributes to prevent skill reset

            setSelectedTraits(loadedData.selectedTraitIds.map((id: string) => AVAILABLE_TRAITS.find(t => t.id === id)).filter(Boolean) as Trait[]);
            setSelectedItems(loadedData.selectedItemIds.map((id: string) => AVAILABLE_STARTING_ITEMS.find(i => i.id === id)).filter(Boolean) as StartingItem[]);
            setSelectedSkills(loadedData.selectedSkillIds.map((id: string) => AVAILABLE_SKILLS.find(s => s.id === id)).filter(Boolean) as Skill[]);
            setSelectedFlawFeats(loadedData.selectedFlawFeatIds.map((id: string) => AVAILABLE_FEATS.find(f => f.id === id && f.isFlaw && f.requirements.length === 0)).filter(Boolean) as Feat[]);
            setSelectedMadness(AVAILABLE_MADNESS_EFFECTS.find(m => m.id === loadedData.madnessEffectId));
            
            setBackstory(loadedData.backstory);
            
            setEquipment(loadedData.equipment || {});
            setBackpack(loadedData.backpack || []);
            setCustomItems(loadedData.customItems || []);

            setSelectedApertureGradeId(loadedData.apertureGradeId || defaultApertureGrade.id);
            setSelectedCharacterRankId(loadedData.characterRankId || CHARACTER_RANKS[0].id);
            setSelectedEssenceStageId(loadedData.selectedEssenceStageId || ESSENCE_STAGES[0].id);
            setCurrentEssencePercentage(loadedData.currentEssencePercentage !== undefined ? loadedData.currentEssencePercentage : defaultApertureGrade.minMaxEssence);
            setSpecificMaxEssence(loadedData.specificMaxEssence !== undefined ? loadedData.specificMaxEssence : defaultApertureGrade.minMaxEssence);
            
            setHitDieType(loadedData.hitDieType || DEFAULT_HIT_DIE_TYPE);
            // maxHp, maxHitDice will be recalculated
            setCurrentHp(loadedData.currentHp);
            setCurrentHitDice(loadedData.currentHitDice);

            setGameTimeHours(loadedData.gameTimeHours || 8);
            setLastLongRestEndTime(loadedData.lastLongRestEndTime || 0);
            setLastExhaustionCheckTime(loadedData.lastExhaustionCheckTime || 0);
            setExhaustionLevel(loadedData.exhaustionLevel || 0);
            setArmorTypeWornForSleep(loadedData.armorTypeWornForSleep || 'none');
            
            setManualMaxHpModifier(loadedData.manualMaxHpModifier || 0);
            setManualAcModifier(loadedData.manualAcModifier || 0);
            
            // Allow useEffects to run and recalculate derived stats
            setShowSummary(false); // Stay on edit screen
            alert(`Персонаж "${loadedData.name}" успешно загружен.`);

        } catch (error) {
            console.error("Ошибка загрузки персонажа:", error);
            alert(`Не удалось загрузить персонажа: ${error instanceof Error ? error.message : "Неизвестная ошибка."}`);
        } finally {
            if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        }
    };
    reader.readAsText(file);
  };

  const resetCreator = () => {
    setCharacterName('Незнакомец');
    setCharacterLevel(1);
    const newDefaultRace = AVAILABLE_RACES.find(r => r.id === 'human') || (AVAILABLE_RACES.length > 0 ? AVAILABLE_RACES[0] : undefined);
    setSelectedRace(newDefaultRace);
    setBaseAttributes(initialBaseAttributes); 
    setAttributeBuyPoints(INITIAL_ATTRIBUTE_BUY_POINTS);
    
    setAge('');
    setHeight('');
    setWeight('');
    setEyeColor('');
    setHairColor('');
    setManualBackstory('');

    setSelectedTraits([]);
    setSelectedItems([]);
    setSelectedMadness(undefined);
    setSelectedSkills([]);
    setSelectedFlawFeats([]);
    setBackstory(undefined);
    
    setEquipment({});
    setBackpack([]);
    setCustomItems([]);

    const initialGrade = APERTURE_GRADES[1]; 
    setSelectedApertureGradeId(initialGrade.id);
    const initialSpecificMax = initialGrade.minMaxEssence;
    setSpecificMaxEssence(initialSpecificMax);
    setSelectedCharacterRankId(CHARACTER_RANKS[0].id);
    setSelectedEssenceStageId(ESSENCE_STAGES[0].id);
    setCurrentEssencePercentage(initialSpecificMax); 

    setHitDieType(DEFAULT_HIT_DIE_TYPE); // Reset hit die type
    setManualMaxHpModifier(0); // Reset manual HP modifier
    setManualAcModifier(0); // Reset manual AC modifier
    // MaxHP, CurrentHP, MaxHitDice, CurrentHitDice will be recalculated by useEffects
    
    setGameTimeHours(8); 
    setLastLongRestEndTime(0);
    setLastExhaustionCheckTime(0);
    setExhaustionLevel(0);
    setArmorTypeWornForSleep('none');
    setConSavesProficiency(false);

    setShowSummary(false);
    setEligibleAttributesForFirstSkills(getTopAttributeKeysForSkillSelection(calculateFinalAttributes(initialBaseAttributes, newDefaultRace)));
  }

  const madnessDropdownOptions: MadnessOption[] = [
    { id: "none", name: "Нет", description: "Без начального эффекта безумия.", type: "none", modificationPointAdjustment: 0 },
    ...AVAILABLE_MADNESS_EFFECTS
  ];
  
  const handleLevelChange = (increment: boolean) => {
    setCharacterLevel(prevLevel => {
        const newLevel = increment ? prevLevel + 1 : prevLevel -1;
        const finalNewLevel = newLevel < 1 ? 1 : newLevel;
        setMaxHitDice(finalNewLevel);
        setCurrentHitDice(prevHD => Math.min(finalNewLevel, prevHD)); 
        return finalNewLevel; 
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-4 md:p-8 flex flex-col items-center">
      {isAddItemModalOpen && (
        <AddCustomItemModal 
          onClose={() => setIsAddItemModalOpen(false)}
          onCreate={handleCreateCustomItem}
        />
      )}
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500 tracking-tight">Создание Персонажа</h1>
        <p className="text-xl text-zinc-400 mt-2">Потерянная Душа в Мире Гу</p>
      </header>

      {!showSummary ? (
        <div className="w-full max-w-6xl space-y-8">
          <SectionPanel title="Ключевые Показатели">
              {derivedStats.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 items-stretch">
                  {derivedStats.map((statString, index) => {
                    const parsed = parseDerivedStatValue(statString);
                    if (parsed.isApertureInfo) return null; 

                    const valueFontSize = parsed.isSkill || parsed.isHpInfo ? 'text-xl' : 'text-3xl';
                    const labelFontSize = 'text-xs uppercase tracking-wider font-semibold';
                    const containerClasses = parsed.isWide ? 'col-span-2 sm:col-span-full' : '';


                    return (
                      <div key={index} className={`flex flex-col items-center justify-center p-4 bg-zinc-800/70 rounded-2xl text-center h-full ${containerClasses}`}>
                        {parsed.IconComponent && <parsed.IconComponent className={`h-6 w-6 mb-2 ${parsed.iconColor}`} />}
                        {parsed.isNumeric ? (
                          <>
                            <span className={`${valueFontSize} font-bold ${parsed.valueColor}`}>{parsed.value}{parsed.suffix}</span>
                            <span className={`${labelFontSize} text-zinc-400 mt-1`}>{parsed.label}</span>
                          </>
                        ) : (
                          parsed.isHpInfo ? ( 
                              <>
                                  <span className={`${valueFontSize} font-bold ${parsed.valueColor}`}>{parsed.value}</span>
                                  <span className={`${labelFontSize} text-zinc-400 mt-1 flex items-center justify-center`}>
                                    {parsed.label} {parsed.suffix}
                                    {parsed.isHitDieInfo && (
                                      <HitDieTypeEditor
                                          currentValue={hitDieType}
                                          onChange={handleHitDieTypeChange}
                                          disabled={showSummary}
                                      />
                                    )}
                                  </span>
                              </>
                          ) : (
                              <div className="text-left w-full">
                                <span className={`text-sm text-zinc-300`}><strong className={`${parsed.iconColor} font-semibold`}>{parsed.label}:</strong> {parsed.value}</span>
                              </div>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-zinc-500 italic text-center">Рассчитываем эффекты...</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-6 pt-6 border-t border-zinc-800">
                  <div>
                      <label htmlFor="manualMaxHpMod" className="block text-sm font-medium text-zinc-400 mb-2">
                          <HeartIcon className="inline h-4 w-4 mr-1.5 text-rose-500" />
                          Ручной Модификатор Макс. ХП
                      </label>
                      <div className="flex items-center space-x-2">
                           <input
                              type="number"
                              id="manualMaxHpMod"
                              value={manualMaxHpModifier}
                              onChange={(e) => handleManualMaxHpModifierChange(parseInt(e.target.value) || 0)}
                              className="w-full text-center bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition tabular-nums"
                              disabled={showSummary}
                           />
                      </div>
                  </div>
                  <div>
                      <label htmlFor="manualAcMod" className="block text-sm font-medium text-zinc-400 mb-2">
                          <ArmorClassIcon className="inline h-4 w-4 mr-1.5 text-sky-500" />
                          Ручной Модификатор КБ
                      </label>
                       <div className="flex items-center space-x-2">
                          <input
                              type="number"
                              id="manualAcMod"
                              value={manualAcModifier}
                              onChange={(e) => handleManualAcModifierChange(parseInt(e.target.value) || 0)}
                              className="w-full text-center bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition tabular-nums"
                              disabled={showSummary}
                          />
                      </div>
                  </div>
              </div>
          </SectionPanel>

          <SectionPanel title="Уровень и Состояние Персонажа">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-300 mb-3 text-center">Уровень</h3>
                  <div className="flex items-center justify-center space-x-4">
                      <button
                          onClick={() => handleLevelChange(false)}
                          disabled={characterLevel <= 1}
                          className="p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Уменьшить уровень"
                      >
                          <MinusIcon className="w-6 h-6"/>
                      </button>
                      <span className="text-5xl font-bold text-amber-400 tabular-nums">{characterLevel}</span>
                      <button
                          onClick={() => handleLevelChange(true)}
                          className="p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-300 transition-colors"
                          aria-label="Увеличить уровень"
                      >
                          <PlusIcon className="w-6 h-6"/>
                      </button>
                  </div>
                  <p className="text-center text-sm text-zinc-400 mt-2">
                      Бонус Умения: <strong className="text-amber-300">+{currentProficiencyBonus}</strong>
                  </p>
                </div>
                <div className="border-t border-zinc-800 md:border-t-0 md:border-l md:pl-8">
                   <CharacterStatusPanel
                      character={currentCharacter}
                      onPassTime={passTime}
                      onShortRest={handleShortRest}
                      onLongRest={handleLongRest}
                      onSpendHitDice={spendHitDice}
                      onArmorTypeChange={setArmorTypeWornForSleep}
                      onCurrentHpChange={setCurrentHp}
                  />
                </div>
             </div>
         </SectionPanel>
        
        <SectionPanel title="Инвентарь и Экипировка">
            <Inventory 
                character={currentCharacter}
                equipment={equipment}
                backpack={backpack}
                onItemDrop={handleItemDrop}
                onItemDelete={handleItemDelete}
                onCreateCustomItem={() => setIsAddItemModalOpen(true)}
            />
        </SectionPanel>
        
         <SectionPanel title="Апертура и Первобытная Эссенция">
            <ApertureDisplay
                selectedGradeId={selectedApertureGradeId}
                onGradeChange={handleApertureGradeChange}
                selectedRankId={selectedCharacterRankId}
                onRankChange={handleCharacterRankChange}
                selectedStageId={selectedEssenceStageId}
                onStageChange={handleEssenceStageChange}
                currentEssencePercentage={currentEssencePercentage}
                onEssenceChange={handleEssencePercentageChange}
                specificMaxEssence={specificMaxEssence}
                onSpecificMaxEssenceChange={handleSpecificMaxEssenceChange}
            />
         </SectionPanel>


          <SectionPanel title="Личность и Происхождение">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label htmlFor="characterName" className="block text-sm font-medium text-zinc-400 mb-2">Имя Персонажа</label>
                <input
                  type="text"
                  id="characterName"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Введите имя персонажа"
                />
              </div>
              <div>
                <DropdownSelect
                  label="Раса"
                  value={selectedRace?.id || ""}
                  options={AVAILABLE_RACES}
                  onChange={handleRaceChange}
                  getOptionValue={(option: Race) => option.id}
                  getOptionLabel={(option: Race) => option.name}
                  id="race-select"
                />
              </div>
            </div>
            {selectedRace && (
              <div className="mt-4 p-4 bg-zinc-800/50 rounded-2xl">
                <h4 className="text-md font-semibold text-indigo-300 mb-1">{selectedRace.name}</h4>
                <p className="text-sm text-zinc-300 mb-3">{selectedRace.description}</p>
                <div className="space-y-2 text-xs text-zinc-400 border-t border-zinc-700 pt-3">
                  {selectedRace.hitDieInfoText && (
                      <p className="text-amber-400 font-medium">{selectedRace.hitDieInfoText}</p>
                  )}
                  {selectedRace.specialAbilities.length > 0 && (
                      <p><strong className="text-zinc-300">Способности:</strong> {selectedRace.specialAbilities.join(', ')}</p>
                  )}
                  {selectedRace.attributeModifiers && Object.keys(selectedRace.attributeModifiers).length > 0 && (
                    <p><strong className="text-zinc-300">Моды Характеристик:</strong> {Object.entries(selectedRace.attributeModifiers).map(([attr, mod]) => `${DND_ATTRIBUTE_NAMES_RU[attr as DndAttribute]}: ${mod! > 0 ? '+' : ''}${mod}`).join(', ')}</p>
                  )}
                  {selectedRace.skillModifiers && Object.keys(selectedRace.skillModifiers).length > 0 && (
                    <p><strong className="text-zinc-300">Моды Навыков:</strong> {Object.entries(selectedRace.skillModifiers).map(([skillId, mod]) => `${AVAILABLE_SKILLS.find(s => s.id === skillId)?.name || skillId}: ${mod > 0 ? '+' : ''}${mod}`).join(', ')}</p>
                  )}
                </div>
              </div>
            )}
          </SectionPanel>

          <SectionPanel title="Внешность и Предыстория">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                  <label htmlFor="characterAge" className="block text-sm font-medium text-zinc-400 mb-2">Возраст</label>
                  <input type="text" id="characterAge" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="25 лет"/>
              </div>
              <div>
                  <label htmlFor="characterHeight" className="block text-sm font-medium text-zinc-400 mb-2">Рост</label>
                  <input type="text" id="characterHeight" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="180 см"/>
              </div>
              <div>
                  <label htmlFor="characterWeight" className="block text-sm font-medium text-zinc-400 mb-2">Вес</label>
                  <input type="text" id="characterWeight" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="75 кг"/>
              </div>
              <div className="col-span-1">
                  <label htmlFor="characterEyeColor" className="block text-sm font-medium text-zinc-400 mb-2">Цвет глаз</label>
                  <input type="text" id="characterEyeColor" value={eyeColor} onChange={(e) => setEyeColor(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="Карие"/>
              </div>
              <div className="col-span-2">
                  <label htmlFor="characterHairColor" className="block text-sm font-medium text-zinc-400 mb-2">Волосы</label>
                  <input type="text" id="characterHairColor" value={hairColor} onChange={(e) => setHairColor(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="Короткие, черные"/>
              </div>
            </div>
            <div>
              <label htmlFor="manualBackstory" className="block text-sm font-medium text-zinc-400 mb-2">История (до телепортации)</label>
              <textarea
                  id="manualBackstory"
                  value={manualBackstory}
                  onChange={(e) => setManualBackstory(e.target.value)}
                  rows={6}
                  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Опишите прошлое вашего персонажа..."
              ></textarea>
            </div>
          </SectionPanel>

          <SectionPanel title="Характеристики">
            <AttributeEditor 
              attributes={baseAttributes} 
              onAttributesChange={setBaseAttributes}
              attributeBuyPoints={attributeBuyPoints}
              onAttributeBuyPointsChange={setAttributeBuyPoints}
              modificationPoints={modificationPoints}
              onModificationPointsChange={setModificationPoints} 
              racialModifiers={selectedRace?.attributeModifiers} 
            />
          </SectionPanel>
          
          <SectionPanel title="Особенности и Снаряжение">
            <p className="text-center text-sm text-zinc-400 mb-4">
                Доступные Очки Модификации: <span className={`font-bold text-lg ${modificationPoints < 0 ? 'text-rose-400' : 'text-amber-400'}`}>{modificationPoints}</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-zinc-300 mb-3">Особенности (Трейты)</h4>
                <div className="space-y-2">
                  {AVAILABLE_TRAITS.map(trait => (
                    <div key={trait.id} className="flex items-start justify-between p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors">
                      <div className="flex-grow mr-4">
                        <label htmlFor={'trait-' + trait.id} className="text-zinc-200 font-medium cursor-pointer">{trait.name}</label>
                        <p className="text-xs text-zinc-400 mt-1">{trait.description}</p>
                        <p className={`text-xs mt-1 font-semibold ${trait.modificationPointCost <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {trait.modificationPointCost < 0 ? `Дает ${trait.modificationPointCost * -1} ОМ` : `Стоимость: ${trait.modificationPointCost} ОМ`}
                        </p>
                      </div>
                      <input
                        type="checkbox" id={'trait-' + trait.id}
                        checked={selectedTraits.some(t => t.id === trait.id)}
                        onChange={() => handleToggleTrait(trait)}
                        className="form-checkbox h-5 w-5 mt-1 flex-shrink-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-zinc-300 mb-3">Стартовые Предметы</h4>
                 <div className="space-y-2">
                    {AVAILABLE_STARTING_ITEMS.map(item => (
                      <div key={item.id} className="flex items-start justify-between p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors">
                         <div className="flex-grow mr-4">
                            <label htmlFor={'item-' + item.id} className="text-zinc-200 font-medium cursor-pointer">{item.name}</label>
                            <p className="text-xs text-zinc-400 mt-1">{item.description}</p>
                            <p className={`text-xs mt-1 font-semibold ${item.modificationPointCost === 0 ? 'text-zinc-500' : 'text-amber-400'}`}>
                              Стоимость: {item.modificationPointCost} ОМ
                            </p>
                        </div>
                        <input
                          type="checkbox" id={'item-' + item.id}
                          checked={selectedItems.some(i => i.id === item.id)}
                          onChange={() => handleToggleItem(item)}
                          className="form-checkbox h-5 w-5 mt-1 flex-shrink-0"
                        />
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </SectionPanel>

          <SectionPanel title="Владение Навыками">
            <p className="text-center text-sm text-zinc-400 mb-1">
              Выберите {MAX_SKILL_PROFICIENCIES} владения навыками. Бонус умения: <strong className="text-amber-400">+{currentProficiencyBonus}</strong>
            </p>
            <p className="text-center text-sm font-semibold text-zinc-200 mb-4">
              Выбрано: <span className="text-lg text-indigo-400">{selectedSkills.length} / {MAX_SKILL_PROFICIENCIES}</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {AVAILABLE_SKILLS.map(skill => {
                const isSelected = selectedSkills.some(s => s.id === skill.id);
                let isDisabled = false;
                
                if (!isSelected) {
                    if (selectedSkills.length >= MAX_SKILL_PROFICIENCIES) {
                        isDisabled = true; 
                    } else if (selectedSkills.length < 2 && !eligibleAttributesForFirstSkills.includes(skill.relatedAttribute)) {
                        isDisabled = true;
                    }
                }
                
                return (
                    <div key={skill.id} 
                      className={`p-3 rounded-2xl transition-all duration-150 ease-in-out 
                        ${isSelected ? 'bg-indigo-600/30 ring-2 ring-indigo-500' : 'bg-zinc-800/50'}
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-zinc-700/70'}
                      `}
                      onClick={() => !isDisabled && handleToggleSkill(skill)}
                    >
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" readOnly checked={isSelected} disabled={isDisabled} className="form-checkbox h-5 w-5"/>
                        <div>
                          <span className="font-medium text-zinc-100">{skill.name}</span>
                          <p className="text-xs text-zinc-400 capitalize">{DND_ATTRIBUTE_NAMES_RU[skill.relatedAttribute]}</p>
                        </div>
                      </div>
                    </div>
                );
              })}
            </div>
            {selectedSkills.length < 2 &&
              <p className="text-xs text-zinc-500 mt-4 text-center">
                Первые два навыка должны быть основаны на ваших высших характеристиках: <strong className="text-zinc-400">{eligibleAttributesForFirstSkills.map(attr => DND_ATTRIBUTE_NAMES_RU[attr]).join(', ') || 'Н/Д'}</strong>.
              </p>
            }
          </SectionPanel>

          <SectionPanel title="Черты и Изъяны">
             <p className="text-sm text-zinc-400 text-center">
              Некоторые черты/изъяны активируются автоматически. Другие изъяны можно выбрать для получения Очков Модификации.
            </p>
            <div className="space-y-3">
              {AVAILABLE_FEATS.map(feat => {
                const isStatRequirementMet = checkFeatRequirements(feat, finalAttributes); 
                const isAutoActive = !feat.isFlaw && feat.requirements.length > 0 && isStatRequirementMet;
                const isAutoFlaw = feat.isFlaw && feat.requirements.length > 0 && isStatRequirementMet;
                const isChosenManualFlaw = feat.isFlaw && feat.requirements.length === 0 && selectedFlawFeats.some(cf => cf.id === feat.id);
                
                const isActive = isAutoActive || isAutoFlaw || isChosenManualFlaw;
                const canBeManuallyChosenFlaw = feat.isFlaw && feat.requirements.length === 0;

                return (
                  <div key={feat.id} className={`p-4 rounded-2xl transition-colors
                    ${isActive && !feat.isFlaw ? 'bg-emerald-900/40 border border-emerald-800' : ''}
                    ${isActive && feat.isFlaw ? 'bg-amber-900/40 border border-amber-800' : ''}
                    ${!isActive ? 'bg-zinc-800/50 border border-transparent' : ''}
                  `}>
                    <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                            <h5 className={`font-semibold ${isActive ? (feat.isFlaw ? 'text-amber-300' : 'text-emerald-300') : 'text-zinc-200'}`}>{feat.name}</h5>
                            <p className="text-sm text-zinc-400 mt-1">{feat.description}</p>
                            {feat.requirements.length > 0 && (
                            <p className="text-xs text-zinc-500 mt-1">
                                Требуется: {feat.requirements.map(r => 
                                    `${DND_ATTRIBUTE_NAMES_RU[r.attribute]} ${r.minValue ?? ''}${r.minValue ? '+' : ''}${r.maxValue ?? ''}${r.maxValue ? '-' : ''}`
                                ).join(', ')}
                                {!isStatRequirementMet && <span className="text-rose-500 ml-1">(Неактивно)</span>}
                            </p>
                            )}
                            {canBeManuallyChosenFlaw && feat.modificationPointAdjustment && feat.modificationPointAdjustment > 0 && (
                              <p className="text-sm mt-2 font-semibold text-emerald-400">
                                  Дает Очков Модификации: +{feat.modificationPointAdjustment}
                              </p>
                            )}
                        </div>
                        {canBeManuallyChosenFlaw && (
                          <input
                            type="checkbox" checked={isChosenManualFlaw} onChange={() => handleToggleFlawFeat(feat)}
                            className="form-checkbox h-5 w-5 mt-1 flex-shrink-0"
                            aria-label={`Выбрать изъян ${feat.name}`}
                          />
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionPanel>
          
          <SectionPanel title="Психическое Состояние">
             <DropdownSelect
                label="Начальный Эффект Безумия (Опциональный Изъян для ОМ)"
                value={selectedMadness?.id || "none"}
                options={madnessDropdownOptions}
                onChange={handleMadnessChange}
                getOptionValue={(option: MadnessOption) => option.id}
                getOptionLabel={(option: MadnessOption) => 
                  `${option.name} (${option.modificationPointAdjustment < 0 ? `+${option.modificationPointAdjustment * -1}` : '0' } ОМ)`
                }
                id="madness-select"
              />
              {selectedMadness && selectedMadness.id !== "none" && (
                <div className="p-3 bg-zinc-800/50 rounded-xl text-sm text-zinc-300">
                    <p><strong>Эффект:</strong> {selectedMadness.description}</p>
                </div>
              )}
          </SectionPanel>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <button
                onClick={handleSaveCharacter}
                className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedRace || attributeBuyPoints < 0 || modificationPoints < 0 || (selectedSkills.length !== MAX_SKILL_PROFICIENCIES && MAX_SKILL_PROFICIENCIES > 0)}
              >
                Создать и Сохранить Персонажа
            </button>
             <input type="file" ref={fileInputRef} onChange={handleLoadCharacterFile} accept=".json" style={{ display: 'none' }} />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-6 py-4 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-2xl shadow-lg transition-colors"
            >
                Загрузить Персонажа
            </button>
          </div>
          <div className="text-center">
            <button onClick={() => setShowSummary(true)} className="text-zinc-400 hover:text-zinc-200 transition-colors py-2 px-4 text-sm">Предпросмотр Итогового Листа</button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <CharacterSummary character={currentCharacter} derivedStats={derivedStats} />
          <button
            onClick={() => {
              setShowSummary(false);
              resetCreator();
            }}
            className="w-full px-6 py-4 mt-8 bg-rose-800 hover:bg-rose-700 text-white font-semibold rounded-2xl shadow-lg transition-colors"
          >
            Создать Нового Персонажа
          </button>
            <button onClick={() => setShowSummary(false)} className="w-full text-zinc-400 hover:text-zinc-200 transition-colors py-2 px-4 text-sm mt-2">
                Вернуться к Редактированию
            </button>
        </div>
      )}
      <footer className="mt-12 text-center text-sm text-zinc-600">
          
      </footer>
    </div>
  );
};

export default App;