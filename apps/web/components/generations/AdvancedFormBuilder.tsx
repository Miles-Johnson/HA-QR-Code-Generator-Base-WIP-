import { useCallback, useState } from "react";
import { trpc } from "../../app/_trpc/client";
import cn from "../../lib/cn";
import { AspectRationButton } from "./AspectRationButton";
import { BatchSizeButton } from "./BatchSizeButton";

type Props = {};

export default function AdvancedFormBuilder({}: Props) {
  const [batch, setBatch] = useState(1);
  const [text, setText] = useState("");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(768);
  const [context, setContext] = useState("");
  const [checkpoint, _setCheckpoint] = useState("StarlightXL.safetensors");
  const [negative, _setNegative] = useState(
    "malformed letters, repeating letters, double letters"
  );

  const utils = trpc.useUtils();
  const { data: user } = trpc.users.get.useQuery();
  const { data: sub } = trpc.subs.getCurrentPlan.useQuery();
  const { mutate: createGeneration } = trpc.generations.queue.useMutation({
    onSuccess: () => {
      utils.generations.getAll.invalidate();
      utils.subs.getCurrentPlan.invalidate();
    },
  });
  const onQueueClick = useCallback(
    async () => {
      if (!user) return;
      const positive = `("${text}":1.6) (text logo:1.3), ${context}, <lora:Harrlogos_v1.1:1.3`;

      await createGeneration({
        positive,
        negative,
        batch,
        checkpoint,
        priority: sub?.priority,
        width,
        height,
      });
      utils.generations.getAll.invalidate();
    },
    [
      user,
      text,
      width,
      height,
      sub,
      negative,
      batch,
      context,
      checkpoint,
      text,
    ] as const
  );

  const canQueue =
    !!user && !!text && !!context && (sub?.limit ?? 0) - (sub?.usage ?? 0) > 0;

  return (
    <div className="">
      <div className="grid gap-4 gap-y-4 grid-cols-1">
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

        <div className="">
          <label
            htmlFor="contet"
            className="block text-lg mb-2 font-medium leading-6 text-gray-900"
          >
            Prompt
          </label>
          <div className="">
            <textarea
              id="context"
              className="textarea textarea-bordered w-full max-w-xs"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
        </div>

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
