// components/SkillIcon.tsx
interface SkillIconProps {
    name: string;
    imgSrc: string;
    docLink: string;
  }

  const SkillIcon = ({ name, imgSrc, docLink }: SkillIconProps) => {
    return (
      <a
        href={docLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center group"
      >
        <img
          src={imgSrc}
          alt={name}
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain filter grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110"
        />
        <span className="mt-2 text-sm text-center text-muted-foreground">{name}</span>
      </a>
    );
  };



  export default SkillIcon;
