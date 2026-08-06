import { FaCircle, FaCircleCheck } from "react-icons/fa6";

const LABELS = ["A", "B", "C", "D", "E", "F"];

export default function OptionList({ options, selectedOptionId, onSelect }) {
  return (
    <div className="flex flex-col gap-2" role="radiogroup" aria-label="Answer options">
      {options.map((option, idx) => {
        const active = option.id === selectedOptionId;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(option.id)}
            className={`wa-option animate-pop ${active ? "wa-option-active" : ""}`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wa-bubble text-xs font-bold text-wa-teal">
              {LABELS[idx]}
            </span>
            <span className="flex-1">{option.text}</span>
            {active ? (
              <FaCircleCheck className="h-5 w-5 shrink-0 text-wa-green" />
            ) : (
              <FaCircle className="h-5 w-5 shrink-0 text-wa-border" />
            )}
          </button>
        );
      })}
    </div>
  );
}
