

import React, { useState, useEffect, useMemo } from 'react';
import { StartingItem, EquipmentSlotId, WeaponProperties, DamageType, Rarity, ArmorType } from '../types';
import { XCircleIcon, DAMAGE_TYPES, WEAPON_PROPERTY_DEFINITIONS, RARITY_LEVELS } from '../constants';

interface AddCustomItemModalProps {
    onClose: () => void;
    onCreate: (itemData: Omit<StartingItem, 'id' | 'modificationPointCost'>) => void;
}

// Grouped item types for simpler UI
const ITEM_TYPE_GROUPS: { id: string; name: string; slots: EquipmentSlotId[] }[] = [
    { id: 'head', name: 'Голова', slots: ['head'] },
    { id: 'armor', name: 'Броня', slots: ['armor'] },
    { id: 'underwear', name: 'Одежда', slots: ['underwear'] },
    { id: 'legs', name: 'Штаны', slots: ['legs'] },
    { id: 'feet', name: 'Ступни', slots: ['feet'] },
    { id: 'amulet', name: 'Амулет', slots: ['amulet', 'amulet2'] },
    { id: 'ring', name: 'Кольцо', slots: ['ring_L1', 'ring_L2', 'ring_L3', 'ring_R1', 'ring_R2', 'ring_R3'] },
    { id: 'gloves', name: 'Перчатки', slots: ['hands_L', 'hands_R'] },
    { id: 'bracelet', name: 'Браслет', slots: ['bracelet_L', 'bracelet_R'] },
    { id: 'shoulder', name: 'Наплечник/Сумка', slots: ['shoulder_L', 'shoulder_R'] },
    { id: 'pouch', name: 'Подсумок', slots: ['leg_pouch_L', 'leg_pouch_R'] },
    { id: 'legWeapon', name: 'Оружие на ноге', slots: ['leg_weapon_L', 'leg_weapon_R'] },
    { id: 'oneHandWeapon', name: 'Оружие (в руку)', slots: ['mainHand', 'offHand'] },
];

const AddCustomItemModal: React.FC<AddCustomItemModalProps> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [weight, setWeight] = useState(0);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [rarity, setRarity] = useState<Rarity>('common');
    
    // Weapon Specific State
    const [damageDice, setDamageDice] = useState('');
    const [damageType, setDamageType] = useState<DamageType>('не указан');
    const [properties, setProperties] = useState<WeaponProperties>({});

    // Armor Specific State
    const [armorType, setArmorType] = useState<ArmorType | 'none'>('none');
    const [baseAC, setBaseAC] = useState(0);

    const compatibleSlots = useMemo(() => {
        return [...new Set(ITEM_TYPE_GROUPS.flatMap(group => selectedGroups.includes(group.id) ? group.slots : []))];
    }, [selectedGroups]);

    const isWeapon = useMemo(() => {
        return compatibleSlots.some(s => s === 'mainHand' || s === 'offHand' || s === 'leg_weapon_L' || s === 'leg_weapon_R');
    }, [compatibleSlots]);

    const isArmor = useMemo(() => {
        return compatibleSlots.includes('armor');
    }, [compatibleSlots]);

    useEffect(() => {
        if (!isWeapon) {
            setDamageDice('');
            setDamageType('не указан');
            setProperties({});
        }
    }, [isWeapon]);

    useEffect(() => {
        if (!isArmor) {
            setArmorType('none');
            setBaseAC(0);
        }
    }, [isArmor]);


    const handlePropertyChange = (prop: keyof WeaponProperties, value: any) => {
        setProperties(prev => {
            const newProps = { ...prev };
            if (value === false || value === null || value === '') {
                delete newProps[prop];
            } else {
                (newProps as any)[prop] = value;
                // Handle conflicts
                const definition = WEAPON_PROPERTY_DEFINITIONS.find(p => p.id === prop);
                if (definition?.conflicts) {
                    for (const conflict of definition.conflicts) {
                        delete newProps[conflict];
                    }
                }
            }
            return newProps;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Название предмета не может быть пустым.");
            return;
        }
        
        let finalProperties: WeaponProperties | undefined = undefined;
        if(isWeapon && Object.keys(properties).length > 0) {
            finalProperties = properties;
        }
        
        onCreate({
            name,
            description,
            weight,
            compatibleSlots,
            rarity,
            damageDice: isWeapon && damageDice ? damageDice : undefined,
            damageType: isWeapon && damageType !== 'не указан' ? damageType : undefined,
            properties: finalProperties,
            armorType: isArmor && armorType !== 'none' ? armorType : undefined,
            baseArmorClass: isArmor && baseAC > 0 ? baseAC : undefined,
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl shadow-indigo-900/20"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 transition-colors" aria-label="Закрыть">
                    <XCircleIcon className="w-8 h-8"/>
                </button>

                <h2 className="text-2xl font-bold text-zinc-100 mb-6">Создать свой предмет</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="itemName" className="block text-sm font-medium text-zinc-400 mb-2">Название предмета</label>
                        <input
                            type="text"
                            id="itemName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Например, Загадочный амулет"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="itemDesc" className="block text-sm font-medium text-zinc-400 mb-2">Описание</label>
                        <textarea
                            id="itemDesc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Опишите предмет, его вид и свойства..."
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="itemWeight" className="block text-sm font-medium text-zinc-400 mb-2">Вес (в фунтах)</label>
                            <input
                                type="number"
                                id="itemWeight"
                                value={weight}
                                onChange={(e) => setWeight(Number(e.target.value))}
                                min="0"
                                step="0.1"
                                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>
                         <div>
                            <label htmlFor="itemRarity" className="block text-sm font-medium text-zinc-400 mb-2">Редкость</label>
                            <select 
                                id="itemRarity" 
                                value={rarity} 
                                onChange={e => setRarity(e.target.value as Rarity)} 
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 appearance-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {RARITY_LEVELS.map(r => <option key={r.id} value={r.id} className="bg-zinc-900">{r.name}</option>)}
                            </select>
                        </div>
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-3">Совместимые слоты (Тип предмета)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {ITEM_TYPE_GROUPS.map(group => (
                                <div key={group.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`group-${group.id}`}
                                        checked={selectedGroups.includes(group.id)}
                                        onChange={() => setSelectedGroups(prev => prev.includes(group.id) ? prev.filter(id => id !== group.id) : [...prev, group.id])}
                                        className="form-checkbox h-5 w-5"
                                    />
                                    <label htmlFor={`group-${group.id}`} className="ml-2 text-sm text-zinc-300 cursor-pointer">
                                        {group.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {isWeapon && (
                        <div className="space-y-6 pt-6 border-t border-zinc-700">
                            <h3 className="text-lg font-semibold text-indigo-300">Свойства оружия</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="damageDice" className="block text-sm font-medium text-zinc-400 mb-2">Куб урона</label>
                                    <input type="text" id="damageDice" value={damageDice} onChange={e => setDamageDice(e.target.value)} placeholder="1d8" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3" />
                                </div>
                                <div>
                                    <label htmlFor="damageType" className="block text-sm font-medium text-zinc-400 mb-2">Тип урона</label>
                                    <select id="damageType" value={damageType} onChange={e => setDamageType(e.target.value as DamageType)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 appearance-none">
                                        {DAMAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-3">Свойства</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {WEAPON_PROPERTY_DEFINITIONS.map(prop => (
                                        <div key={prop.id} className="flex flex-col gap-2">
                                            <div className="flex items-center">
                                                <input type="checkbox" id={`prop-${prop.id}`} checked={prop.id in properties} onChange={e => handlePropertyChange(prop.id, e.target.checked ? (prop.hasValue ? (prop.hasValue === 'string' ? '' : {normal: null, max: null}) : true) : false)} className="form-checkbox h-5 w-5" />
                                                <label htmlFor={`prop-${prop.id}`} className="ml-2 text-sm text-zinc-300 cursor-pointer">{prop.name}</label>
                                            </div>
                                            {(prop.id in properties) && prop.hasValue === 'string' && (
                                                <input type="text" value={properties[prop.id] as string} onChange={e => handlePropertyChange(prop.id, e.target.value)} placeholder={prop.placeholder} className="w-full text-xs bg-zinc-700 border border-zinc-600 rounded-md p-1.5" />
                                            )}
                                            {(prop.id in properties) && prop.hasValue === 'range' && (
                                                <div className="flex gap-2 items-center">
                                                    <input type="number" value={(properties[prop.id] as any)?.normal ?? ''} onChange={e => handlePropertyChange(prop.id, { ...properties[prop.id] as object, normal: e.target.value ? Number(e.target.value) : null })} placeholder="норм" className="w-1/2 text-xs bg-zinc-700 border border-zinc-600 rounded-md p-1.5" />
                                                    <input type="number" value={(properties[prop.id] as any)?.max ?? ''} onChange={e => handlePropertyChange(prop.id, { ...properties[prop.id] as object, max: e.target.value ? Number(e.target.value) : null })} placeholder="макс" className="w-1/2 text-xs bg-zinc-700 border border-zinc-600 rounded-md p-1.5" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {isArmor && (
                        <div className="space-y-6 pt-6 border-t border-zinc-700">
                            <h3 className="text-lg font-semibold text-sky-300">Свойства брони</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="armorType" className="block text-sm font-medium text-zinc-400 mb-2">Тип доспеха</label>
                                    <select 
                                        id="armorType" 
                                        value={armorType} 
                                        onChange={e => setArmorType(e.target.value as (ArmorType | 'none'))} 
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 appearance-none focus:ring-2 focus:ring-sky-500"
                                    >
                                        <option value="none">Не доспех</option>
                                        <option value="light">Лёгкий доспех</option>
                                        <option value="medium">Средний доспех</option>
                                        <option value="heavy">Тяжёлый доспех</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="baseAC" className="block text-sm font-medium text-zinc-400 mb-2">Базовый Класс Брони (КБ)</label>
                                    <input 
                                        type="number" 
                                        id="baseAC" 
                                        value={baseAC} 
                                        onChange={e => setBaseAC(Number(e.target.value))} 
                                        placeholder="12" 
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3" 
                                    />
                                </div>
                            </div>
                            <div className="text-xs text-zinc-500 space-y-1 bg-zinc-800/50 p-3 rounded-lg">
                                <p><strong>Лёгкий:</strong> КБ + полный мод. Ловкости.</p>
                                <p><strong>Средний:</strong> КБ + мод. Ловкости (макс. +2).</p>
                                <p><strong>Тяжёлый:</strong> КБ без мода. Ловкости.</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-xl shadow-lg transition-colors">
                            Отмена
                        </button>
                        <button type="submit" className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow-lg transition-all">
                            Добавить в рюкзак
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomItemModal;