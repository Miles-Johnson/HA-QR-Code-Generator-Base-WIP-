import { SingleCard } from "../../../../components/generations/SingleCard";
import Modal from "../../../../components/shared/Modal";

// @ts-ignore
export default async function GenerationModal({ params: { id } }) {
  return (
    <Modal>
      <div className="w-full lg:px-4 lg:py-12 px-4 py-8">
        <SingleCard id={+id} index={0} />
      </div>
    </Modal>
  );
}
