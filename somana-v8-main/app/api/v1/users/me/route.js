import { NextResponse } from "next/server";

import connectMongoDB from "@/app/_lib/mongodb";
import User from "@/app/_models/userModel";
import { auth } from "@/app/_lib/auth";

export async function GET() {
  await connectMongoDB();

  const session = await auth();
  const userId = session?.user?.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId).lean();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ data: user });
}
