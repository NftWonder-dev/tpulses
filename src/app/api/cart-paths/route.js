// app/api/cart-paths/route.js - Collection › Category › Sub-Pack names for cart items
import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

const MAX_IDS = 100;

// Looked up on the server because Sanity blocks queries from the browser (CORS).
export async function POST(request) {
  try {
    const { productIds } = await request.json();

    if (
      !Array.isArray(productIds) ||
      productIds.length > MAX_IDS ||
      !productIds.every((id) => typeof id === "string")
    ) {
      return NextResponse.json({ error: "Invalid product ids" }, { status: 400 });
    }

    const products = await client.fetch(
      `*[_type == "product" && _id in $ids] {
        _id,
        "collectionName": coalesce(collection->name, category->collection->name),
        "categoryName": category->name,
        "subPackName": subpack->name
      }`,
      { ids: [...new Set(productIds)] },
    );

    const paths = {};
    for (const { _id, collectionName, categoryName, subPackName } of products) {
      paths[_id] = { collectionName, categoryName, subPackName };
    }

    return NextResponse.json(paths);
  } catch (error) {
    console.error("Cart paths error:", error);
    return NextResponse.json({ error: "Could not load paths" }, { status: 500 });
  }
}
