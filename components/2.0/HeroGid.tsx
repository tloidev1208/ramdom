import React from "react";

interface Hero {
  id: number;
  name: string;
  role: string;
}

interface Props {
  filtered: Hero[];
  selectedHero: number | null;
  setSelectedHero: (id: number) => void;
}

export default function HeroGrid({ filtered, selectedHero, setSelectedHero }: Props) {
  return (
    <section className="mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((h) => (
          <div
            key={h.id}
            onClick={() => setSelectedHero(h.id)}
            className={`cursor-pointer rounded-xl p-3 flex flex-col items-center gap-3 text-center transition transform hover:scale-105 ${
              selectedHero === h.id ? "ring-4 ring-blue-500/40" : "bg-white/3"
            }`}
          >
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow">
              <span>{h.name}</span>
            </div>
            <div className="text-sm font-semibold">{h.name}</div>
            <div className="text-xs text-gray-300">{h.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
