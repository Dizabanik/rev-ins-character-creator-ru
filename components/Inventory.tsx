

import React, { useState, useCallback } from 'react';
import { EquipmentSlots, InventoryItem, StartingItem, EquipmentSlotId, Character } from '../types';
import { 
    AVAILABLE_STARTING_ITEMS, 
    EQUIPMENT_SLOT_IDS, 
    EQUIPMENT_SLOT_NAMES_RU,
    HeadSlotIcon, ChestSlotIcon, LegsSlotIcon, FeetSlotIcon, HandsSlotIcon, 
    WeaponSlotIcon, RingSlotIcon, AmuletSlotIcon, ShoulderBagIcon, 
    BackpackIcon, UnderwearSlotIcon, BraceletSlotIcon, PouchSlotIcon
} from '../constants';

interface ItemTooltipInfo {
  item: StartingItem;
  x: number;
  y: number;
}

interface InventoryProps {
  character: Character;
  equipment: EquipmentSlots;
  backpack: InventoryItem[];
  onItemDrop: (data: { instanceId: string; source: EquipmentSlotId | 'backpack' }, targetSlot: EquipmentSlotId | 'backpack') => void;
}

const CharacterBodySvg: React.FC = () => (
    <svg viewBox="0 0 150 250" className="absolute inset-0 w-full h-full object-contain text-slate-600/80" style={{ transform: 'translateY(1%)' }}>
        <g fill="currentColor" stroke="none">
            {/* Head */}
            <circle cx="75" cy="25" r="18" />
            {/* Neck */}
            <rect x="68" y="43" width="14" height="15" rx="5" />
            {/* Torso */}
            <path d="M45,58 C 45,58 40,62 40,75 L 40,140 C 40,150 45,155 55,155 L 95,155 C 105,155 110,150 110,140 L 110,75 C 110,62 105,58 105,58 L 45,58 Z" />
            {/* Shoulders */}
            <ellipse cx="45" cy="68" rx="18" ry="12" />
            <ellipse cx="105" cy="68" rx="18" ry="12" />
            {/* Arms */}
            <path d="M27,80 C 22,85 18,95 18,105 L 18,170 C 18,180 22,185 28,185 L 38,185 C 42,185 45,180 45,175 L 45,90 C 45,85 40,80 35,78 Z" />
            <path d="M123,80 C 128,85 132,95 132,105 L 132,170 C 132,180 128,185 122,185 L 112,185 C 108,185 105,180 105,175 L 105,90 C 105,85 110,80 115,78 Z" />
            {/* Legs */}
            <rect x="50" y="155" width="22" height="90" rx="10" />
            <rect x="78" y="155" width="22" height="90" rx="10" />
        </g>
    </svg>
);


const slotPositions: Record<EquipmentSlotId, string> = {
    head: 'top-[3%] left-1/2 -translate-x-1/2',
    amulet: 'top-[19%] left-[36%]',
    amulet2: 'top-[19%] right-[36%]',
    shoulder_L: 'top-[24%] left-[17%]',
    shoulder_R: 'top-[24%] right-[17%]',
    underwear: 'top-[32%] left-1/2 -translate-x-1/2',
    armor: 'top-[46%] left-1/2 -translate-x-1/2',
    legs: 'top-[68%] left-1/2 -translate-x-1/2',
    feet: 'bottom-[1%] left-1/2 -translate-x-1/2',

    offHand: 'top-[45%] left-[2%]',
    mainHand: 'top-[45%] right-[2%]',
    
    bracelet_L: 'top-[55%] left-[14%]',
    hands_L: 'top-[75%] left-[14%]',
    ring_L1: 'top-[70%] left-[2%]',
    ring_L2: 'top-[78%] left-[2%]',
    ring_L3: 'top-[86%] left-[2%]',

    bracelet_R: 'top-[55%] right-[14%]',
    hands_R: 'top-[75%] right-[14%]',
    ring_R1: 'top-[70%] right-[2%]',
    ring_R2: 'top-[78%] right-[2%]',
    ring_R3: 'top-[86%] right-[2%]',
    
    leg_weapon_L: 'top-[70%] left-[28%]',
    leg_weapon_R: 'top-[70%] right-[28%]',
    leg_pouch_L: 'top-[85%] left-[28%]',
    leg_pouch_R: 'top-[85%] right-[28%]',
};

const itemLookup = new Map(AVAILABLE_STARTING_ITEMS.map(item => [item.id, item]));

const slotIcons: Record<EquipmentSlotId, React.FC<{className?: string}>> = {
    head: HeadSlotIcon,
    armor: ChestSlotIcon,
    underwear: UnderwearSlotIcon,
    legs: LegsSlotIcon,
    feet: FeetSlotIcon,
    hands_L: HandsSlotIcon,
    hands_R: HandsSlotIcon,
    mainHand: WeaponSlotIcon,
    offHand: WeaponSlotIcon,
    shoulder_L: ShoulderBagIcon,
    shoulder_R: ShoulderBagIcon,
    amulet: AmuletSlotIcon,
    amulet2: AmuletSlotIcon,
    ring_L1: RingSlotIcon,
    ring_L2: RingSlotIcon,
    ring_L3: RingSlotIcon,
    ring_R1: RingSlotIcon,
    ring_R2: RingSlotIcon,
    ring_R3: RingSlotIcon,
    bracelet_L: BraceletSlotIcon,
    bracelet_R: BraceletSlotIcon,
    leg_weapon_L: WeaponSlotIcon,
    leg_weapon_R: WeaponSlotIcon,
    leg_pouch_L: PouchSlotIcon,
    leg_pouch_R: PouchSlotIcon,
};

const ItemTooltip: React.FC<{ tooltipInfo: ItemTooltipInfo | null }> = ({ tooltipInfo }) => {
  if (!tooltipInfo) return null;

  return (
    <div
      className="fixed z-50 p-3 bg-slate-900/90 backdrop-blur-sm border border-red-500 rounded-lg shadow-xl max-w-xs text-sm"
      style={{ left: tooltipInfo.x + 15, top: tooltipInfo.y + 15 }}
    >
      <h4 className="font-bold text-red-400">{tooltipInfo.item.name}</h4>
      <p className="text-slate-300">{tooltipInfo.item.description}</p>
    </div>
  );
};

const Inventory: React.FC<InventoryProps> = ({ character, equipment, backpack, onItemDrop }) => {
    const [tooltipInfo, setTooltipInfo] = useState<ItemTooltipInfo | null>(null);
    const [draggedItemCompatibleSlots, setDraggedItemCompatibleSlots] = useState<EquipmentSlotId[]>([]);
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, instanceId: string, source: EquipmentSlotId | 'backpack') => {
        const itemInstance = source === 'backpack' ? backpack.find(i => i.instanceId === instanceId) : equipment[source];
        const baseItem = itemInstance ? itemLookup.get(itemInstance.itemId) : undefined;
        
        setDraggedItemCompatibleSlots(baseItem?.compatibleSlots || []);
        e.dataTransfer.setData('application/json', JSON.stringify({ instanceId, source }));
        e.dataTransfer.effectAllowed = 'move';
        setTooltipInfo(null);
    };

    const handleDragEnd = () => {
        setDraggedItemCompatibleSlots([]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetSlot: EquipmentSlotId | 'backpack') => {
        e.preventDefault();
        setDraggedItemCompatibleSlots([]);
        if (character.selectedRace?.id === 'merman' && targetSlot === 'feet') {
            return; // Prevent dropping on disabled slot
        }
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data.instanceId && data.source) {
                onItemDrop(data, targetSlot);
            }
        } catch (error) {
            console.error("Failed to parse drag data", error);
        }
    };

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>, itemInstance: InventoryItem) => {
        e.preventDefault();
        const baseItem = itemLookup.get(itemInstance.itemId);
        if (baseItem) {
          setTooltipInfo({ item: baseItem, x: e.clientX, y: e.clientY });
        }
    };

    const closeTooltip = useCallback(() => {
        setTooltipInfo(null);
    }, []);

    React.useEffect(() => {
        window.addEventListener('click', closeTooltip);
        window.addEventListener('scroll', closeTooltip);
        return () => {
            window.removeEventListener('click', closeTooltip);
            window.removeEventListener('scroll', closeTooltip);
        };
    }, [closeTooltip]);

    const renderItem = (itemInstance: InventoryItem, source: EquipmentSlotId | 'backpack') => {
        const item = itemLookup.get(itemInstance.itemId);
        if (!item) return null;

        return (
            <div
                key={itemInstance.instanceId}
                draggable
                onDragStart={(e) => handleDragStart(e, itemInstance.instanceId, source)}
                onDragEnd={handleDragEnd}
                onContextMenu={(e) => handleContextMenu(e, itemInstance)}
                className="w-full h-full bg-slate-700 border-2 border-slate-500 rounded-md flex items-center justify-center cursor-move p-1 text-center text-[10px] leading-tight text-red-300 font-semibold shadow-inner hover:border-red-400 transition-colors"
                title={item.name}
            >
                {item.name}
            </div>
        );
    };

    const renderSlot = (slotId: EquipmentSlotId) => {
        const itemInstance = equipment[slotId];
        const isCompatible = draggedItemCompatibleSlots.includes(slotId);
        const SlotIcon = slotIcons[slotId];
        const isDisabled = character.selectedRace?.id === 'merman' && slotId === 'feet';

        return (
            <div
                key={slotId}
                onDragOver={isDisabled ? undefined : handleDragOver}
                onDrop={isDisabled ? undefined : (e) => handleDrop(e, slotId)}
                className={`absolute w-12 h-12 bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center transition-colors ${slotPositions[slotId]} ${
                    isCompatible && !isDisabled ? 'border-green-500 bg-green-800/30 ring-2 ring-green-400' : ''
                } ${
                    isDisabled ? 'opacity-40 cursor-not-allowed bg-red-900/50 border-red-700' : 'hover:border-red-500'
                }`}
                title={EQUIPMENT_SLOT_NAMES_RU[slotId] + (isDisabled ? ' (Заблокировано для Мерфолка)' : '')}
            >
                {itemInstance ? renderItem(itemInstance, slotId) : (
                    <SlotIcon className="w-7 h-7 text-slate-600" />
                )}
            </div>
        );
    };

  return (
    <>
      <ItemTooltip tooltipInfo={tooltipInfo} />
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Equipment Doll */}
        <div className="flex-shrink-0 w-full lg:w-[420px] h-[600px] relative mx-auto">
            <CharacterBodySvg />
            {EQUIPMENT_SLOT_IDS.map(slotId => renderSlot(slotId))}
        </div>

        {/* Backpack */}
        <div className="flex-grow">
          <h4 className="text-lg font-semibold text-red-300 mb-2 flex items-center">
            <BackpackIcon className="mr-2"/> Рюкзак
          </h4>
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'backpack')}
            className="w-full min-h-48 p-3 bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-lg flex flex-wrap gap-2 content-start"
          >
            {backpack.length > 0 ? (
                backpack.map(item => <div key={item.instanceId} className="w-12 h-12">{renderItem(item, 'backpack')}</div>)
            ) : (
                <div className="w-full text-center text-slate-500 italic p-4">
                    Рюкзак пуст. Выберите стартовые предметы, чтобы они появились здесь.
                </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventory;