import Modal from "../../../../components/shared/Modal";

export default async function GPTLoadingModal() {
  return (
    <Modal>
      <div className="w-full lg:px-24 lg:py-12 px-4 py-4">
        <header className="border-b border-gray-100 pb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full animate-pulse" />
          <div className="mt-4 flex flex-col lg:flex-row">
            <div className="lg:max-w-[70%]">
              <h1 className="font-bold text-2xl animate-pulse bg-gray-100 min-w-1/2 h-5"></h1>
              <p className="text-gray-500 font-light animate-pulsebg-gray-100 min-w-2/3 h-12"></p>
            </div>
            <div className="flex gap-4 lg:ml-auto lg:mt-0 ml-0 mt-4 items-start"></div>
          </div>
          <div></div>
        </header>
        <main className="mt-4"></main>
      </div>
    </Modal>
  );
}
