

export type EquipmentSlotId = 
  'head' | 'armor' | 'legs' | 'feet' | 'hands_L' | 'hands_R' | 
  'mainHand' | 'offHand' | 'shoulder_L' | 'shoulder_R' | 'amulet' | 'amulet2' |
  'ring_L1' | 'ring_L2' | 'ring_L3' | 
  'ring_R1' | 'ring_R2' | 'ring_R3' |
  'bracelet_L' | 'bracelet_R' |
  'underwear' | 
  'leg_weapon_L' | 'leg_weapon_R' |
  'leg_pouch_L' | 'leg_pouch_R';


export interface InventoryItem {
    instanceId: string; // Уникальный ID для этого конкретного экземпляра предмета
    itemId: string;     // ID из AVAILABLE_STARTING_ITEMS, например, "item_dagger"
}

export type EquipmentSlots = Partial<Record<EquipmentSlotId, InventoryItem | null>>;


export interface Character {
  name: string;
  attributes: Attributes; // These will be the FINAL attributes after racial mods for the character object
  selectedRace?: Race;
  selectedTraits: Trait[];
  selectedItems: StartingItem[];
  selectedSkills: Skill[];
  activeFeats: Feat[];
  madnessEffect?: MadnessEffect;
  attributeBuyPoints: number; 
  modificationPoints: number; 
  level: number;
  proficiencyBonus: number; 
  backstory?: string; // AI-generated backstory
  
  // New appearance and background fields
  height: string;
  weight: string;
  eyeColor: string;
  hairColor: string;
  age: string;
  manualBackstory: string; // User-written backstory

  // Aperture related fields
  apertureGradeId?: string;
  characterRankId?: string;
  currentEssencePercentage?: number;
  selectedEssenceStageId?: EssenceStageId;
  specificMaxEssence?: number; 
  // New D&D Mechanics
  maxHp: number;
  currentHp: number;
  hitDieType: number; // e.g., 8 for d8
  maxHitDice: number;
  currentHitDice: number;
  gameTimeHours: number; // Total hours passed in game
  lastLongRestEndTime: number; // gameTimeHours when last long rest *finished*
  lastExhaustionCheckTime: number; // gameTimeHours when last exhaustion check was made
  exhaustionLevel: number; // 0-6
  armorTypeWornForSleep: ArmorTypeForSleep;
  conSavesProficiency: boolean; // For exhaustion saves
  manualMaxHpModifier: number; // Manual flat modifier to Max HP
  manualAcModifier: number; // Manual flat modifier to Armor Class
  // Inventory
  equipment: EquipmentSlots;
  backpack: InventoryItem[];
  customItems: StartingItem[];
}

export type ArmorTypeForSleep = 'none' | 'light' | 'medium' | 'heavy';

export interface Attributes {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export type DndAttribute = keyof Attributes;

export interface Race {
  id: string;
  name: string;
  description: string;
  attributeModifiers?: Partial<Attributes>; 
  skillModifiers?: { [skillId: string]: number }; 
  specialAbilities: string[];
  textualEffects?: string[]; 
  hitDieInfoText?: string; // Text to display Hit Die info, e.g., "Тип Костей Хитов: d8"
}

export interface MadnessEffect {
  id: string;
  name: string;
  description: string;
  type: 'short-term' | 'long-term' | 'indefinite';
  modificationPointAdjustment: number; 
}

export interface Trait {
  id: string;
  name: string;
  description: string;
  modificationPointCost: number; 
}

export interface StartingItem {
  id: string;
  name: string;
  description: string;
  modificationPointCost: number;
  compatibleSlots?: EquipmentSlotId[];
  weight?: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  relatedAttribute: DndAttribute;
}

export interface FeatRequirement {
  attribute: DndAttribute;
  minValue?: number; 
  maxValue?: number; 
}

export interface Feat {
  id: string;
  name: string;
  description: string;
  requirements: FeatRequirement[]; 
  modificationPointAdjustment?: number; 
  isFlaw?: boolean; 
}


// For Gemini Interaction 
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  retrievedContext?: {
    uri: string;
    title: string;
  };
}

export interface GroundingMetadata {
  searchQueries?: string[];
  groundingAttributions?: GroundingChunk[];
  groundingChunks?: GroundingChunk[];
  webSearchQueries?: string[];
}

export interface Candidate {
  content: {
    parts: { text: string }[];
    role: string;
  };
  finishReason: string;
  index: number;
  safetyRatings: any[];
  groundingMetadata?: GroundingMetadata;
}

// Aperture and Rank Info
export interface ApertureGradeInfo {
  id: string;
  name: string;
  minMaxEssence: number; 
  maxMaxEssence: number; 
  recoveryTimeHours: number; 
  description: string;
}

export type EssenceStageId = 'Initial' | 'Middle' | 'Upper' | 'Peak';

export interface EssenceStageDetail {
  id: EssenceStageId;
  name: string; 
  stageSpecificEssenceName: string; 
  color: string; 
  colorName: string; 
}

export interface CharacterRankInfoNew { 
  id: string; 
  numericRank: number; 
  name: string; 
  rankColorGroup: string; 
  condensation: string;
  stages: EssenceStageDetail[];
}

// Helper for Derived Stats Display (from constants.tsx)
export interface ParsedDerivedStat {
  label: string;
  value: string;
  suffix: string;
  IconComponent: React.FC<{ className?: string }> | null;
  valueColor: string;
  iconColor: string;
  isNumeric: boolean; 
  isSkill?: boolean; 
  isApertureInfo?: boolean; 
  isHpInfo?: boolean;
  isHitDieInfo?: boolean; 
  hitDieValue?: number;
}

// Data structure for saving/loading characters to/from JSON
export interface CharacterSaveData {
  name: string;
  level: number;
  baseAttributes: Attributes;
  attributeBuyPoints: number;
  modificationPoints: number;
  selectedRaceId?: string;
  selectedTraitIds: string[];
  selectedItemIds: string[];
  selectedSkillIds: string[];
  selectedFlawFeatIds: string[];
  madnessEffectId?: string;
  backstory?: string;
  
  height?: string;
  weight?: string;
  eyeColor?: string;
  hairColor?: string;
  age?: string;
  manualBackstory?: string;

  apertureGradeId?: string;
  characterRankId?: string;
  selectedEssenceStageId?: EssenceStageId;
  currentEssencePercentage?: number;
  specificMaxEssence?: number;
  currentHp: number;
  hitDieType: number;
  currentHitDice: number;
  gameTimeHours: number;
  lastLongRestEndTime: number;
  lastExhaustionCheckTime: number;
  exhaustionLevel: number;
  armorTypeWornForSleep: ArmorTypeForSleep;
  manualMaxHpModifier: number;
  manualAcModifier: number;
  // Inventory
  equipment: EquipmentSlots;
  backpack: InventoryItem[];
  customItems: StartingItem[];
}
