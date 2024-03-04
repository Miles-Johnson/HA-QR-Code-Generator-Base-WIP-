import { GenerationsList } from "../../components/generations/GenerationsList";
import PageBackButton from "../../components/shared/PageBackButton";
import PageHeading from "../../components/shared/pageHeading";

export default async function HistoryPage() {
  return (
    <section className="col-span-12 overflow-hidden mb-12">
      <PageBackButton href="/templates" text="Templates" />
      <PageHeading
        heading="History"
        subheading="History of all your generations"
      />

      <GenerationsList />
    </section>
  );
}
