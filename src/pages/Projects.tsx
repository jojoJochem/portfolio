import FullPageSection from "@/components/fullPageSection";


const projects = [
    {
      title: "Laurierboom",
      description: "A lightweight full-stack web application built with Python and JavaScript, for registering and managing participation in chess tournaments in Amsterdam.",
      link: "https://laurierboom.com",
      linkdes: "View website",
    },    {
      title: "CloudSentinel",
      description: "Implementing AIOps for Enhanced Performance Anomaly Diagnosis and Response in Distributed Cloud Applications.",
      link: "https://github.com/jojoJochem/CloudSentinel",
      linkdes: "View on GitHub",
    },
    {
      title: "TerrApp",
      description: "A Python-based automation tool that converts structured Excel data into fully formatted Word reports.",
      link: "https://terrapp-production-ff8af6601f6c.herokuapp.com",
      linkdes: "View website",
    },
  ];

const Projects = () => {
    return (
        <FullPageSection id="projects">
        <h2 className="text-4xl font-semibold mb-6">Projects</h2>
        <div className="p-4 border rounded-xl shadow hover:scale-[1.02] transition-transform">
        <div className="space-y-6">
            {projects.map((project) => (
            <div key={project.title} className="border p-4 rounded-xl shadow">
                <h3 className="font-bold text-lg">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.description}</p>
                <a
                    href={project.link}
                    target="_blank"
                    className="text-blue-500 mt-2 inline-block"
                    rel="noopener noreferrer"
                >
                    {project.linkdes} →
                </a>
                </div>
            ))}
            </div>
        </div>
        </FullPageSection>

    );
};

export default Projects;
