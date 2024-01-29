import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, MetaFunction, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

import "./root.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const meta: MetaFunction = () => {
  return [
    { charSet: "utf-8" },
    { httpEquiv: "x-ua-compatible", content: "ie=edge" },
    { title: "Level Playing Field" },
    { name: "description", content: "Level Playing Field is a searchable database of consumer arbitration cases" },
    { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
    { name: "msapplication-TileColor", content: "$373277" },
    { name: "msapplication-TileImage", content: "/tile.png" },
  ];
};

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "author", href: "humans.txt" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "icon", href: "/favicon.png", type: "image/png" },
  { rel: "icon", href: "/favicon.ico", type: "image/vnd.microsoft.icon" },
  { rel: "apple-touch-icon", href: "apple-touch-icon.png" },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <Outlet />
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
