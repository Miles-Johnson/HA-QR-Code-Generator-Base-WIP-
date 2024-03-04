import cn from "../../lib/cn";

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
const tabs = [
  { name: "Basic Builder", id: "basic" },
  { name: "Advanced Builder", id: "advanced" },
];

type Props = {
  activeTab: "basic" | "advanced";
  onChange: (tab: "basic" | "advanced") => void;
};

export default function NewGenerationTabs({ activeTab, onChange }: Props) {
  return (
    <div className="mb-4">
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => onChange(tab.id as "basic" | "advanced")}
                className={cn(
                  activeTab === tab.id
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                )}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
