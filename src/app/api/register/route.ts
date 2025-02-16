import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
interface User {
    Name: string;
    Email: string;
    Password: string;
}

const filePath = path.join(process.cwd(), "users.json");

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();
        let fileData;
        try {
            fileData = await fs.readFile(filePath, "utf-8");
        } catch {
            fileData = "[]";
        }
        
        let users: User[] = JSON.parse(fileData); 

        if (!Array.isArray(users)) users = [];

        const userExists = users.some((user: User) => user.Email === email);
        if (userExists) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        const newUser: User = { Name: name, Email: email, Password: password };
        users.push(newUser);

        await fs.writeFile(filePath, JSON.stringify(users, null, 2));

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
