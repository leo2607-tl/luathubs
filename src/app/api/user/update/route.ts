import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

interface DecodedToken {
  userId: string;  
  [key: string]: string; 
}

const JWT_SECRET = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

export async function PUT(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1]; 

  if (!token) {
    return NextResponse.json({ message: "Token không tồn tại" }, { status: 401 });
  }

  try {
    const decoded: DecodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;
    const userId = decoded.userId;

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;
    const email = formData.get('email') as string;
    const image = formData.get('image') as File | null;

    let imageUrl = null;

    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = buffer.toString('base64');

      imageUrl = `data:${image.type};base64,${base64Image}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        email,
        image: imageUrl || undefined,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Có lỗi xảy ra, vui lòng thử lại" }, { status: 500 });
  }
}
