"use client";

import { templatesRowSchema } from "@hartsy/db";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

type Props = {
  template: z.infer<typeof templatesRowSchema>;
};

export function TemplateCard({ template }: Props) {
  return (
    <Link
      href={`/templates/${template.id}/new`}
      className="flex flex-col items-center bg-base-200 border border-base-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-base-300"
    >
      {template.image_url && (
        <Image
          className="object-cover w-full bg-base-200 rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
          src={template.image_url!}
          width={192}
          height={192}
          alt=""
        />
      )}
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
          {template.name}
        </h5>
        <p className="mb-3 font-normal text-gray-700 ">
          {template.description}
        </p>
      </div>
    </Link>
  );
}
