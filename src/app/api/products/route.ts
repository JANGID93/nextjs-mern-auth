import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "products.json");

export async function GET(req: Request) {
    try {
        // Read products from JSON file
        const fileData = await fs.readFile(filePath, "utf-8");
        const products = JSON.parse(fileData);

        // Extract page and limit from query params
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        // Calculate pagination
        const totalProducts = products.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = products.slice(startIndex, endIndex);

        return NextResponse.json({ 
            products: paginatedProducts, 
            totalProducts 
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
