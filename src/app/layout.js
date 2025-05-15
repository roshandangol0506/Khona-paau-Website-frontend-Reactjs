import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/V0_theme_provider";
import { Toaster } from "sonner";
import Navbar from "@/components/V0_Navbar";
import { CartProvider } from "@/context/Cart_context";
import { GeneralSettingProvider } from "@/context/general_setting";

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
          <CartProvider>
            <GeneralSettingProvider>
              <Navbar />
              {children}
            </GeneralSettingProvider>
          </CartProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
