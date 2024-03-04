import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Footer from "../components/layout/Footer";
import GoogleAnalytics from "../components/layout/GoogleAnalytics";
import { Nav } from "../components/layout/Nav";
import cn from "../lib/cn";
import TRPCProvider from "./_trpc/provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hartsy",
  description: "Hartsy - ",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}): JSX.Element {
  return (
    <TRPCProvider>
      <html lang="en" data-theme="light">
        <body
          className={cn(
            "font-sans antialiased text-gray-600 min-h-full flex flex-col [overflow-anchor:none]",
            inter.className
          )}
        >
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 w-full">
            <main className="drawer-content w-full">
              <Nav />

              <div className="min-h-screen">{children}</div>
              {modal}
              <Footer />
            </main>
          </div>
          <Toaster />
          <GoogleAnalytics />
        </body>
      </html>
    </TRPCProvider>
  );
}
