"use client";

import { imagesRowSchema } from "@hartsy/db";
import { useMemo } from "react";
import { z } from "zod";
import { trpc } from "../../app/_trpc/client";
import { ImageCard } from "./ImageCard";

type Props = {
  userId: string;
};

export function ImagesList({ userId }: Props) {
  const { data: images } = trpc.images.getByUserId.useQuery({
    userId,
  });
  const cols = useMemo(() => {
    if (!images) return [];
    const cols: z.infer<typeof imagesRowSchema>[][] = [[], [], [], []];

    images.forEach((img, index: number) => {
      if (cols[index % 4]) {
        cols[index % 4]!.push(img);
      }
    });
    return cols;
  }, [images]);

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cols.map((col, index) => (
          <div key={index} className="grid gap-4">
            {/* @ts-ignore */}
            {col.map((img) => (
              <ImageCard key={img.id} image={img} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
