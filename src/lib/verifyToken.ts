import { NextResponse } from "next/server";
import jwt, { Secret } from "jsonwebtoken";

export function verifyToken(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
        const secretKey = process.env.JWT_SECRET as Secret;
        if (!secretKey) throw new Error("JWT_SECRET is not defined");

        const decoded = jwt.verify(token, secretKey);
        return decoded; // Return the decoded token payload
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }
}
