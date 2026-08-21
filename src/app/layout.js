import Providers from "./providers";
import Header from "@/containers/Header";
import "./globals.css";

export const metadata = { title: "Geekbenchmark" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
