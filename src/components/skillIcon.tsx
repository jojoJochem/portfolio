// components/SkillIcon.tsx
interface SkillIconProps {
    name: string;
    imgSrc: string;
    docLink: string;
    showLabel?: boolean;
    sizeClass?: string;
    imgClassName?: string;
    filterClassName?: string;
  }

  const SkillIcon = ({
    name,
    imgSrc,
    docLink,
    showLabel = true,
    sizeClass = "w-16 h-16 sm:w-20 sm:h-20",
    imgClassName = "",
    filterClassName = "filter grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110",
  }: SkillIconProps) => {
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
          className={`${sizeClass} object-contain ${filterClassName} ${imgClassName}`}
        />
        {showLabel ? (
          <span className="mt-2 text-sm text-center text-muted-foreground">{name}</span>
        ) : null}
      </a>
    );
  };



  export default SkillIcon;
