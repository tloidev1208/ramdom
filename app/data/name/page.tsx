"use client";
import React, { useState } from "react";

type Skin = {
  id: string;
  name: string;
  img: string | null;
};

type ApiResult = {
  hero: string;
  main: Skin | null;
  skins: Skin[];
  source?: string;
  error?: string;
};

export default function HeroSkinsPage() {
  const [name, setName] = useState("");
  const [data, setData] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mainImg, setMainImg] = useState<string | null>(null);

  const fetchSkin = async (q?: string) => {
    const hero = (q ?? name).trim();
    if (!hero) return;
    setLoading(true);
    setError(null);
    setData(null);
    setMainImg(null);

    try {
      const res = await fetch(`/api/heroes/${encodeURIComponent(hero)}`);
      const json = (await res.json()) as ApiResult;
      if (!res.ok) {
        setError(json?.error || "Lỗi khi lấy dữ liệu");
      } else {
        setData(json);
        setMainImg(json.main?.img ?? json.skins?.[0]?.img ?? null);
      }
    } catch (err: any) {
      setError(err?.message || "Lỗi mạng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-center">Tìm Skin Đầu Tiên</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nhập tên tướng (vd: biron)"
          className="border p-2 flex-1 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchSkin()}
        />
        <button
          onClick={() => fetchSkin()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Đang tìm..." : "Tìm"}
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-lg shadow p-4 text-center">
            <h2 className="font-semibold mb-2">
              {data.main?.name ?? data.hero}
            </h2>
            {mainImg ? (
              <img
                src={mainImg}
                alt={data.main?.name ?? data.hero}
                className="mx-auto max-h-80 object-contain rounded"
              />
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-500">
                Không có ảnh
              </div>
            )}

            {data.source && (
              <p className="text-sm text-gray-500 mt-3">
                <a
                  href={data.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Xem nguồn
                </a>
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">Các skin</h3>
            {data.skins && data.skins.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {data.skins.map((s) => (
                  <button
                    key={s.id || s.name}
                    onClick={() => setMainImg(s.img)}
                    className="flex flex-col items-center text-xs"
                  >
                    {s.img ? (
                      <img
                        src={s.img}
                        alt={s.name}
                        className="w-full h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-20 bg-gray-100 flex items-center justify-center text-gray-400 rounded">
                        No img
                      </div>
                    )}
                    <span className="mt-1 text-center">{s.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">Không tìm thấy skin</div>
            )}
          </div>
        </div>
      )}

      {!data && !error && (
        <div className="text-center text-sm text-gray-500 mt-4">
          Nhập tên tướng và bấm Tìm để lấy ảnh từ API nội bộ.
        </div>
      )}
    </div>
  );
}