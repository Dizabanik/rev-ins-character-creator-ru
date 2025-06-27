
import React, { useState, useEffect } from 'react';
import { StartingItem, EquipmentSlotId } from '../types';
import { XCircleIcon } from '../constants';

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
    { id: 'oneHandWeapon', name: 'Оружие (одноручное)', slots: ['mainHand', 'offHand'] },
    { id: 'twoHandWeapon', name: 'Оружие (двуручное)', slots: ['mainHand'] },
];


const AddCustomItemModal: React.FC<AddCustomItemModalProps> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [weight, setWeight] = useState(0);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [compatibleSlots, setCompatibleSlots] = useState<EquipmentSlotId[]>([]);

    useEffect(() => {
        const newCompatibleSlots = ITEM_TYPE_GROUPS.reduce((acc, group) => {
            if (selectedGroups.includes(group.id)) {
                // For two-handed weapons, ensure one-handed isn't also selected to avoid confusion
                if (group.id === 'twoHandWeapon' && selectedGroups.includes('oneHandWeapon')) {
                    // Prioritize two-handed by removing one-handed slots if both are checked
                }
                acc.push(...group.slots);
            }
            return acc;
        }, [] as EquipmentSlotId[]);

        // Handle mutual exclusivity for weapon types
        if (selectedGroups.includes('twoHandWeapon') && selectedGroups.includes('oneHandWeapon')) {
             // If both are checked, let two-handed win. Remove offHand.
            const finalSlots = newCompatibleSlots.filter(slot => slot !== 'offHand');
            setCompatibleSlots([...new Set(finalSlots)]);
        } else {
            setCompatibleSlots([...new Set(newCompatibleSlots)]);
        }
    }, [selectedGroups]);


    const handleGroupToggle = (groupId: string) => {
        setSelectedGroups(prev =>
            prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Название предмета не может быть пустым.");
            return;
        }
        onCreate({
            name,
            description,
            weight,
            compatibleSlots,
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
                            rows={4}
                            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Опишите предмет, его вид и свойства..."
                        />
                    </div>
                    
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
                        <label className="block text-sm font-medium text-zinc-400 mb-3">Совместимые слоты (Тип предмета)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {ITEM_TYPE_GROUPS.map(group => {
                                let isChecked = selectedGroups.includes(group.id);
                                // If 'twoHandWeapon' is selected, visually uncheck 'oneHandWeapon'
                                if (group.id === 'oneHandWeapon' && selectedGroups.includes('twoHandWeapon')) {
                                    isChecked = false;
                                }
                                return (
                                <div key={group.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`group-${group.id}`}
                                        checked={isChecked}
                                        onChange={() => handleGroupToggle(group.id)}
                                        className="form-checkbox h-5 w-5"
                                    />
                                    <label htmlFor={`group-${group.id}`} className="ml-2 text-sm text-zinc-300 cursor-pointer">
                                        {group.name}
                                    </label>
                                </div>
                            )})}
                        </div>
                         <p className="text-xs text-zinc-500 mt-2">Примечание: Двуручное оружие занимает основную руку, блокируя вторую. При выборе "двуручного" оно имеет приоритет над "одноручным".</p>
                    </div>
                    
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