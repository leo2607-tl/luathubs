// src/app/api/user/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../lib/prisma';
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1]; 
  if (!token) {
    return NextResponse.json({ message: "Token không tồn tại" }, { status: 401 });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key"); 
    const userId = decoded.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        bio: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Người dùng không tồn tại" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ message: "Token không hợp lệ" }, { status: 401 });
  }
}
