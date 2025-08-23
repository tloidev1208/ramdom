"use client";
import { useEffect, useState } from "react";

interface Hero {
  name: string;
  img: string;
  type: string;
}

export default function TestPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);

  useEffect(() => {
    fetch("/api/heroes")
      .then((res) => res.json())
      .then((data) => setHeroes(data));
  }, []);

  return (
    <div className="p-4">
      {heroes.map((h) => (
        <div key={h.name} className="flex items-center gap-4 border-b py-2">
          <img src={h.img} alt={h.name} className="w-16 h-16 rounded" />
          <div>
            <p className="font-semibold text-black">{h.name}</p>
            <p className="text-gray-500 text-sm">Type: {h.type}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
