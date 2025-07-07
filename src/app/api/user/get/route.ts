import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../lib/prisma';
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string;  
  [key: string]: string;
}

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1]; 
  if (!token) {
    return NextResponse.json({ message: "Token không tồn tại" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30");

    if (typeof decoded !== "object" || decoded === null || !("userId" in decoded)) {
      return NextResponse.json({ message: "Token không hợp lệ" }, { status: 401 });
    }

    const userId = (decoded as DecodedToken).userId;

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
