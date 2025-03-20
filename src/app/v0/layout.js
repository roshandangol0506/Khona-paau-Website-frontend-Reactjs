import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/V0_theme_provider";
import { CartProvider } from "@/context/Cart_context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Khokan Paau - Fashion Store",
  description: "Discover the latest fashion collections",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>{children}</CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
