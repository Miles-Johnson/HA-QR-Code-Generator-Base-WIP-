"use client";

import Link from "next/link";
import { trpc } from "../../app/_trpc/client";
import { TemplateCard } from "./TemplateCard";

type Props = {};

export function ListTemplates() {
  const { data: templates } = trpc.templates.getAll.useQuery();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link
        href={`/templates/new`}
        className="flex flex-col items-center bg-base-200 border border-base-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-base-300"
      >
        <img
          className="object-cover w-full bg-base-300 rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
          src={""}
          alt=""
        />
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
            Custom
          </h5>
          <p className="mb-3 font-normal text-gray-700 ">
            You are in control of the design and all options.
          </p>
        </div>
      </Link>

      {(templates ?? []).map((template) => (
        // @ts-ignore
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
