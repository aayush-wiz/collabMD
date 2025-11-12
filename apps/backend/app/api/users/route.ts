import { NextResponse } from "next/server";

import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[users_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
