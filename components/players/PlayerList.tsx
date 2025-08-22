interface PlayerListProps {
  players: string[];
  onRemove: (name: string) => void;
}

export default function PlayerList({ players, onRemove }: PlayerListProps) {
  if (!players.length) return null;

  return (
    <ul className="mb-6 flex flex-wrap gap-4 justify-center max-h-30 overflow-y-auto">
      {players.map((p, i) => (
        <li
          key={p}
          className="flex items-center gap-3 bg-gradient-to-r text-white from-[#E7B97E] to-gray-900 font-xl shadow px-4 py-2 mb-1 rounded-full"
        >
          <span className="font-bold mr-2">{i + 1}.</span>
          <span>{p}</span>
          <button onClick={() => onRemove(p)} className="text-red-500">
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
