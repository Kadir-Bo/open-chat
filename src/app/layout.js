"use client";
import "../styles/globals.css";
import {
  AuthProvider,
  ChatProvider,
  DatabaseProvider,
  ModalProvider,
} from "@/context";
export default function RootLayout({ children }) {
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
