"use client";

import {
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { trpc } from "../../app/_trpc/client";
import cn from "../../lib/cn";

type Props = {
  id: number;
  index: number;
};

export function SingleCard({ id, index }: Props) {
  const utils = trpc.useUtils();
  const { data: generation } = trpc.generations.get.useQuery({ id });
  const { data: publicImages, isLoading: isLoadingPublicImages } =
    trpc.images.getByGeneration.useQuery({ id });
  const { mutateAsync: makePublic } = trpc.images.create.useMutation({
    onSuccess: () => utils.images.getByGeneration.invalidate(),
  });
  const { mutateAsync: makePrivate } = trpc.images.delete.useMutation({
    onSuccess: () => utils.images.getByGeneration.invalidate(),
  });

  const [currentIndex, setCurrentIndex] = useState(index);

  // @ts-ignore
  const images = (generation?.output_urls ?? []) as string[];
  const minIndex = 0;
  const maxIndex = images.length - 1;
  const imageIsPublic = (publicImages ?? []).includes(
    // @ts-ignore
    (i) => i.image_url === images[currentIndex]
  );

  const onCopy = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!generation?.positive) return;

      navigator.clipboard.writeText(generation?.positive);
      toast.success("Copied to clipboard");
    },
    [images, currentIndex]
  );

  const onMakePublic = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (!generation) return;
      if (!images[currentIndex]) return;

      await makePublic({
        generationId: generation.id!,
        url: images[currentIndex]!,
      });

      toast.success("This image will now appear on your public profile");
    },
    [images, generation, currentIndex]
  );

  const onMakePrivate = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!generation) return;
      if (!images[currentIndex]) return;

      const image = (publicImages ?? []).find(
        (i) => i.image_url === images[currentIndex]
      );
      if (!image) return;

      await makePrivate({
        id: image.id!,
      });

      toast.success("This image was removed from your public profile");
    },
    [images, generation, currentIndex]
  );

  return (
    <div className="flex h-full self-stretch flex-col md:flex-row md:pb-0 md:pt-0 flex-1 gap-4 w-full ">
      <div className="w-1/2 flex-shrink-0 overflow-hidden text-base flex flex-col h-auto ">
        <div className="bg-base-200 rounded-lg p-4">
          <p>{generation?.positive!}</p>
          <div className="flex gap-3 text-xs font-light mt-3">
            <button onClick={onCopy} className="btn rounded-full btn-md">
              <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
              Copy prompt
            </button>
            <a
              download={true}
              target="_blank"
              href={images[currentIndex]}
              className="btn rounded-full btn-md"
            >
              <LinkIcon className="w-4 h-4 mr-1" />
              Download
            </a>
            <button
              onClick={imageIsPublic ? onMakePrivate : onMakePublic}
              className={cn(
                "btn rounded-full btn-md",
                isLoadingPublicImages && "hidden"
              )}
            >
              {imageIsPublic && (
                <>
                  <EyeIcon className="w-4 h-4 mr-1" />
                  Public
                </>
              )}
              {!imageIsPublic && (
                <>
                  <EyeSlashIcon className="w-4 h-4 mr-1" />
                  Make Public
                </>
              )}
            </button>
          </div>
        </div>
        <div className="flex space-x-2 px-2"></div>
        <div className="md:mt-6 mt-4 ml-2 grid grid-cols-2 gap-2 md:flex flex-wrap md:flex-col md:space-x-0 md:space-y-1 h-auto pb-32 sm:pb-8">
          <div className="">
            <div className="text-xs text-black font-semibold">Model</div>
            <div className="text-sm">SDXL + {generation?.checkpoint}</div>
          </div>
          <div className="">
            <div className="text-xs text-black font-semibold">Dimensions</div>
            <div className="text-sm">
              {generation?.width} × {generation?.height}
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 md:h-full flex flex-col  relative">
        <Image
          width={500}
          height={500}
          loading="lazy"
          src={images[currentIndex]!}
          className="w-full rounded-lg"
          alt={""}
        />
        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentIndex(Math.max(minIndex, currentIndex - 1));
            }}
            className={cn(
              "btn btn-circle",
              currentIndex === minIndex && "opacity-50"
            )}
          >
            ❮
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
            }}
            className={cn(
              "btn btn-circle",
              currentIndex === maxIndex && "opacity-50"
            )}
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  );
}
