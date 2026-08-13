import { useState, useEffect, useRef } from "react";

export default function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const threshold = 10; // soglia minima per evitare tremolii su micro-scroll

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // In cima alla pagina: sempre visibile
      if (currentScrollY < 50) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollY.current;

      if (Math.abs(diff) < threshold) return;

      if (diff > 0) {
        // scroll verso il basso -> nascondi
        setIsVisible(false);
      } else {
        // scroll verso l'alto -> mostra
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isVisible;
}
