
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PUT(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1]; 

  if (!token) {
    return NextResponse.json({ message: "Token không tồn tại" }, { status: 401 });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET); 
    const userId = decoded.userId;
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;
    const email = formData.get('email') as string;
    const image = formData.get('image') as File | null;

    let imageUrl = null;

    if (image) {
      const uploadsDir = path.join(process.cwd(), 'public/uploads');
      
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      imageUrl = `/uploads/${image.name}`;
      const imagePath = path.join(uploadsDir, image.name);
      const buffer = Buffer.from(await image.arrayBuffer());
      fs.writeFileSync(imagePath, buffer);
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
