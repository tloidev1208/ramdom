import React from "react";

interface Player {
  id: number;
  name: string;
  avatarBg: string;
  status: string;
}

export default function PlayerList({ players }: { players: Player[] }) {
  return (
    <aside className="w-64 flex-shrink-0">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Người chơi</h3>
        <ul className="space-y-3">
          {players.map((p) => (
            <li key={p.id} className="flex items-center gap-3 bg-white/3 p-2 rounded-lg">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium text-white ${p.avatarBg}`}>
                {p.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{p.name}</div>
                  <div className="text-xs text-gray-300">13</div>
                </div>
                <div className="text-xs text-gray-400">{p.status}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <button className="w-full bg-red-600/80 hover:bg-red-700 transition py-2 rounded-md">Hủy giúp chọn</button>
        <button className="w-full mt-3 bg-blue-600/90 hover:bg-blue-700 transition py-2 rounded-md">Muốn chọn</button>
      </div>
    </aside>
  );
}
