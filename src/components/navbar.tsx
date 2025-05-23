import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "#home", label: "Home" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b bg-background/70">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#home" className="text-lg font-bold">Jochem.vanGaalen</a>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-6 text-sm font-medium">
          {links.map(({ href, label }) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="sm:hidden text-sm font-medium"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="sm:hidden px-4 pb-4 flex flex-col gap-2 text-sm font-medium">
          {links.map(({ href, label }) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
