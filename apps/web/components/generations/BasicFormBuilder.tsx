import { useCallback, useState } from "react";
import { trpc } from "../../app/_trpc/client";
import cn from "../../lib/cn";
import { AspectRationButton } from "./AspectRationButton";
import { BatchSizeButton } from "./BatchSizeButton";

const COLORS = [
  "Blue",
  "Red",
  "Green",
  "Black",
  "White",
  "Yellow",
  "Purple",
  "Pink",
  "Orange",
  "Gray",
  "Brown",
  "Navy Blue",
  "Other",
];

const STYLE_MODIFIERS = [
  "dripping",
  "colorful",
  "graffiti",
  "tattoo",
  "anime",
  "pixel art",
  "8-bit",
  "16-bit",
  "32-bit",
  "metal",
  "metallic",
  "spikey",
  "stone",
  "splattered",
  "comic book",
  "80s",
  "neon",
  "3D",
  "Other",
];

const ACCENT_MODIFIERS = [
  "smoke",
  "fire",
  "flames",
  "tentacles",
  "hell",
  "glow",
  "horns",
  "wings",
  "halo",
  "roots",
  "embossed",
  "blood",
  "digital",
  "ice",
  "frozen",
  "japanese",
  "chrome",
  "pastel",
  "robotic",
  "hearts",
  "cute",
  "egyptian",
  "viking",
  "Other",
];

type Props = {};

export default function BasicFormBuilder({}: Props) {
  const [batch, setBatch] = useState(1);
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState(COLORS[0]);
  const [accentColor, setAccentColor] = useState(COLORS[1]);
  const [bgColor, setBgColor] = useState(COLORS[4]);
  const [styleModifier, setStyleModifier] = useState(STYLE_MODIFIERS[0]);
  const [accentModifier, setAccentModifier] = useState(ACCENT_MODIFIERS[0]);
  const [context, setContext] = useState("");
  const [negative, setNegative] = useState(
    "malformed letters, repeating letters, double letters"
  );
  const [checkpoint, setCheckpoint] = useState("StarlightXL.safetensors");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(768);

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

      const positive = `("${text}":1.6) (text logo:1.3), ${textColor}, ${accentColor}, ${bgColor}, ${styleModifier}, ${accentModifier}, ${context}, <lora:Harrlogos_v1.1:1.3>`;

      await createGeneration({
        positive,
        negative,
        batch,
        checkpoint,
        priority: sub?.priority,
      });
      utils.generations.getAll.invalidate();
    },
    [
      user,
      text,
      checkpoint,
      accentColor,
      bgColor,
      styleModifier,
      accentModifier,
      context,
      negative,
      batch,
      sub,
    ] as const
  );

  const canQueue =
    !!user && !!text && !!context && (sub?.limit ?? 0) - (sub?.usage ?? 0) > 0;

  return (
    <div className="">
      <div className="grid gap-4 gap-y-4">
        <div className="w-full">
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
              className="input input-bordered w-full"
              placeholder="Text to render"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full">
          <label
            htmlFor="color"
            className="block text-lg mb-2 font-medium leading-6 text-gray-900"
          >
            Text Color
          </label>
          <div className="">
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  onClick={() => setTextColor(color)}
                  key={color}
                  className={cn(
                    "btn-ghost btn-sm rounded-full border-1 border-secondary/20 text-black hover:bg-secondary/20",
                    color === textColor && "bg-secondary text-white"
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="">
          <label
            htmlFor="contet"
            className="block text-lg mb-2 font-medium leading-6 text-gray-900"
          >
            Additional Details
          </label>
          <div className="">
            <textarea
              id="context"
              className="textarea textarea-bordered w-full"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
        </div>

        <div className="">
          <label
            htmlFor="accent"
            className="block text-lg mb-2 font-medium leading-6 text-gray-900"
          >
            Accent Color
          </label>
          <div className="">
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  onClick={() => setAccentColor(color)}
                  key={color}
                  className={cn(
                    "btn-ghost btn-sm rounded-full border-1 border-secondary/20 text-black hover:bg-secondary/20",
                    color === accentColor && "bg-secondary text-white"
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="">
          <label
            htmlFor="bg"
            className="block text-lg mb-2 font-medium leading-6 text-gray-900"
          >
            Background Color
          </label>
          <div className="">
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  onClick={() => setBgColor(color)}
                  key={color}
                  className={cn(
                    "btn-ghost btn-sm rounded-full border-1 border-secondary/20 text-black hover:bg-secondary/20",
                    color === bgColor && "bg-secondary text-white"
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="">
          <label
            htmlFor="style"
            className="block text-lg mb-2 font-medium leading-6 text-gray-900"
          >
            Style Modifier
          </label>
          <div className="">
            <div className="flex flex-wrap gap-2">
              {STYLE_MODIFIERS.map((modifier) => (
                <button
                  onClick={() => setStyleModifier(modifier)}
                  key={modifier}
                  className={cn(
                    "btn-ghost btn-sm rounded-full border-1 border-secondary/20 text-black hover:bg-secondary/20",
                    modifier === styleModifier && "bg-secondary text-white"
                  )}
                >
                  {modifier}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="">
          <label
            htmlFor="style"
            className="block text-lg mb-2 font-medium leading-6 text-gray-900"
          >
            Accent Modifier
          </label>
          <div className="">
            <div className="flex flex-wrap gap-2">
              {ACCENT_MODIFIERS.map((modifier) => (
                <button
                  onClick={() => setAccentModifier(modifier)}
                  key={modifier}
                  className={cn(
                    "btn-ghost btn-sm rounded-full border-1 border-secondary/20 text-black hover:bg-secondary/20",
                    modifier === accentModifier && "bg-secondary text-white"
                  )}
                >
                  {modifier}
                </button>
              ))}
            </div>
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
