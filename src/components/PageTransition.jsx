import React from "react";

function PageTransition({ children }) {
  return (
    <>
      {/* 🌟 Iniettiamo l'animazione CSS direttamente nel codice JavaScript */}
      <style>{`
        @keyframes pageFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-page-fade {
          animation: pageFadeIn 0.4s ease-out forwards;
        }
      `}</style>

      {/* Applichiamo la classe appena definita sopra */}
      <div className="animate-page-fade">{children}</div>
    </>
  );
}

export default PageTransition;
