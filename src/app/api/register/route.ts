import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Define a TypeScript interface for user objects
interface User {
    Name: string;
    Email: string;
    Password: string;
}

const filePath = path.join(process.cwd(), "users.json");

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        // Read existing users
        let fileData;
        try {
            fileData = await fs.readFile(filePath, "utf-8");
        } catch {
            fileData = "[]"; // If file doesn't exist, start with an empty array
        }
        
        let users: User[] = JSON.parse(fileData); // Cast as an array of User

        // Ensure users is an array
        if (!Array.isArray(users)) users = [];

        // Check if user already exists
        const userExists = users.some((user: User) => user.Email === email);
        if (userExists) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        // Add new user
        const newUser: User = { Name: name, Email: email, Password: password };
        users.push(newUser);

        // Write updated data to users.json
        await fs.writeFile(filePath, JSON.stringify(users, null, 2));

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
