import { GenerationsList } from "../../components/generations/GenerationsList";
import { NewGenerationForm } from "../../components/generations/NewGenerationForm";

export default function Page(): JSX.Element {
  return (
    <section className="col-span-12 overflow-hidden">
      <NewGenerationForm />
      <GenerationsList />
    </section>
  );
}
