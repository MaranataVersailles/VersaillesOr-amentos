import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    // Garantir compatibilidade com Next.js 15 (params como Promise)
    const params = await Promise.resolve(context.params);
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    await db.delete(notes).where(eq(notes.id, id));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[NOTES_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
