const Navbar = () => {
    return (
      <header className="sticky top-0 z-50 backdrop-blur border-b bg-background/70">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <a href="#home" className="text-lg font-bold">Jochem.vanGaalen</a>
          <nav className="flex gap-6 text-sm font-medium">
            <a href="#home">Home</a>

            <a href="#home">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>
    );
  };

  export default Navbar;
