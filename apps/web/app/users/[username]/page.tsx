import { Database } from "@hartsy/db";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ImagesList } from "../../../components/profile/ImagesList";
import ProfileTabs from "../../../components/profile/ProfileTabs";
import getClientOptions from "../../../lib/cookies/getClientOptions";

export const revalidate = 60;

// @ts-ignore
export default async function Page({ params: { username } }) {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    getClientOptions(cookieStore)
  );

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (!user) return notFound();

  return (
    <section className="col-span-12 overflow-hidden mb-12">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

        <div className="drawer-side">
          <div className="menu p-4 w-80 min-h-full text-base-content">
            <div className="avatar flex flex-col items-center justify-center">
              <div className="w-24 mask mask-squircle">
                {user.avatar_url && (
                  <img src={user.avatar_url} loading="lazy" />
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-col items-center justify-center mt-5">
                <h2 className="text-xl font-bold">{user.full_name}</h2>
                <p className="text-sm text-gray-400">@{user.username}</p>
                <p>
                  Joined {/* @ts-ignore */}
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="drawer-content flex flex-col">
          <ProfileTabs activeTab="images" />
          {user.id && <ImagesList userId={user.id} />}
        </div>
      </div>
    </section>
  );
}
