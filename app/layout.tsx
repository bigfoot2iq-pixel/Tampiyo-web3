import type { Metadata } from "next";
import {
  Newsreader,
  Inter_Tight,
  Caveat,
  Stardos_Stencil,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

const stardosStencil = Stardos_Stencil({
  variable: "--font-stardos-stencil",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TAMPIYO — The Grumpy Panda Token",
  description:
    "A grumpy panda. A token. Don't make it weird. $TMPY on Ethereum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${interTight.variable} ${caveat.variable} ${stardosStencil.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
