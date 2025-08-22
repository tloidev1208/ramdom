interface TeamActionsProps {
  onSpin: () => void;
  onLane: () => void;
  onHero: () => void;
  isSpinning: boolean;
  canAssign: boolean;
}

export default function TeamActions({
  onSpin,
  onLane,
  onHero,
  isSpinning,
  canAssign,
}: TeamActionsProps) {
  return (
    <div className="flex justify-center gap-3 mb-4">
      <button
        onClick={onSpin}
        disabled={isSpinning}
        className={`px-4 py-2 rounded shadow ${
          isSpinning ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white"
        }`}
      >
        {isSpinning ? "Đang xử lý..." : "Chia Team"}
      </button>

<button
  onClick={onLane} // không cần gọi onHero nữa
  disabled={!canAssign}
  className={`px-4 py-2 rounded shadow ${
    canAssign ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-500"
  }`}
>
  Random Lane
</button>



      <button
        onClick={onHero}
        disabled={!canAssign}
        className={`px-4 py-2 rounded shadow ${
          canAssign ? "bg-indigo-500 text-white" : "bg-gray-300 text-gray-500"
        }`}
      >
        Random Tướng cho tất cả
      </button>
    </div>
  );
}
