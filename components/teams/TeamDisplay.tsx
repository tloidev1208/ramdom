import { Lane } from "@/types";
import { useState} from "react";
interface TeamDisplayProps {
  team: (string | { name: string; lane: Lane })[];
  results: Record<string, Record<string, string[]>>;
  title: string;
  color: string;
  dateTime?: string;
}

export default function TeamDisplay({
  team,
  results,
  title,
  color,
  dateTime,
}: TeamDisplayProps) {
  const [selectedGame, setSelectedGame] = useState(1);
  return (
    <div className="bg-gray-50 rounded-xl shadow p-4">
      <select value={selectedGame} onChange={(e) => setSelectedGame(Number(e.target.value))} className="border border-gray-300 rounded-xl px-4 py-2 text-lg font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 shadow-md hover:shadow-lg transition duration-300 mb-4" > {[1, 2, 3, 4, 5].map((num) => ( <option key={num} value={num}> Game {num} </option> ))} </select>
      {dateTime && (
        <p className="text-sm text-gray-800">🕔Random lúc: {dateTime}</p>
      )}
      <h2 className={`text-2xl font-bold mb-4 text-center ${color}`}>{title}</h2>

      <ul className="space-y-3">
        {team.map((member, idx) => {
          const name = typeof member === "string" ? member : member.name;
          const lane = typeof member === "string" ? undefined : member.lane;
          const heroList = results[name];

          return (
            <li
              key={name}
              className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white rounded-lg shadow px-4 py-2"
            >
              <span className="font-bold">{idx + 1}.</span>
              <span className="w-[150px]">{name}</span>

              {lane && (
                <span
                  className={`ml-2 px-2 py-1 rounded w-24 ${lane.bg} ${lane.color} text-xs`}
                >
                  {lane.icon} {lane.key}
                </span>
              )}

              {heroList && (
                <div className="flex flex-wrap gap-2 ml-2">
                  {Object.entries(heroList).map(([role, hero]) => (
                    <div className="flex flex-wrap gap-2">
  {hero.map((h, i) => (
    <span
      key={i}
      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
    >
      {h}
    </span>
  ))}
</div>

                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
