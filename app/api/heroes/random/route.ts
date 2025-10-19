import { NextResponse } from "next/server";
import { GET as getHeroes } from "../route"; // ⬅ import trực tiếp API heroes

export async function GET() {
  try {
    // gọi trực tiếp function GET của /api/heroes
    const res = await getHeroes();
    const heroes = await res.json();

    if (!Array.isArray(heroes) || heroes.length === 0) {
      return NextResponse.json({ error: "Danh sách tướng trống" }, { status: 404 });
    }

    const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
    return NextResponse.json(randomHero);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Lỗi server random" }, { status: 500 });
  }
}
