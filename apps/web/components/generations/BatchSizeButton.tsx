"use client";

type Props = {
  max: number;
  value: number;
  onChange: (value: number) => void;
};

export function BatchSizeButton({ max, value, onChange }: Props) {
  return (
    <div className="flex gap-3 bg-base-300 rounded-full px-5 py-2">
      <div className="text-lg font-bold">Batch</div>
      <div className="flex gap-2">
        <button
          className="btn btn-sm btn-circle"
          onClick={() => onChange(Math.max(1, value - 1))}
        >
          -
        </button>
        <span className="text-lg font-bold">{value}</span>
        <button
          className="btn btn-sm btn-circle"
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}
