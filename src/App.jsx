import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ApiPage from "./pages/ApiPage";
import AuthModal from "./components/AuthModal";
import ScrollToTopButton from "./components/ScrollToTopButton";
import FeaturesPage from "./pages/FeaturesPage";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import PricingPage from "./pages/PricingPage";

export default function App() {
  const [authMode, setAuthMode] = useState(null);
  const pageProps = {
    onSignIn: () => setAuthMode("signin"),
    onSignUp: () => setAuthMode("signup"),
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage {...pageProps} />} />
        <Route path="/gallery" element={<GalleryPage {...pageProps} />} />
        <Route path="/features" element={<FeaturesPage {...pageProps} />} />
        <Route path="/pricing" element={<PricingPage {...pageProps} />} />
        <Route path="/api" element={<ApiPage {...pageProps} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitch={(nextMode) => {
            if (nextMode) {
              setAuthMode(nextMode);
              return;
            }
            setAuthMode(authMode === "signin" ? "signup" : "signin");
          }}
        />
      )}

      <ScrollToTopButton />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        pauseOnFocusLoss={false}
        draggable
        style={{ zIndex: 999999 }}
      />
    </>
  );
}
