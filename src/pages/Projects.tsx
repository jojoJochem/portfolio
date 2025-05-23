import FullPageSection from "@/components/fullPageSection";


const projects = [
    {
      title: "CloudSentinel",
      description: "Implementing AIOps for Enhanced Performance Anomaly Diagnosis and Response in Distributed Cloud Applications.",
      link: "https://github.com/jojoJochem/CloudSentinel",
    },

  ];

const Projects = () => {
    return (
        <FullPageSection id="projects">
        <h2 className="text-4xl font-semibold mb-6">Projects</h2>
        <div className="p-4 border rounded-xl shadow hover:scale-[1.02] transition-transform">
            {projects.map((project) => (
            <div className="space-y-6">
                <div key={project.title} className="border p-4 rounded-xl shadow">
                    <h3 className="font-bold text-lg">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <a href={project.link} target="_blank" className="text-blue-500 mt-2 inline-block">
                        View on GitHub →
                    </a>
                </div>
            </div>
            ))}
        </div>
        </FullPageSection>

    );
};

export default Projects;
