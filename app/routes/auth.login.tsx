import { login } from "../shopify.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw await login(request);
  }
  return json({ showForm: true });
};

export default function Auth() {
  return null;
}
