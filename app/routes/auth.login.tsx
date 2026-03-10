import { login } from "../shopify.server";

export const loader = async ({ request }: { request: Request }) => {
  return login(request);
};

export default function Auth() {
  return null;
}
