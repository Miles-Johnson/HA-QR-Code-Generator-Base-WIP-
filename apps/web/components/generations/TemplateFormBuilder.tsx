import { useCallback, useState } from "react";
import { trpc } from "../../app/_trpc/client";
import cn from "../../lib/cn";
import { TemplateCard } from "../templates/TemplateCard";
import { AspectRationButton } from "./AspectRationButton";
import { BatchSizeButton } from "./BatchSizeButton";

type Props = {
  templateId: number;
};

export default function TemplateFormBuilder({ templateId }: Props) {
  const [batch, setBatch] = useState(1);
  const [text, setText] = useState("");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(768);

  const utils = trpc.useUtils();
  const { data: user } = trpc.users.get.useQuery();
  const { data: sub } = trpc.subs.getCurrentPlan.useQuery();
  const { data: template } = trpc.templates.get.useQuery(
    { id: templateId! },
    { enabled: !!templateId }
  );
  const { mutate: createGeneration } = trpc.generations.queue.useMutation({
    onSuccess: () => {
      utils.generations.getAll.invalidate();
      utils.subs.getCurrentPlan.invalidate();
    },
  });

  const onQueueClick = useCallback(
    async () => {
      if (!user) return;
      if (!template) return;

      const positive = template.positive.replaceAll("__TEXT_REPLACE__", text);

      await createGeneration({
        positive,
        batch,
        checkpoint: template.checkpoint,
        negative: template.negative,
        priority: sub?.priority,
        width,
        height,
        templateId: template.id,
      });
    },
    [user, template, width, height, text, sub, batch, text] as const
  );

  const canQueue =
    !!user && !!text && (sub?.limit ?? 0) - (sub?.usage ?? 0) > 0;

  return (
    <div className="">
      <div className="grid gap-4 gap-y-4 grid-cols-2">
        <div>
          <div className="">
            <label
              htmlFor="text"
              className="block text-lg mb-2 font-medium leading-6 text-gray-900"
            >
              Your Text
            </label>
            <div className="">
              <input
                type="text"
                name="username"
                id="text"
                className="input input-bordered w-full max-w-xs"
                placeholder="Text to render"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* @ts-ignore */}
        {template && <TemplateCard template={template} />}

        <div className="w-full flex col-span-2 mt-10">
          <div className="ml-auto flex flex-row gap-3">
            <AspectRationButton
              value={[width, height]}
              onChange={(w, h) => {
                setWidth(w);
                setHeight(h);
              }}
            />
            <BatchSizeButton max={4} value={batch} onChange={setBatch} />
            <button
              disabled={!canQueue}
              onClick={onQueueClick}
              className={cn(
                "btn btn-secondary rounded-full font-bold text-lg",
                !user && "btn-disabled"
              )}
            >
              Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
