// app/api/skins/[hero]/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

interface Skin {
  id: string;
  name: string;
  img: string | null;
}

export async function GET(
  request: Request,
  { params }: { params: { name: string } } // <-- dùng `name` vì folder là [name]
) {
  const heroParam = params?.name ?? "";
  const heroName = String(heroParam).trim().toLowerCase();
  if (!heroName) {
    return NextResponse.json({ error: "Missing hero name" }, { status: 400 });
  }

  try {
    const url = `https://lienquan.garena.vn/hoc-vien/tuong-skin/d/${encodeURIComponent(
      heroName
    )}/`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36",
        Accept: "text/html",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    // main skin
    const heroSkin1El = $("#heroSkin-1");
    const mainName = heroSkin1El.find("h3").text().trim() || heroName;
    let mainImg =
      heroSkin1El.find("picture img").attr("src") ??
      heroSkin1El.find("img").attr("src") ??
      null;

    // normalize url
    const normalize = (src: string | null) => {
      if (!src) return null;
      if (src.startsWith("//")) return `https:${src}`;
      if (src.startsWith("/")) return `https://lienquan.garena.vn${src}`;
      if (!/^https?:\/\//i.test(src)) return `https://lienquan.garena.vn/${src}`;
      return src;
    };

    mainImg = normalize(mainImg);

    // all skins inside .hero__skins--detail
    const skins: Skin[] = [];
    $(".hero__skins--detail").each((_, el) => {
      const id = $(el).attr("id") ?? "";
      let name = $(el).find("h3").text().trim();
      if (!name) {
        name = $(el).find("h3 img").attr("alt") ?? "";
      }
      const img =
        $(el).find("picture img").attr("src") ??
        $(el).find("img").attr("src") ??
        null;
      const nimg = normalize(img);
      if (id || name) skins.push({ id, name, img: nimg });
    });

    return NextResponse.json({
      hero: heroName,
      main: {
        id: "heroSkin-1",
        name: mainName,
        img: mainImg,
      },
      skins,
      source: url,
    });
  } catch (err) {
    console.error("Scrape error:", err);
    return NextResponse.json(
      { error: `Lỗi crawl dữ liệu cho tướng ${heroName}` },
      { status: 500 }
    );
  }
}
