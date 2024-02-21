import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import globalStyles from "~/styles/globals.css?url";
import { RootLayout } from "./layouts/root-layout";
import rdtStylesheet from "remix-development-tools/index.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStyles },
  ...(process.env.NODE_ENV === "development"
    ? [{ rel: "stylesheet", href: rdtStylesheet }]
    : []),
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <html lang="en" className="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <RootLayout>{children}</RootLayout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

const Root = () => {
  return <Outlet />;
};

let App = Root;

if (process.env.NODE_ENV === "development") {
  const { withDevTools } = await import("remix-development-tools");
  App = withDevTools(App);
}

export default App;
