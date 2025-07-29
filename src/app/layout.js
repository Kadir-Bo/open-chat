"use client";
import { Footer, Header } from "@/components";
import "../styles/globals.css";
import {
  AuthProvider,
  ChatProvider,
  DatabaseProvider,
  ModalProvider,
} from "@/context";
import { usePathname } from "next/navigation"; // <– hinzufügen
export default function RootLayout({ children }) {
  const pathname = usePathname(); // <– aktueller Pfad
  const isChatRoute = pathname.startsWith("/chat");
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <AuthProvider>
          <DatabaseProvider>
            <ChatProvider>
              <ModalProvider>
                <main>{children}</main>
              </ModalProvider>
            </ChatProvider>
          </DatabaseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
