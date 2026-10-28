import "./globals.css";
import Providers from "./provider";

export const metadata = {
  title: "Chronicle — The Modern Tech & Design Journal",
  description: "A beautifully curated publication exploring the frontiers of technology, design, and digital craftsmanship.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Remove browser extension injected attributes (e.g., Urban VPN, Bitdefender) before React hydration
              (function() {
                if (typeof window === 'undefined') return;
                try {
                  const strip = (node) => {
                    if (node && node.removeAttribute) {
                      node.removeAttribute('bis_skin_checked');
                      node.removeAttribute('bis_register');
                    }
                  };
                  document.querySelectorAll('[bis_skin_checked], [bis_register]').forEach(strip);
                  new MutationObserver((mutations) => {
                    for (const m of mutations) {
                      if (m.type === 'attributes' && (m.attributeName === 'bis_skin_checked' || m.attributeName === 'bis_register')) {
                        strip(m.target);
                      } else if (m.type === 'childList') {
                        m.target.querySelectorAll?.('[bis_skin_checked], [bis_register]').forEach(strip);
                      }
                    }
                  }).observe(document.documentElement, {
                    attributes: true,
                    attributeFilter: ['bis_skin_checked', 'bis_register'],
                    subtree: true,
                    childList: true,
                  });
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white"
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
