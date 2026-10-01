// Server-only Sanity client with write access.
// NEVER import this file from a "use client" component: the token must stay on the server.
import crypto from "crypto";
import { client } from "@/lib/sanity";

export const writeClient = client.withConfig({
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false, // always read fresh data
  perspective: "raw", // make sure the private "orders.*" documents are included
});

// Saves a purchase as an order document.
// The _id starts with "orders." on purpose: documents with a dot in their ID
// are hidden from public (no-token) queries, so customer emails stay private
// even though the product dataset itself is public.
// Using the LemonSqueezy order ID in the _id makes this safe to run twice:
// if LemonSqueezy retries the webhook, the existing order is left untouched.
export async function saveOrder({ lsOrder, customerEmail, customerName, products }) {
  const attrs = lsOrder.attributes;

  return writeClient.createIfNotExists({
    _id: `orders.ls-${lsOrder.id}`,
    _type: "order",
    customerEmail: customerEmail.trim().toLowerCase(),
    customerName,
    products: products.map((p) => ({
      _type: "reference",
      _ref: p._id,
      _key: p._id,
    })),
    total: attrs.total / 100,
    currency: attrs.currency,
    lemonsqueezyOrderId: String(lsOrder.id),
    orderNumber: String(attrs.order_number),
    testMode: Boolean(attrs.test_mode),
    purchasedAt: attrs.created_at,
  });
}

// True if this email has bought at least once (i.e. has an account).
export async function customerExists(email) {
  const count = await writeClient.fetch(
    `count(*[_type == "order" && customerEmail == $email])`,
    { email },
  );
  return count > 0;
}

// All orders for a customer, newest first, with product details.
export async function getOrdersByEmail(email) {
  return writeClient.fetch(
    `*[_type == "order" && customerEmail == $email] | order(purchasedAt desc) {
      _id,
      orderNumber,
      purchasedAt,
      total,
      currency,
      testMode,
      customerName,
      "products": products[]->{ _id, name, "slug": slug.current }
    }`,
    { email },
  );
}

// Returns the product's file key only if this customer actually bought it.
export async function getOwnedProductFile(email, productId) {
  return writeClient.fetch(
    `*[_type == "product" && _id == $productId
       && count(*[_type == "order" && customerEmail == $email && references(^._id)]) > 0
     ][0]{ name, fileUrl }`,
    { email, productId },
  );
}

// ---------- Customer profile (editable name) ----------
// One private document per customer. The ID uses a hash of the email so it
// is a valid Sanity ID, and starts with "customers." so it stays private.
function customerDocId(email) {
  const hash = crypto.createHash("sha256").update(email).digest("hex").slice(0, 32);
  return `customers.${hash}`;
}

// Returns the name the customer set in their account, or null.
export async function getCustomerName(email) {
  return writeClient.fetch(`*[_id == $id][0].name`, { id: customerDocId(email) });
}

export async function setCustomerName(email, name) {
  const id = customerDocId(email);
  await writeClient.createIfNotExists({ _id: id, _type: "customer", email });
  return writeClient.patch(id).set({ name }).commit();
}
