import { GenerationsList } from "../../../../components/generations/GenerationsList";
import { NewGenerationForm } from "../../../../components/generations/NewGenerationForm";
import PageBackButton from "../../../../components/shared/PageBackButton";
import PageHeading from "../../../../components/shared/pageHeading";

// @ts-ignore
export default function Page({ params: { templateId } }): JSX.Element {
  return (
    <section className="col-span-12 overflow-hidden">
      <PageBackButton href="/templates" text="Templates" />
      <PageHeading
        heading="Template builder"
        subheading="Use prefefined templates to start creating images"
      />

      <NewGenerationForm templateId={+templateId} />
      <GenerationsList />
    </section>
  );
}
