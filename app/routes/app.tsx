import { Outlet } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: { request: Request }) => {
  await authenticate.admin(request);
  return null;
};

export default function App() {
  return (
    <AppProvider isEmbeddedApp apiKey={process.env.SHOPIFY_API_KEY!}>
      <NavMenu>
        <a href="/app" rel="home">Home</a>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = boundary.headers;

import { useRouteError } from "@remix-run/react";
