import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const { data } = await axios.get("https://lienquan.garena.vn/hoc-vien/tuong-skin/");
    const $ = cheerio.load(data);

    const heroes: { name: string; img: string; type: string }[] = [];

    $(".st-heroes__item").each((_, el) => {
      const name = $(el).find(".st-heroes__item--name").text().trim();
      const img = $(el).find(".st-heroes__item--img img").attr("src") || "";
      const type = $(el).attr("data-type") || ""; // lấy data-type

      if (name && img) {
        heroes.push({ name, img, type });
      }
    });

    // sắp xếp theo type (tăng dần)
    heroes.sort((a, b) => a.type.localeCompare(b.type));

    return NextResponse.json(heroes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Lỗi crawl dữ liệu" }, { status: 500 });
  }
}
