"use client";

import { imagesRowSchema } from "@hartsy/db";
import Image from "next/image";
import { z } from "zod";
import cn from "../../lib/cn";

type Props = {
  image: z.infer<typeof imagesRowSchema>;
};

export function ImageCard({ image }: Props) {
  return (
    <Image
      src={image.image_url!}
      alt=""
      width={1024}
      height={768}
      loading="lazy"
      className={cn(
        "h-auto w-full max-w-full rounded-lg",
        "transition-opacity opacity-0 duration-[1s] ease-in-out"
      )}
      onLoadingComplete={(image) => {
        image.classList.remove("opacity-0");
      }}
    />
  );
}
