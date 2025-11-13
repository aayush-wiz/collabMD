import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { EditorNavbar } from "../components/editor/editor-navbar";
import { EditorProvider } from "../components/editor/editor-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "CollabMD Frontend",
  description: "Frontend experience for the CollabMD Turborepo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-screen flex-col overflow-hidden bg-slate-950 font-sans antialiased`}
      >
        <EditorProvider>
          <EditorNavbar />
          <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
        </EditorProvider>
      </body>
    </html>
  );
}
