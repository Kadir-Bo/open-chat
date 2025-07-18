import { Footer, Header } from "@/components";
import "../styles/globals.css";
import { AuthProvider, DatabaseProvider } from "@/context";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <AuthProvider>
          <DatabaseProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </DatabaseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
