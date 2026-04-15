import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 280);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-5 right-5 z-[90] inline-flex h-11 w-11 items-center justify-center rounded-full border border-violet-400/40 bg-[rgba(14,11,28,.85)] text-violet-200 shadow-[0_8px_24px_rgba(0,0,0,.35)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-violet-300/70 hover:text-white ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <FiArrowUp className="h-5 w-5" />
    </button>
  );
}

export default ScrollToTopButton;
