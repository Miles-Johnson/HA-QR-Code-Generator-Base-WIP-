"use client";

import { useMemo } from "react";
import { trpc } from "../../app/_trpc/client";
import { GenerationCard } from "./GenerationCard";

type GenerationOutput = {
  id: number;
  url: string;
  index: number;
};

export function GenerationsList() {
  const utils = trpc.useUtils();
  const { data: generations, isLoading } = trpc.generations.getAll.useQuery(
    undefined,
    {
      onSuccess(data) {
        // @ts-ignore
        for (let generation of data) {
          if (generation.id)
            utils.generations.get.setData({ id: generation.id }, generation);
        }
      },
    }
  );
  const cols = useMemo(() => {
    if (!generations) return [];
    const list: GenerationOutput[] = [];
    const cols: GenerationOutput[][] = [[], [], [], []];

    generations?.forEach((generation) => {
      // @ts-ignore
      (generation.output_urls ?? [])?.forEach((url: string, index) => {
        list.push({ id: generation.id!, url, index });
      });

      if (!generation.output_urls) {
        for (let i = 0; i < (generation.batch ?? 1); i++)
          list.push({ id: generation.id!, url: "", index: i });
      }
    });

    list.forEach((obj, index: number) => {
      if (cols[index % 4]) {
        cols[index % 4]!.push(obj);
      }
    });
    return cols;
  }, [generations]);

  return (
    <div className="mt-12">
      <div className="prose mb-4">
        <h2 className="heading-2">Your generations</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cols.map((col, index) => (
          <div key={index} className="grid gap-4">
            {/* @ts-ignore */}
            {col.map((gen: GenerationOutput) => (
              <GenerationCard
                key={gen.id}
                generation={(generations ?? []).find((g) => g.id === gen.id)!}
                imageIndex={gen.index}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
