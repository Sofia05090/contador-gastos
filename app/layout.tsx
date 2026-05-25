import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SWRegistration from "./SWRegistration";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
export const metadata: Metadata = {
  title: "contador gastos",
  description: "generado para visualizar de una manera practica el contador de gastos",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <SWRegistration/>
      <body>{children}</body>
    </html>
  );
}