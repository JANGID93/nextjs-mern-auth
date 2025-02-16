import { NextResponse } from "next/server";
import jwt, { Secret } from "jsonwebtoken";
import { verifyToken } from "@/lib/verifyToken";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const filePath = path.join(process.cwd(), "users.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const userData = JSON.parse(fileData);
    const users = Array.isArray(userData) ? userData : [userData];
    const user = users.find((u) => u.Email === email && u.Password === password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const secretKey = process.env.JWT_SECRET as Secret;
    if (!secretKey) throw new Error("JWT_SECRET is not defined");
    const token = jwt.sign({ email }, secretKey, { expiresIn: "1h" });
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
