interface FullPageSectionProps {
    id?: string;
    className?: string;
    children: React.ReactNode;
  }

  const FullPageSection = ({ id, className = "", children }: FullPageSectionProps) => {
    return (
      <section
        id={id}
        className={`snap-start backdrop-blur h-screen flex flex-col justify-center items-start px-4 ${className}`}
      >
        {children}
      </section>
    );
  };

  export default FullPageSection;
