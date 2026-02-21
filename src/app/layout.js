import { Space_Grotesk, Space_Mono, Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Trim Pulses - Musically Tuned Impulse Responses",
  description: "Musically Tuned Impulse Responses",
  icons: {
    icon: "/favicon_logo.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceMono.variable} ${inter.variable}`}
    >
      <body className="bg-deep-bg text-white antialiased">
        <CartProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </CartProvider>
      </body>
    </html>
  );
}
