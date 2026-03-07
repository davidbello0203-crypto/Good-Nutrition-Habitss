import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import ReservarFloat from "@/components/ui/ReservarFloat";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Good Nutrition Habits | L.N. Bryan Yaudiel Gil Tlatempa",
  description: "Consultas de nutrición personalizadas y entrenamiento presencial en Tixtla de Guerrero. Agenda tu cita fácil y rápido.",
  keywords: "nutriólogo, nutrición, entrenamiento, Tixtla, Guerrero, dieta, salud",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
        <CustomCursor />
        {children}
        <ReservarFloat />
      </body>
    </html>
  );
}
