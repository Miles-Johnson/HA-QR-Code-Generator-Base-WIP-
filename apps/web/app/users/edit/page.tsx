import { Database } from "@hartsy/db";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { EditProfileForm } from "../../../components/profile/EditProfileForm";
import PageHeading from "../../../components/shared/pageHeading";
import getClientOptions from "../../../lib/cookies/getClientOptions";

export const revalidate = 0;

// @ts-ignore
export default async function Page({ params: { username } }) {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    getClientOptions(cookieStore)
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return notFound();

  return (
    <section className="col-span-12 overflow-hidden mb-12">
      <PageHeading heading="Edit Profile" />
      <EditProfileForm />
    </section>
  );
}
