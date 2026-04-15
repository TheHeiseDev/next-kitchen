import * as React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/providers/provider";
import { siteConfig } from "@/config/site.config";
import { layoutConfig } from "@/config/layout.config";
import Header from "@/app/components/UI/layout/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description ,
};

interface RootLaloutProps { 
  children: React.ReactNode
}

export default function RootLayout({ children }: Readonly<RootLaloutProps>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <Header/>
          <main 
            className="flex flex-col w-full justify-start items-center"
            style={{ height: `calc(100vh - ${layoutConfig.headerHeight} - ${layoutConfig.footerHeight})`}}>
          {children}
          </main>
          <footer className="flex justify-center items-center"
          style={{height: layoutConfig.footerHeight }}
          >
            <p>{siteConfig.description}</p>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
