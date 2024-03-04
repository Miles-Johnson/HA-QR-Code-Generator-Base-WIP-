"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { trpc } from "../../app/_trpc/client";
import cn from "../../lib/cn";

export default function NameRendered() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState<number>();
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: user } = trpc.users.get.useQuery();
  const { data: templates } = trpc.templates.getAll.useQuery();
  const { data: template } = trpc.templates.get.useQuery(
    { id: templateId! },
    { enabled: !!templateId }
  );
  const { mutateAsync: queue, isLoading } =
    trpc.generations.queue.useMutation();

  useEffect(() => {
    if (templateId) return;
    if (!templates) return;

    if (templates.length > 0) {
      setTemplateId(templates?.[0]?.id!);
    }
  }, [templateId, templates]);

  const onQueue = useCallback(async () => {
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
  }, [template, name]);

  return (
    <div className={cn("rounded-xl mt-24", "bg-base-200 ")}>
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-12 lg:flex lg:items-center lg:justify-between lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Curious?
          <br />
          Try with your name for free
        </h2>
        <div className="mt-10 flex flex-col md:flex-row items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
          <div>
            <input
              type="text"
              className="input input-lg w-full rounded-full input-accent"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="dropdown dropdown-open">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="btn  btn-lg rounded-full px-6 py-3 text-base font-medium"
            >
              {!template && <>Loading...</>}
              {template && template.name}
              <ChevronDownIcon className="h-5 w-5" />
            </button>
            <ul
              className={cn(
                "dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52",
                showDropdown ? "" : "hidden"
              )}
            >
              {templates?.map((template) => (
                <li key={template.id}>
                  <button
                    onClick={() => {
                      setTemplateId(template.id!);
                      setShowDropdown(false);
                    }}
                  >
                    {template.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col">
            {!user && (
              <Link
                href="/login"
                className="btn btn-accent btn-lg rounded-full px-6 py-3 text-base font-medium"
              >
                Login & Generate
              </Link>
            )}

            {user && (
              <button
                disabled={isLoading}
                onClick={onQueue}
                className="btn btn-accent btn-lg rounded-full px-6 py-3 text-base font-medium"
              >
                {isLoading ? "Generating..." : "Generate"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
