import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Gọi API nội bộ bạn đã có
    const res = await fetch("http://localhost:3000/api/heroes");
    if (!res.ok) {
      return NextResponse.json({ error: "Không lấy được danh sách tướng" }, { status: 500 });
    }

    const heroes = await res.json();

    if (!Array.isArray(heroes) || heroes.length === 0) {
      return NextResponse.json({ error: "Danh sách tướng trống" }, { status: 404 });
    }

    // Random 1 tướng
    const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
    return NextResponse.json(randomHero);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
