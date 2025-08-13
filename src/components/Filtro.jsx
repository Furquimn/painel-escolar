import React from "react";

export default function SelectFilter({ value, onChange, options = [], label = "" }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      {label ? <span className="font-medium text-gray-700">{label}</span> : null}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border border-gray-300 rounded px-3 py-1.5 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
