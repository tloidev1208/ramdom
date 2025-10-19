import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/heroes`, {
      cache: "no-store", // tránh cache
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Không lấy được danh sách tướng" }, { status: 500 });
    }

    const heroes = await res.json();

    if (!Array.isArray(heroes) || heroes.length === 0) {
      return NextResponse.json({ error: "Danh sách tướng trống" }, { status: 404 });
    }

    const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
    return NextResponse.json(randomHero);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
