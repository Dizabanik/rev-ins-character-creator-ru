
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { EquipmentSlots, InventoryItem, StartingItem, EquipmentSlotId, WeaponProperties, Character, Rarity, ArmorType } from '../types';
import { 
    AVAILABLE_STARTING_ITEMS, 
    EQUIPMENT_SLOT_IDS, 
    EQUIPMENT_SLOT_NAMES_RU,
    HeadSlotIcon, ChestSlotIcon, LegsSlotIcon, FeetSlotIcon, HandsSlotIcon, 
    WeaponSlotIcon, RingSlotIcon, AmuletSlotIcon, ShoulderBagIcon, 
    BackpackIcon, UnderwearSlotIcon, BraceletSlotIcon, PouchSlotIcon, PlusIcon,
    WEAPON_PROPERTY_DEFINITIONS, WeaponPropertyDefinition, RARITY_COLORS, ArmorClassIcon
} from '../constants';

interface ItemTooltipInfo {
  item: StartingItem;
  instanceId: string;
  x: number;
  y: number;
}

interface InventoryProps {
  character: Character;
  equipment: EquipmentSlots;
  backpack: InventoryItem[];
  onItemDrop: (data: { instanceId: string; source: EquipmentSlotId | 'backpack' }, targetSlot: EquipmentSlotId | 'backpack') => void;
  onItemDelete: (instanceId: string) => void;
  onCreateCustomItem: () => void;
}

const CharacterBodySvg: React.FC = () => (
    <svg viewBox="0 0 150 250" className="absolute inset-0 w-full h-full object-contain text-zinc-800" style={{ transform: 'translateY(1%)' }}>
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
    amulet: 'top-[19%] left-[36%] -translate-x-1/2',
    amulet2: 'top-[19%] right-[36%] translate-x-1/2',
    shoulder_L: 'top-[24%] left-[17%] -translate-x-1/2',
    shoulder_R: 'top-[24%] right-[17%] translate-x-1/2',
    underwear: 'top-[32%] left-1/2 -translate-x-1/2',
    armor: 'top-[46%] left-1/2 -translate-x-1/2',
    legs: 'top-[68%] left-1/2 -translate-x-1/2',
    feet: 'bottom-[1%] left-1/2 -translate-x-1/2',

    offHand: 'top-[45%] left-[2%]',
    mainHand: 'top-[45%] right-[2%]',
    
    bracelet_L: 'top-[70%] left-[12%]',
    bracelet_R: 'top-[70%] right-[12%]',
    hands_L: 'top-[78%] left-[8%]',
    hands_R: 'top-[78%] right-[8%]',
    ring_L1: 'top-[38%] left-[12%]',
    ring_L2: 'top-[48%] left-[12%]',
    ring_L3: 'top-[58%] left-[12%]',
    ring_R1: 'top-[38%] right-[12%]',
    ring_R2: 'top-[48%] right-[12%]',
    ring_R3: 'top-[58%] right-[12%]',
    leg_weapon_L: 'top-[65%] left-[25%]',
    leg_weapon_R: 'top-[65%] right-[25%]',
    leg_pouch_L: 'top-[78%] left-[26%]',
    leg_pouch_R: 'top-[78%] right-[26%]',
};

const slotIcons: Record<EquipmentSlotId, React.FC<{ className?: string }>> = {
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

const getRarityClasses = (rarity: Rarity) => {
    return RARITY_COLORS[rarity] || RARITY_COLORS.common;
};

const ARMOR_TYPE_NAMES: Record<ArmorType, string> = {
    light: 'Лёгкий',
    medium: 'Средний',
    heavy: 'Тяжёлый'
};

const ItemTooltip: React.FC<{ info: ItemTooltipInfo | null }> = ({ info }) => {
    if (!info) return null;
    const { item, x, y } = info;
    const rarityClasses = getRarityClasses(item.rarity || 'common');
    
    return (
        <div 
            className={`fixed p-4 rounded-xl shadow-lg border backdrop-blur-sm max-w-xs z-50 pointer-events-none ${rarityClasses.bg} ${rarityClasses.border}`}
            style={{ left: x + 15, top: y + 15 }}
        >
            <h3 className={`font-bold text-lg ${rarityClasses.text}`}>{item.name}</h3>
            {item.description && <p className="text-sm text-zinc-300 mt-2">{item.description}</p>}
            
            {(item.baseArmorClass != null || item.armorType) && (
                <div className="mt-3 pt-3 border-t border-zinc-600/50 space-y-1 text-sm">
                    {item.baseArmorClass != null && <p><strong className="text-zinc-400">Базовый КБ:</strong> {item.baseArmorClass}</p>}
                    {item.armorType && <p><strong className="text-zinc-400">Тип:</strong> {ARMOR_TYPE_NAMES[item.armorType]}</p>}
                </div>
            )}

            {(item.damageDice || item.properties) && (
                 <div className="mt-3 pt-3 border-t border-zinc-600/50 space-y-1 text-sm">
                    {item.damageDice && <p><strong className="text-zinc-400">Урон:</strong> {item.damageDice} {item.damageType}</p>}
                    {item.properties && (
                         <p><strong className="text-zinc-400">Свойства:</strong> {Object.entries(item.properties).map(([key, value]) => {
                            const def = WEAPON_PROPERTY_DEFINITIONS.find(p => p.id === key);
                            if (!def) return null;
                            if (typeof value === 'boolean') return def.name;
                            if (typeof value === 'object' && value.normal) return `${def.name} (${value.normal}/${value.max})`;
                            return `${def.name} (${value})`;
                         }).filter(Boolean).join(', ')}</p>
                    )}
                 </div>
            )}
            <div className="mt-3 pt-3 border-t border-zinc-600/50 flex justify-between items-center text-xs">
                 <span className={`${rarityClasses.text} font-semibold capitalize`}>{item.rarity}</span>
                 {item.weight != null && <span className="text-zinc-400">Вес: {item.weight}</span>}
            </div>
        </div>
    );
};


interface EquipmentSlotProps {
    slotId: EquipmentSlotId;
    itemInstance: InventoryItem | null;
    allItemsLookup: Map<string, StartingItem>;
    isDropTarget: boolean;
    isCompatible?: boolean;
    onDragStart: (e: React.DragEvent, instanceId: string, itemId: string, source: EquipmentSlotId) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, targetSlot: EquipmentSlotId) => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onMouseEnter: (e: React.MouseEvent, item: StartingItem, instanceId: string) => void;
    onMouseLeave: () => void;
    onContextMenu: (e: React.MouseEvent, instanceId: string) => void;
    isDisabled?: boolean;
}

const EquipmentSlot: React.FC<EquipmentSlotProps> = ({ slotId, itemInstance, allItemsLookup, isDropTarget, isCompatible, onDragStart, onDragOver, onDrop, onDragEnter, onDragLeave, onMouseEnter, onMouseLeave, onContextMenu, isDisabled }) => {
    const itemDef = itemInstance ? allItemsLookup.get(itemInstance.itemId) : null;
    const SlotIcon = slotIcons[slotId];
    const rarityClasses = itemDef ? getRarityClasses(itemDef.rarity || 'common') : getRarityClasses('common');

    const canEquip = !itemDef || !itemDef.compatibleSlots || itemDef.compatibleSlots.includes(slotId);

    const slotStyleClasses = `
        absolute w-14 h-14 bg-zinc-800/60 border-2 rounded-xl flex items-center justify-center transition-all duration-200
        ${slotPositions[slotId]}
        ${isDisabled 
            ? 'opacity-50 cursor-not-allowed bg-rose-900/40 border-rose-700/80' 
            : (isDropTarget 
                ? 'border-green-500 scale-110 bg-green-900/50' 
                : (isCompatible 
                    ? 'border-sky-500/50 shadow-lg shadow-sky-500/40' 
                    : (canEquip ? 'border-zinc-700 hover:border-zinc-500' : 'border-rose-700')))}
        ${itemDef && !isDisabled ? `${rarityClasses.border} ${rarityClasses.bg}` : ''}`;
    
    return (
        <div 
            className={slotStyleClasses}
            onDragOver={isDisabled ? undefined : onDragOver}
            onDrop={isDisabled ? undefined : (e => onDrop(e, slotId))}
            onDragEnter={isDisabled ? undefined : onDragEnter}
            onDragLeave={isDisabled ? undefined : onDragLeave}
        >
            {itemDef && itemInstance ? (
                <div
                    draggable={!isDisabled}
                    onDragStart={isDisabled ? undefined : (e) => onDragStart(e, itemInstance.instanceId, itemDef.id, slotId)}
                    className="w-full h-full p-1 cursor-grab active:cursor-grabbing flex items-center justify-center"
                    onMouseEnter={isDisabled ? undefined : (e) => onMouseEnter(e, itemDef, itemInstance.instanceId)}
                    onMouseLeave={isDisabled ? undefined : onMouseLeave}
                    onContextMenu={isDisabled ? undefined : e => onContextMenu(e, itemInstance.instanceId)}
                >
                     <p className={`text-xs text-center leading-tight font-semibold px-1 ${isDisabled ? 'text-rose-300/70' : rarityClasses.text}`}>{itemDef.name}</p>
                </div>
            ) : (
                <SlotIcon className={`w-8 h-8 ${isDisabled ? 'text-rose-400/50' : 'text-zinc-600'}`} />
            )}
             <span className="absolute -bottom-5 text-[10px] text-zinc-500 whitespace-nowrap">{EQUIPMENT_SLOT_NAMES_RU[slotId]}</span>
        </div>
    );
};

const Inventory: React.FC<InventoryProps> = ({ character, equipment, backpack, onItemDrop, onItemDelete, onCreateCustomItem }) => {
    const [draggedItem, setDraggedItem] = useState<{ instanceId: string; itemId: string; source: EquipmentSlotId | 'backpack' } | null>(null);
    const [dropTarget, setDropTarget] = useState<EquipmentSlotId | 'backpack' | null>(null);
    const [tooltip, setTooltip] = useState<ItemTooltipInfo | null>(null);
    const [contextMenu, setContextMenu] = useState<{ instanceId: string, x: number, y: number } | null>(null);
    
    const allItemsLookup = useMemo(() => {
        const allItems = [...AVAILABLE_STARTING_ITEMS, ...character.customItems];
        return new Map(allItems.map(item => [item.id, item]));
    }, [character.customItems]);

    const mainHandItemInstance = equipment.mainHand;
    const mainHandItemDef = mainHandItemInstance ? allItemsLookup.get(mainHandItemInstance.itemId) : null;
    const mainHandIsTwoHanded = mainHandItemDef?.properties?.twoHanded ?? false;


    const handleDragStart = useCallback((e: React.DragEvent, instanceId: string, itemId: string, source: EquipmentSlotId | 'backpack') => {
        const itemData = { instanceId, itemId, source };
        e.dataTransfer.setData('application/json', JSON.stringify(itemData));
        e.dataTransfer.effectAllowed = 'move';
        setDraggedItem(itemData);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);
    
    const handleDrop = useCallback((e: React.DragEvent, targetSlot: EquipmentSlotId | 'backpack') => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        onItemDrop(data, targetSlot);
        setDraggedItem(null);
        setDropTarget(null);
    }, [onItemDrop]);

    const handleDragEnd = useCallback(() => {
        setDraggedItem(null);
        setDropTarget(null);
    }, []);

    const handleMouseEnter = useCallback((e: React.MouseEvent, item: StartingItem, instanceId: string) => {
        setTooltip({ item, instanceId, x: e.clientX, y: e.clientY });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTooltip(null);
    }, []);
    
    const handleContextMenu = useCallback((e: React.MouseEvent, instanceId: string) => {
        e.preventDefault();
        setContextMenu({ instanceId, x: e.clientX, y: e.clientY });
    }, []);

    const closeContextMenu = useCallback(() => setContextMenu(null), []);

    React.useEffect(() => {
        if(contextMenu) {
            document.addEventListener('click', closeContextMenu);
            return () => document.removeEventListener('click', closeContextMenu);
        }
    }, [contextMenu, closeContextMenu]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" onDragEnd={handleDragEnd}>
            <ItemTooltip info={tooltip} />
            {contextMenu && (
                <div 
                    className="fixed bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 py-2"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                    <button 
                        onClick={() => { onItemDelete(contextMenu.instanceId); closeContextMenu(); }} 
                        className="block w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10"
                    >
                        Выбросить предмет
                    </button>
                </div>
            )}
            {/* Equipment Side */}
            <div className="lg:col-span-2 bg-zinc-950/30 p-4 rounded-3xl min-h-[40rem] relative">
                <CharacterBodySvg />
                {EQUIPMENT_SLOT_IDS.map(slotId => {
                    const draggedItemDef = draggedItem ? allItemsLookup.get(draggedItem.itemId) : null;
                    let isCompatible = false;
                    if (draggedItemDef) {
                        isCompatible = draggedItemDef.compatibleSlots?.includes(slotId) ?? false;
                    }
                    const isDisabled = (character.selectedRace?.id === 'merman' && slotId === 'feet') ||
                                     (slotId === 'offHand' && mainHandIsTwoHanded);

                    return (
                        <EquipmentSlot
                            key={slotId}
                            slotId={slotId}
                            itemInstance={equipment[slotId] ?? null}
                            allItemsLookup={allItemsLookup}
                            isDropTarget={dropTarget === slotId}
                            isCompatible={isCompatible}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onDragEnter={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDropTarget(slotId);
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDropTarget(null);
                            }}
                            onMouseEnter={(e, item, instanceId) => {
                                setTooltip({ item, instanceId, x: e.clientX, y: e.clientY });
                            }}
                            onMouseLeave={handleMouseLeave}
                            onContextMenu={handleContextMenu}
                            isDisabled={isDisabled}
                        />
                    );
                })}
            </div>

            {/* Backpack Side */}
            <div 
                className={`p-4 bg-zinc-900/50 rounded-3xl border-2 ${dropTarget === 'backpack' ? 'border-green-500' : 'border-transparent'} transition-colors`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'backpack')}
                onDragEnter={() => setDropTarget('backpack')}
                onDragLeave={() => setDropTarget(null)}
            >
                <h3 className="text-xl font-semibold text-zinc-300 mb-4 flex items-center"><BackpackIcon className="mr-2"/> Рюкзак</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3">
                    {backpack.map(itemInstance => {
                        const itemDef = allItemsLookup.get(itemInstance.itemId);
                        if (!itemDef) return null;
                        const rarityClasses = getRarityClasses(itemDef.rarity || 'common');
                        
                        return (
                            <div 
                                key={itemInstance.instanceId}
                                draggable
                                onDragStart={(e) => handleDragStart(e, itemInstance.instanceId, itemDef.id, 'backpack')}
                                onMouseEnter={(e) => handleMouseEnter(e, itemDef, itemInstance.instanceId)}
                                onMouseLeave={handleMouseLeave}
                                onContextMenu={(e) => handleContextMenu(e, itemInstance.instanceId)}
                                className={`aspect-square p-2 border rounded-lg flex flex-col justify-center items-center cursor-grab active:cursor-grabbing text-center transition-shadow ${rarityClasses.bg} ${rarityClasses.border} hover:shadow-lg`}
                            >
                                <p className={`text-xs font-semibold leading-tight ${rarityClasses.text}`}>{itemDef.name}</p>
                            </div>
                        );
                    })}
                     <button
                        onClick={onCreateCustomItem}
                        className="aspect-square border-2 border-dashed border-zinc-700 hover:border-indigo-500 hover:bg-indigo-900/30 text-zinc-600 hover:text-indigo-400 rounded-lg flex flex-col justify-center items-center transition-colors"
                        aria-label="Добавить новый предмет"
                    >
                        <PlusIcon className="w-8 h-8" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
