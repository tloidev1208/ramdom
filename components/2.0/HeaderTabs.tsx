import React from "react";

interface Props {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function HeaderTabs({ tabs, activeTab, setActiveTab }: Props) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold">Chọn</h2>
        <p className="text-sm text-gray-300">Tất cả / chọn tướng phù hợp với vai trò</p>
      </div>

      <div className="flex items-center gap-3">
        <nav className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeTab === t ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>

        <div className="ml-3 text-sm text-gray-400">Tất cả</div>
      </div>
    </header>
  );
}
