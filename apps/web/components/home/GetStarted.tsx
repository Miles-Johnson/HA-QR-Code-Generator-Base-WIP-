import Link from "next/link";
import cn from "../../lib/cn";

export default function GetStarted() {
  return (
    <div className={cn("rounded-xl mt-24", "bg-base-200 ")}>
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-12 lg:flex lg:items-center lg:justify-between lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Ready to dive in?
          <br />
          Get started for free.
        </h2>
        <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
          <Link
            href="/templates"
            className="btn btn-neutral rounded-full px-6 py-3 text-base font-medium"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}
