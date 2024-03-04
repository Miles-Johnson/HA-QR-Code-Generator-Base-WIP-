"use client";

import { generationsRowSchema } from "@hartsy/db";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { z } from "zod";
import { trpc } from "../../app/_trpc/client";
import cn from "../../lib/cn";

type Props = {
  generation: z.infer<typeof generationsRowSchema>;
  imageIndex: number;
};

export function GenerationCard({ generation, imageIndex }: Props) {
  const imageUrl =
    generation.output_urls?.[imageIndex as keyof typeof generation.output_urls];
  const utils = trpc.useUtils();
  const { mutateAsync: download } = trpc.generations.download.useMutation();
  const { data: status } = trpc.generations.getStatus.useQuery(
    { id: generation.id! },
    {
      enabled: !imageUrl,
    }
  );

  useEffect(() => {
    const func = async () => {
      if (status?.status === "completed") {
        await download({ id: generation.id! });
        utils.generations.getAll.invalidate();
      }
    };
    func();
  }, [status]);
  return (
    <Link
      href={`/generations/${generation.id}?index=${imageIndex ?? 0}`}
      className={cn(
        "flex w-full bg-base-200 rounded-lg",
        !imageUrl && "animate-pulse aspect-video"
      )}
    >
      {imageUrl && (
        <Image
          src={imageUrl!}
          alt=""
          width={300}
          height={300}
          loading="lazy"
          className={cn(
            "h-auto w-full max-w-full rounded-lg",
            "transition-opacity opacity-0 duration-[1s] ease-in-out"
          )}
          onLoadingComplete={(image) => {
            image.classList.remove("opacity-0");
          }}
        />
      )}
      {status?.status === "queued" && (
        <div className="flex items-center justify-center w-full">
          Queued (#{(status?.position ?? 0) + 1})
        </div>
      )}
      {status?.status === "running" && (
        <div className="flex items-center justify-center w-full">Rendering</div>
      )}
    </Link>
  );
}
