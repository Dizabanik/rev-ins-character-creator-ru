
import React from 'react';
import { PencilSquareIcon } from '../constants';

interface HitDieTypeEditorProps {
  currentValue: number;
  onChange: (newType: number) => void;
  disabled?: boolean;
}

const VALID_HIT_DIE_TYPES = [4, 6, 8, 10, 12];

const HitDieTypeEditor: React.FC<HitDieTypeEditorProps> = ({ currentValue, onChange, disabled }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(currentValue);

  React.useEffect(() => {
    setSelectedValue(currentValue); 
  }, [currentValue]);

  const handleSave = () => {
    onChange(selectedValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSelectedValue(currentValue);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="inline-flex items-center space-x-1 ml-1 align-middle">
        <select
          value={selectedValue}
          onChange={(e) => setSelectedValue(Number(e.target.value))}
          className="bg-slate-600 text-xs p-0.5 rounded border border-slate-500 focus:ring-red-500 focus:border-red-500 h-5"
          disabled={disabled}
          aria-label="Изменить тип кости хитов"
        >
          {VALID_HIT_DIE_TYPES.map(type => (
            <option key={type} value={type}>d{type}</option>
          ))}
        </select>
        <button 
            onClick={handleSave} 
            className="text-green-400 hover:text-green-300 text-xs p-0.5 disabled:text-slate-500 disabled:cursor-not-allowed" 
            disabled={disabled}
            aria-label="Сохранить тип кости хитов"
        >
            ✓
        </button>
        <button 
            onClick={handleCancel} 
            className="text-slate-400 hover:text-slate-300 text-xs p-0.5 disabled:text-slate-500 disabled:cursor-not-allowed" 
            disabled={disabled}
            aria-label="Отменить изменение типа кости хитов"
        >
            ✕
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setIsEditing(true)} 
      className="ml-1.5 text-sky-400 hover:text-sky-300 disabled:text-slate-500 disabled:cursor-not-allowed"
      title="Изменить тип кости хитов"
      disabled={disabled}
      aria-label="Редактировать тип кости хитов"
    >
      <PencilSquareIcon className="w-3 h-3 inline align-baseline" />
    </button>
  );
};

export default HitDieTypeEditor;
