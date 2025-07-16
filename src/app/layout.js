import { Footer, Header } from "@/components";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Header />
        <main className="pt-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
