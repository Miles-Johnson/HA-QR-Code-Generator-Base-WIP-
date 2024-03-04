import Link from "next/link";
import cn from "../../lib/cn";

type Props = {
  pillText: string;
  title: string;
  description: string;
  href: string;
  hrefText: string;
  imageUrl: string;
  reverse?: boolean;
};

export function FeatureSection({
  pillText,
  title,
  description,
  href,
  hrefText,
  imageUrl,
  reverse = true,
}: Props) {
  return (
    <section
      className={cn(
        "flex mt-20",
        reverse && "flex-col-reverse xl:flex-row-reverse"
      )}
    >
      <div className="grow flex flex-col items-center w-1/2">
        <div className="aspect-square rounded-lg">
          <img src={imageUrl} alt="" />
        </div>
      </div>
      <div className="flex flex-col  w-1/2">
        <div className="flex flex-col items-center gap-6 xl:flex-row mt-24">
          <div>
            <span className="btn btn-sm rounded-full font-mono font-light">
              <pre>
                <code>{pillText}</code>
              </pre>
            </span>
          </div>
        </div>
        <h3 className=" font-black text-4xl tracking-tight mt-5 mb-2">
          {title}
        </h3>
        <p className="text-xl tracking-tight mb-4">{description}</p>
        <Link href={href} className="btn rounded-full w-auto max-w-48">
          {hrefText}
        </Link>
      </div>
    </section>
  );
}
