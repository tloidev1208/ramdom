// app/api/skins/[hero]/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

interface Skin {
  id: string;
  name: string;
  img: string | null;
}

interface SkillImg {
  id: string;
  title: string;
  img: string | null;
}

function toSlug(input: string) {
  const decoded = decodeURIComponent(input || "");
  return decoded
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // keep alphanumeric, space, hyphen
    .replace(/\s+/g, "-") // spaces -> hyphen
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-|-$/g, ""); // trim hyphens
}

export async function GET(request: Request, { params }: any) {
  const rawParam = params?.name ?? "";
  const heroSlug = toSlug(String(rawParam));
  if (!heroSlug) {
    return NextResponse.json({ error: "Missing hero name" }, { status: 400 });
  }

  try {
    const url = `https://lienquan.garena.vn/hoc-vien/tuong-skin/d/${encodeURIComponent(
      heroSlug
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

    const normalize = (src: string | null) => {
      if (!src) return null;
      if (src.startsWith("//")) return `https:${src}`;
      if (src.startsWith("/")) return `https://lienquan.garena.vn${src}`;
      if (!/^https?:\/\//i.test(src)) return `https://lienquan.garena.vn/${src}`;
      return src;
    };

    // main skin
    const heroSkin1El = $("#heroSkin-1");
    const mainName = heroSkin1El.find("h3").text().trim() || heroSlug;
    let mainImg =
      heroSkin1El.find("picture img").attr("src") ??
      heroSkin1El.find("img").attr("src") ??
      null;
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

    // skill images from .hero__skills--list
    const skills: SkillImg[] = [];
    $(".hero__skills--list")
      .find("a")
      .each((_, el) => {
        const href = $(el).attr("href") ?? "";
        const id = href.replace("#", "").trim();
        const title =
          $(el).attr("title") ??
          $(el).find("img").attr("alt") ??
          $(el).text().trim() ??
          "";
        const src =
          $(el).find("img").attr("src") ??
          $(el).attr("data-src") ??
          $(el).attr("data-original") ??
          null;
        const nimg = normalize(src);
        skills.push({ id, title, img: nimg });
      });

    return NextResponse.json({
      hero: heroSlug,
      main: {
        id: "heroSkin-1",
        name: mainName,
        img: mainImg,
      },
      skins,
      skills,
      source: url,
    });
  } catch (err) {
    console.error("Scrape error:", err);
    return NextResponse.json(
      { error: `Lỗi crawl dữ liệu cho tướng ${heroSlug}` },
      { status: 500 }
    );
  }
}
