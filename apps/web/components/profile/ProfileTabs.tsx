"use client";

import cn from "../../lib/cn";

const tabs = [
  { name: "Images", id: "images" },
  { name: "Templates (coming soon)", id: "templates" },
];

type Props = {
  activeTab: "images" | "templates";
  onChange?: (tab: "images" | "templates") => void;
};

export default function ProfileTabs({ activeTab, onChange }: Props) {
  return (
    <div className="mb-4">
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => onChange?.(tab.id as "images" | "templates")}
                className={cn(
                  activeTab === tab.id
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "whitespace-nowrap border-b-2 py-4 px-1 text-md font-medium"
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
