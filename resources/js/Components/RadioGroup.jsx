import React from 'react';

function RadioGroup({ label, name, options = [], selectedValue, onChange, disabled }) {
    return (
        <div className="relative mt-4">
            {label && (
                <label className={`block text-sm font-semibold mb-3
                ${disabled ? ' text-gray-400' : ' text-gray-700'} `}>
                    {label}
                </label>
            )}
            <div className="flex space-x-2">
                {options.map((option) => {
                    const isSelected = String(selectedValue) === String(option.value); // Normalize both
                    return (
                        <label
                            key={option.value}
                            className={`inline-flex items-center rounded-md px-3 py-2 text-sm transition-colors duration-200
                                    ${isSelected ? 'bg-blue-600 text-white' : 'bg-white'}
                                    ${disabled
                                    ? 'opacity-50 text-gray-400 cursor-not-allowed pointer-events-none'
                                    : 'text-gray-700 cursor-pointer'}
                            `}
                        >
                            <input
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={isSelected}
                                onChange={onChange}
                                disabled={disabled}
                                className="sr-only"
                            />
                            <span
                                className={`w-4 h-4 mr-2 rounded-full
                                    ${isSelected ? 'bg-blue-200' : 'border border-gray-400'}
                                    ${disabled ? ' text-gray-400' : ' text-gray-700'}
                                `}
                            />
                            <span className="select-none">{option.label}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}

export default RadioGroup;
