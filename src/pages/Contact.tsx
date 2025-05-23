import FullPageSection from "../components/fullPageSection";

const Contact = () => {
    return (
        <FullPageSection id="contact">
        <h2 className="text-4xl font-semibold mb-6">Contact</h2>
        <p>Feel free to reach out if you want to collaborate, chat, or just say hi!</p>

        <ul className="space-y-2 text-lg">
          <li>Email: <a className="text-blue-500" href="mailto:jochem@vangaalen.org">jochem@vangaalen.org</a></li>
          <li>LinkedIn: <a className="text-blue-500" href="https://www.linkedin.com/in/jochem-van-gaalen" target="_blank">View Profile</a></li>
        </ul>
      </FullPageSection>
    );
  };

  export default Contact;
