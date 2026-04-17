import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    
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
