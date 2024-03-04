"use client";

import { useState } from "react";
import AdvancedFormBuilder from "./AdvancedFormBuilder";
import BasicFormBuilder from "./BasicFormBuilder";
import NewGenerationTabs from "./NewGenerationTabs";
import TemplateFormBuilder from "./TemplateFormBuilder";

type Props = {
  templateId?: number;
};

export function NewGenerationForm({ templateId }: Props) {
  const [selectedTab, setSelectedTab] = useState<"basic" | "advanced">("basic");

  return (
    <>
      {!templateId && (
        <NewGenerationTabs
          activeTab={selectedTab}
          onChange={(v) => setSelectedTab(v)}
        />
      )}
      <div className="bg-base-200 rounded-lg p-12 pb-6">
        {!templateId && selectedTab === "basic" && <BasicFormBuilder />}
        {!templateId && selectedTab === "advanced" && <AdvancedFormBuilder />}
        {templateId && <TemplateFormBuilder templateId={templateId} />}
      </div>
    </>
  );
}
