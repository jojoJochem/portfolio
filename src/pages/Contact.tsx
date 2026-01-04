import FullPageSection from "@/components/fullPageSection";
import SkillIcon from "@/components/skillIcon";

const contactLinks = [
  {
    name: "LinkedIn",
    imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-original.svg",
    docLink: "https://www.linkedin.com/in/jochem-van-gaalen",
    showLabel: false,
    sizeClass: "w-12 h-12 sm:w-14 sm:h-14",
  },
  {
    name: "GitHub",
    imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg",
    docLink: "https://github.com/jojoJochem",
    showLabel: false,
    sizeClass: "w-12 h-12 sm:w-14 sm:h-14",
    filterClassName: "transition-all duration-300 group-hover:scale-110 opacity-65 group-hover:opacity-100",
  },
];

const Contact = () => {
    return (
        <FullPageSection id="contact">
        <h2 className="text-4xl font-semibold mb-6">Contact</h2>
        <p>Feel free to reach out if you want to collaborate, chat, or just say hi!</p>

        <ul className="space-y-2 text-lg">
          <li>Email: <a className="text-blue-500" href="mailto:jochem@vangaalen.org">jochem@vangaalen.org</a></li>
        </ul>

        <div className="mt-6 grid grid-cols-2 gap-6 sm:w-fit">
          {contactLinks.map((link) => (
            <SkillIcon key={link.name} {...link} />
          ))}
        </div>
      </FullPageSection>
    );
  };

  export default Contact;
