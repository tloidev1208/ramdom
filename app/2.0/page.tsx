"use client";
import React, { useState } from "react";
import PlayerList from "@/components/2.0/PlayerList";
import HeroGrid from "@/components/2.0/HeroGid";
import EnemyList from "@/components/2.0/EnemyList";
import HeaderTabs from "@/components/2.0/HeaderTabs";

export default function HeroSelectPage() {
  const tabs = ["Tất cả", "Đỡ đòn", "Đấu sĩ", "Sát thủ", "Pháp sư", "Xạ thủ", "Trợ thủ"];

  const heroes = Array.from({ length: 18 }).map((_, i) => ({
    id: i + 1,
    name: `Hero ${i + 1}`,
    role: ["Đỡ đòn", "Đấu sĩ", "Sát thủ", "Pháp sư", "Xạ thủ", "Trợ thủ"][i % 6],
  }));

  const players = [
    { id: 1, name: "suphuccat", avatarBg: "bg-gradient-to-br from-purple-400 to-pink-500", status: "Tướng gán đây" },
    { id: 2, name: "TrangBống", avatarBg: "bg-gradient-to-br from-yellow-300 to-amber-500", status: "Tướng gán đây" },
    { id: 3, name: "Người lạ", avatarBg: "bg-gradient-to-br from-sky-300 to-cyan-500", status: "" },
    { id: 4, name: "Bạn của tôi", avatarBg: "bg-gradient-to-br from-lime-300 to-green-500", status: "" },
    { id: 5, name: "MrTekk", avatarBg: "bg-gradient-to-br from-indigo-300 to-violet-600", status: "Tướng gán đây" },
  ];

  const enemyPicks = [null, null, null, null, null];

  const [activeTab, setActiveTab] = useState("Tất cả");
  const [selectedHero, setSelectedHero] = useState<number | null>(null);

  const filtered = activeTab === "Tất cả" ? heroes : heroes.filter((h) => h.role === activeTab);

  return (
    <div
      className="min-h-screen text-gray-100 p-6"
      style={{
        backgroundImage: "url('/images/bg-academy.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-full mx-auto bg-white/5 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex gap-6 p-6">
          {/* Left: player list */}
          <PlayerList players={players} />

          {/* Center: hero grid */}
          <main className="flex-1">
            <HeaderTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            <HeroGrid filtered={filtered} selectedHero={selectedHero} setSelectedHero={setSelectedHero} />
          </main>

          {/* Right: enemy picks */}
         <PlayerList players={players} />
        </div>

        <div className="border-t border-white/5 p-4 text-sm text-gray-300 flex items-center justify-between">
          <div>Trạng thái: Đang chọn tướng</div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-1 bg-white/6 rounded-md">Trang phục/Đồng</button>
            <button className="px-4 py-1 bg-white/6 rounded-md">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
}
