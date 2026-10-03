import "./globals.css";
import Providers from "./provider";

export const metadata = {
  title: "Chronicle — The Modern Tech & Design Journal",
  description: "A beautifully curated publication exploring the frontiers of technology, design, and digital craftsmanship.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
