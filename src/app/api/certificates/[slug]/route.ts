import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE_MAP: Record<string, string> = {
  serifikat: "сертификат.pdf",
  razreshenie: "НУТВА РАЗРЕШЕНИЕ.pdf",
  ses: "Заключение СЭС.pdf",
};

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const fileName = FILE_MAP[params.slug];
    if (!fileName) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const filePath = path.join(process.cwd(), "src", "assets", "certificates", fileName);
  const buffer = await fs.readFile(filePath);

    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    // Inline to allow iframe preview; browsers will still download if anchor has download attr
    const encoded = encodeURIComponent(fileName);
    headers.set("Content-Disposition", `inline; filename*=UTF-8''${encoded}`);

  return new NextResponse(new Uint8Array(buffer), { headers });
  } catch (err) {
    console.error("PDF serve error", err);
    return NextResponse.json({ error: "Failed to load file" }, { status: 500 });
  }
}
