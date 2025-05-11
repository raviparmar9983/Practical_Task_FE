"use client";

import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider, useAuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import { ToastContainer } from "react-toastify";

function AppContent({ children }) {
  const { isAuthenticated } = useAuthContext();

  return (
    <>
      {isAuthenticated && <Header />}
      <div>{children}</div>
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ProtectedRoute>
            <AppContent>{children}</AppContent>
            <ToastContainer   position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" ></ToastContainer>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
