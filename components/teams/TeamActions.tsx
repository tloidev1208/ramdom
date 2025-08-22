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
          isSpinning
            ? "bg-gray-400 cursor-not-allowed"
            : "cursor-pointer w-40 h-12 flex items-center justify-start px-4 text-[#edbe80] text-xl font-bold transition-all duration-300 bg-[url('/images/download.png')] bg-no-repeat bg-[length:100%_100%] bg-[position:0_0]"
        }`}
      >
        {isSpinning ? "Đang xử lý..." : "Chia Team"}
      </button>

      <button
        onClick={onLane} // không cần gọi onHero nữa
        disabled={!canAssign}
        className={`px-4 py-2 rounded shadow ${
          canAssign ? " cursor-pointer w-50 h-12 flex items-center justify-start px-4 text-[#edbe80] text-xl font-bold transition-all duration-300 bg-[url('/images/download.png')] bg-no-repeat bg-[length:100%_100%] bg-[position:0_0]" : "bg-gray-300 text-gray-500"
        }`}
      >
        Random Lane
      </button>

      <button
        onClick={onHero}
        disabled={!canAssign}
        className={`px-4 py-2 rounded shadow ${
          canAssign ? "cursor-pointer w-55 h-12 flex items-center justify-start px-4 text-[#edbe80] text-xl font-bold transition-all duration-300 bg-[url('/images/download.png')] bg-no-repeat bg-[length:100%_100%] bg-[position:0_0]" : "bg-gray-300 text-gray-500"
        }`}
      >
        Random Tướng
      </button>
    </div>
  );
}
