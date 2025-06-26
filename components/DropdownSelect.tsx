
import React from 'react';

interface DropdownSelectProps<OptionType, ValueType extends string | number> {
  label: string;
  value: ValueType;
  options: OptionType[];
  onChange: (value: ValueType) => void;
  getOptionValue: (option: OptionType) => ValueType;
  getOptionLabel: (option: OptionType) => string;
  id?: string;
}

const DropdownSelect = <OptionType, ValueType extends string | number>(
  { label, value, options, onChange, getOptionValue, getOptionLabel, id }: DropdownSelectProps<OptionType, ValueType>
) => {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="mb-4">
      <label htmlFor={selectId} className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value as ValueType)}
        className="w-full bg-slate-700/80 border border-slate-600 text-slate-200 rounded-md p-2 focus:ring-red-500 focus:border-red-500 transition duration-150"
      >
        {options.map((option) => (
          <option key={String(getOptionValue(option))} value={getOptionValue(option)} className="bg-slate-800 text-slate-200">
            {getOptionLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownSelect;
