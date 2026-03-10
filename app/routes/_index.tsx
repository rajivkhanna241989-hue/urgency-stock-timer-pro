import { redirect } from "@remix-run/node";
import { login } from "../shopify.server";

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw await login(request);
  }
  return redirect("/app");
};
