"use client";

import { useEffect, useState } from "react";
import cn from "../../lib/cn";

const sizes = [
  [1728, 576],
  [1664, 576],
  [1600, 640],
  [1536, 640],
  [1472, 704],
  [1408, 704],
  [1344, 704],
  [1344, 764],
  [1280, 768],
  [1216, 832],
  [1152, 832],
  [1152, 896],
  [1088, 896],
  [1088, 960],
  [1024, 960],
  [1024, 1024],
  [960, 1024],
  [960, 1088],
  [896, 1088],
  [896, 1152],
  [832, 1152],
  [832, 1216],
  [768, 1280],
  [768, 1344],
  [704, 1344],
  [704, 1408],
  [704, 1472],
  [640, 1536],
  [640, 1600],
  [576, 1664],
  [576, 1728],
];

type Props = {
  value: [number, number];
  onChange: (width: number, height: number) => void;
};

export function AspectRationButton({ value, onChange }: Props) {
  const [showAspectRation, setShowAspectRation] = useState(false);
  const [index, setIndex] = useState(Math.floor(sizes.length / 2));

  useEffect(() => {
    const ii = sizes.findIndex(
      (size) => size[0] === value[0] && size[1] === value[1]
    );
    if (ii === -1) return;

    setIndex(ii);
  }, [value]);

  useEffect(() => {
    const [width, height] = sizes[index] ?? [0, 0];
    if (width && height) onChange(width, height);
  }, [index, onChange]);

  if (index === -1) return null;
  if (!sizes[index]) return null;

  return (
    <div className="flex gap-3 bg-base-300 rounded-full px-5 py-2 relative items-center">
      <div className="text-lg font-bold">Dimension</div>
      <div className="flex gap-2">
        <input
          onChange={(e) => {
            const index = parseInt(e.target.value);
            setIndex(index);
            if (index === -1) return;
            // if (sizes[index]) onChange(sizes[index]);
          }}
          onMouseEnter={() => setShowAspectRation(true)}
          onMouseLeave={() => setShowAspectRation(false)}
          type="range"
          min={0}
          max={sizes.length - 1}
          value={index}
          className="range range-xs"
          step={1}
        />
      </div>
      <span className="text-sm font-bold min-w-[80px] text-right">
        {sizes?.[index]?.[0]}x{sizes?.[index]?.[1]}
      </span>
      {
        <div
          className={cn(
            "relative flex justify-center items-center rounded-sm shadow-md bg-base-300 text-base-100 p-4 border-1 border-base-200 transition-opacity duration-300",
            "absolute left-1/2 top-14 text-center",
            showAspectRation ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          style={{
            width: Math.round((sizes?.[index]?.[0] ?? 1) / 10),
            height: Math.round((sizes?.[index]?.[1] ?? 1) / 10),
          }}
        >
          <span className="text-black text-xs  text-center w-full">
            {sizes?.[index]?.[0]}x{sizes?.[index]?.[1]}
          </span>
          <div className="absolute top-2 left-2 w-3 h-3 border border-black border-r-0 border-b-0"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border border-black border-l-0 border-b-0"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border border-black border-t-0 border-r-0"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border border-black border-t-0 border-l-0"></div>
        </div>
      }
    </div>
  );
}
