import { json } from "@remix-run/node";
import { prisma } from "../shopify.server";

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) return json({ error: "Missing shop" }, { status: 400 });

  const settings = await prisma.shopSettings.findUnique({ where: { shop } });

  return json(settings || {
    enabled: true,
    message: "🔥 Hurry! Only {stock} left in stock!",
    minStock: 1,
    maxStock: 9,
    bgColor: "#fff3cd",
    textColor: "#856404",
    showIcon: true,
    pulseAnimation: true,
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
};
