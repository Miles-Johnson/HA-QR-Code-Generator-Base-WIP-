import { Database } from "@hartsy/db";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import GetStarted from "../components/home/GetStarted";
import NameRendered from "../components/home/NameRendered";
import SampleRenders from "../components/home/SampleRenders";
import { TemplateCard } from "../components/templates/TemplateCard";
import getClientOptions from "../lib/cookies/getClientOptions";

export const revalidate = 60;

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    getClientOptions(cookieStore)
  );

  const { data: templates } = await supabase
    .from("templates")
    .select("id, image_url, name, description")
    .eq("active", true)
    .order("order_rank", { ascending: false })
    .limit(6);

  return (
    <section className="">
      {/* Hero */}
      <div className="grid lg:grid-cols-2">
        <div className="z-10">
          <div className="flex flex-col items-center gap-6 xl:flex-row mt-24">
            <div>
              <span className="btn btn-sm rounded-full font-mono font-light">
                <pre>
                  <code>Currently in Beta</code>
                </pre>
              </span>
            </div>
          </div>
          <div className="h-4"></div>

          <h1 className="font-title text-center text-[clamp(2rem,6vw,4.2rem)] font-black leading-[1.1] [word-break:auto-phrase] xl:w-[115%] xl:text-start [:root[dir=rtl]_&amp;]:leading-[1.35]">
            <span className=" text-black brightness-150 contrast-150">
              WordArt Revolution
            </span>
            <br />
            <span className="inline-grid">
              <span
                className="pointer-events-none col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text blur-xl [transform:translate3d(0,0,0)] [-webkit-text-fill-color:transparent] before:content-[attr(data-text)] [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]"
                aria-hidden="true"
                data-text="Seamless Text"
              ></span>
              <span className="relative col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&amp;::selection]:bg-blue-700/20 [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]">
                Seamless Text
              </span>
            </span>
            <br />
            <span className="brightness-150 contrast-150 text-black">
              in AI-Generated Images
            </span>
          </h1>

          <div className="h-8"></div>

          <p className="text-base-content/70 font-title py-4 font-light sm:text-center lg:text-left md:text-lg xl:text-2xl">
            Bring your ideas to life with stunning visuals and crystal-clear
            text -{" "}
            <span className="border-base-content/20 border-b-2">
              a breakthrough in creative expression!
            </span>
          </p>
          <div className="h-8"></div>

          <div>
            <div className="inline-flex w-full flex-col items-stretch justify-center gap-4 px-4 md:flex-row xl:justify-start xl:px-0">
              <Link
                href="/#examples"
                className="btn rounded-full md:btn-lg md:btn-wide group px-12"
              >
                <span className="hidden sm:inline">See Examples</span>
                <span className="inline sm:hidden">Examples</span>
              </Link>
              <Link
                href="/templates"
                className="btn btn-neutral rounded-full md:btn-lg md:btn-wide group px-12"
              >
                Get Started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="hidden h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 md:inline-block"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="transform translate-x-10 z-1 mt-24 ml-24 hidden lg:block">
          <div className="ml-auto grid grid-cols-2 gap-8 opacity-80 [transform:rotateX(20deg)rotateZ(calc(-20deg))skewY(calc(8deg))]">
            <Image
              width={192}
              height={192}
              className="w-full  rounded-lg animate-fade animate-once animate-ease-in-out animate-duration-[1000ms] animate-delay-200"
              src="https://yfixpvzkurnytlvefeos.supabase.co/storage/v1/object/public/assets/sample1.png"
              alt=""
            />
            <Image
              width={192}
              height={192}
              className="w-full  rounded-lg animate-fade animate-once animate-ease-in-out animate-duration-[1000ms] animate-delay-[400ms]"
              src="https://yfixpvzkurnytlvefeos.supabase.co/storage/v1/object/public/assets/sample2.png"
              alt=""
            />
            <Image
              width={192}
              height={192}
              className="w-full  rounded-lg animate-fade animate-once animate-ease-in-out animate-duration-[1000ms] animate-delay-[600ms]"
              src="https://yfixpvzkurnytlvefeos.supabase.co/storage/v1/object/public/assets/sample3.png"
              alt=""
            />
            <Image
              width={192}
              height={192}
              className="w-full  rounded-lg animate-fade animate-once animate-ease-in-out animate-duration-[1000ms] animate-delay-[800ms]"
              src="https://yfixpvzkurnytlvefeos.supabase.co/storage/v1/object/public/assets/sample4.png"
              alt=""
            />
          </div>
        </div>
      </div>

      <SampleRenders />
      <NameRendered />

      {/* Temlates */}
      <div className="mt-24">
        <div className="mb-4">
          <h2 className="font-title text-center text-[clamp(2rem,6vw,4.2rem)] font-black leading-[1.1] [word-break:auto-phrase] xl:w-[115%] xl:text-start [:root[dir=rtl]_&]:leading-[1.35]">
            Templates
          </h2>
          <p className="text-lg w-full md:w-1/2">
            Build your own or use our templates crafted by experts to generate
            the AI text images.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          {templates?.map((template) => (
            // @ts-ignore
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        <div className="w-full flex justify-center mt-12">
          <Link
            href="/templates"
            className="btn btn-neutral rounded-full md:btn-lg md:btn-wide group px-12"
          >
            See all templates
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="hidden h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 md:inline-block"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              ></path>
            </svg>
          </Link>
        </div>
      </div>

      {/* Features */}
      {/* <FeatureSection
        pillText="Logo Generator"
        title="Create a brand logo"
        description="Create a brand logo for your business or personal brand in seconds. No design skills required. Just enter your brand name and click generate."
        href="/templates"
        hrefText="Get Started"
        imageUrl=""
      />
      <FeatureSection
        pillText="Unlimited Creativity"
        title="First AI Image Generator With Text"
        description="Create any image with text. Use our templates or create your own. The possibilities are endless."
        href="/templates"
        hrefText="Get Started"
        imageUrl=""
        reverse={false}
      /> */}

      {/* CTA */}
      <GetStarted />
    </section>
  );
}
