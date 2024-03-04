import { GenerationsList } from "../../../components/generations/GenerationsList";
import { NewGenerationForm } from "../../../components/generations/NewGenerationForm";
import PageBackButton from "../../../components/shared/PageBackButton";
import PageHeading from "../../../components/shared/pageHeading";

export default async function NewTemplatePage() {
  return (
    <section className="col-span-12 overflow-hidden mb-12">
      <PageBackButton href="/templates" text="Templates" />
      <PageHeading
        heading="Custom template builder"
        subheading="Build your own template to start creating images"
      />

      <NewGenerationForm />
      <GenerationsList />
    </section>
  );
}
