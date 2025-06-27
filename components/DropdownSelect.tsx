
import React from 'react';
import { ChevronDownIcon } from '../constants';

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
    <div>
      <label htmlFor={selectId} className="block text-sm font-medium text-zinc-400 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value as ValueType)}
          className="appearance-none w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        >
          {options.map((option) => (
            <option key={String(getOptionValue(option))} value={getOptionValue(option)} className="bg-zinc-900 text-zinc-200">
              {getOptionLabel(option)}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
          <ChevronDownIcon className="w-5 h-5"/>
        </div>
      </div>
    </div>
  );
};

export default DropdownSelect;