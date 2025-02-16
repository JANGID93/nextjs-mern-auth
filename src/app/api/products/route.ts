import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "products.json");

export async function GET() {
    try {
        const fileData = await fs.readFile(filePath, "utf-8");
        const products = JSON.parse(fileData);

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("Error reading product.json:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
