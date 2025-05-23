import Projects from "./Projects"
import Contact from "./Contact"
import FullPageSection from "../components/fullPageSection"
import Skills from "./Skills"

  /**
   * Home component
   * @returns {JSX.Element} Home component
   */

const Home = () => {
    return (
      <>
        {/* Hero */}
        <FullPageSection id="home">
          <h1 className="text-5xl font-bold mb-4">Hi, I'm Jochem</h1>
          <p className="text-lg max-w-xl mb-6">
            I am a software engineer passionate about building smart, sustainable tools.
          </p>

          <a href="#skills" className="flex items-center text-blue-500 hover:underline group">
            <span>Scroll down to learn more</span>
            <svg
              className="w-5 h-5 ml-2 animate-bounce transition-opacity group-hover:opacity-80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </FullPageSection>

        <Skills />

        <Projects />

        <Contact />

      </>
    );
  };

    export default Home;