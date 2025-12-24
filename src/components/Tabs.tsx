"use client";

import { useState } from "react";
import Card from "./Card";
import { tests, theoryCards } from "@/data/offerings";

type Tab = "tests" | "theory";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState<Tab>("tests");

  const items = activeTab === "tests" ? tests : theoryCards;

  return (
    <section>
      {/* Tabs */}
      <div className="flex gap-6 border-b border-neutral-800 mb-8">
        <button
          onClick={() => setActiveTab("tests")}
          className={`pb-2 text-sm ${
            activeTab === "tests"
              ? "text-white border-b border-white"
              : "text-neutral-400"
          }`}
        >
          Interactive Tests
        </button>

        <button
          onClick={() => setActiveTab("theory")}
          className={`pb-2 text-sm ${
            activeTab === "theory"
              ? "text-white border-b border-white"
              : "text-neutral-400"
          }`}
        >
          Theory & Research
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((offering) => (
          <Card key={offering.id} offering={offering} />
        ))}
      </div>
    </section>
  );
}
