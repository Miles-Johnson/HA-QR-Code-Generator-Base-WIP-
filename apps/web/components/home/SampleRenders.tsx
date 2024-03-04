"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { trpc } from "../../app/_trpc/client";
import cn from "../../lib/cn";

export default function SampleRenders() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState<number>();
  const { data: user } = trpc.users.get.useQuery();
  const { data: templates } = trpc.templates.getAll.useQuery();
  const { data: template } = trpc.templates.get.useQuery(
    { id: templateId! },
    { enabled: !!templateId }
  );
  const { mutateAsync: queue } = trpc.generations.queue.useMutation();
  const { data: relatedImages } = trpc.templates.getRelatedImages.useQuery(
    {
      id: templateId!,
    },
    { enabled: !!templateId }
  );

  const onQueue = useCallback(async () => {
    if (!user) return;
    if (!name) return;
    if (name.length < 3) return;

    if (!template) return;
    if (!template.positive) return;

    const positive = template.positive.replaceAll("__TEXT_REPLACE__", name);

    await queue({
      positive,
      batch: 1,
      checkpoint: template.checkpoint ?? "",
      negative: template.negative ?? "",
      templateId: template.id,
    });
    router.push(`/templates/${template.id}/new`);
  }, [name, template, user?.id]);

  return (
    <div id="examples" className="mx-auto mt-12 max-w-7xl">
      <h2 className="text-center text-gray-500">
        Some real images from users 👇
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-5">
        {(templates ?? [])
          .filter((t) => t.image_url)
          .map((template, index) => (
            <div className="dropdown" key={template.id}>
              <div tabIndex={0} role="button" className="">
                <button
                  onClick={() => setTemplateId(template.id)}
                  className="group"
                >
                  <Image
                    src={template.image_url!}
                    alt=""
                    width={192}
                    height={192}
                    loading="lazy"
                    className={cn(
                      "rounded border-8 border-white shadow-lg",
                      "group-hover:translate-y-1 group-hover:scale-105 transition-transform",
                      index % 2 === 0
                        ? " -rotate-1 md:-rotate-2"
                        : "rotate-1 md:rotate-2"
                    )}
                  />
                </button>
              </div>
              <div
                tabIndex={0}
                className={cn(
                  "dropdown-content z-[1] card card-compact rounded-md w-[100vh] p-2 shadow bg-base-100"
                )}
              >
                <div className="card-body">
                  <h3 className="card-title">{template.name}</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {(relatedImages ?? []).map((image) => (
                      <Image
                        key={image.id}
                        src={image.image_url!}
                        alt=""
                        width={192}
                        height={192}
                        loading="lazy"
                        className="rounded"
                      />
                    ))}
                  </div>
                  <div className={cn("w-full flex mt-2")}>
                    <div className={cn("flex gap-2", user ? "" : "hidden")}>
                      <input
                        type="text"
                        placeholder="Your text"
                        className="input input-sm input-bordered rounded-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <button
                        className="btn btn-sm rounded-full"
                        onClick={() => onQueue()}
                      >
                        Generate
                      </button>
                    </div>
                    <Link
                      className="btn rounded-full btn-sm ml-auto"
                      href={`/templates/${template.id}/new`}
                    >
                      Try this template
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
