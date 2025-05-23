// pages/Skills.tsx
import FullPageSection from "@/components/fullPageSection";
import SkillIcon from "@/components/skillIcon";

const skills = [
  {
    name: "React",
    imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg",
    docLink: "https://reactjs.org/docs/getting-started.html",
  },
  {
    name: "TypeScript",
    imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg",
    docLink: "https://www.typescriptlang.org/docs/",
  },
  {
    name: "Python",
    imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg",
    docLink: "https://docs.python.org/3/",
  },
  {
    name: "TailwindCSS",
    imgSrc: "https://raw.githubusercontent.com/github/explore/261c2cda92d09ccad6f8b2dc91af32a2a5856989/topics/tailwind/tailwind.png",
    docLink: "https://tailwindcss.com/docs",
  },
  {
    name: "Git",
    imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg",
    docLink: "https://git-scm.com/doc",
  },
  {
    name: "Docker",
    imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg",
    docLink: "https://docs.docker.com/",
  },
  {
    name: "JavaScript",
    imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg",
    docLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  {
    name: "Kubernetes",
    imgSrc: "https://raw.githubusercontent.com/devicons/devicon/master/icons/kubernetes/kubernetes-plain.svg",
    docLink: "https://kubernetes.io/docs/home/",
  },
  {
    name: "Github Actions",
    imgSrc: "https://miro.medium.com/v2/resize:fit:1400/1*7qk0-4XwCKWQO0GU5Hu39w.png",
    docLink: "https://docs.github.com/en/actions",
  },

];

const Skills = () => {
  return (
    <FullPageSection id="skills">
      <h2 className="text-4xl font-semibold mb-6">Skills</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
        {skills.map((skill) => (
          <SkillIcon key={skill.name} {...skill} />
        ))}
      </div>
    </FullPageSection>
  );
};

export default Skills;
