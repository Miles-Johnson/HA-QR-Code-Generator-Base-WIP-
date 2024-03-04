import PageHeading from "../../components/shared/pageHeading";
import { ListTemplates } from "../../components/templates/ListTemplates";

export default async function TemplatesPage() {
  return (
    <section className="col-span-12 overflow-hidden mb-12">
      <PageHeading
        heading="Templates"
        subheading="Pick a template to start creating images"
      />

      <ListTemplates />
    </section>
  );
}
