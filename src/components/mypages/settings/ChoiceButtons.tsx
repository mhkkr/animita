"use client";

export default function ChoiceButtons({
  label,
  ariaLabel,
  name,
  value,
  options,
  onChange,
}: {
  label?: string;
  ariaLabel?: string;
  name: string;
  value: string;
  options: { id: string; label: string }[];
  onChange: (id: string) => void;
}) {
  return (
    <div>
      {label && <p className="mb-1">{label}</p>}
      <div role="radiogroup" aria-label={label ?? ariaLabel} className="flex">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <label
              key={option.id}
              className={`flex-1 px-2 py-2 text-center text-xs border border-l-0 first:border-l first:rounded-l-md last:rounded-r-md border-black dark:border-stone-500 cursor-pointer focus-within:outline focus-within:outline-offset-2 ${
                selected ? "bg-annict-100 text-white" : ""
              }`}
            >
              <input
                className="sr-only"
                type="radio"
                name={name}
                value={option.id}
                checked={selected}
                onChange={() => onChange(option.id)}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}
