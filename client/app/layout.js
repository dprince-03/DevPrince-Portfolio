import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  title: "DevPrince — Portfolio",
  description: "Portfolio, styled like a terminal reading JSON.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-mono bg-term-bg text-term-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
