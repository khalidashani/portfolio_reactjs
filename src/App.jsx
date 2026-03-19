import Navbar from './components/Navbar';
import ProjectCard from './components/ProjectCard';

// 1. Imports go here!
import runningImg from './assets/images/running.png';
import contactImg from './assets/images/contact.png';
import codingImg from './assets/images/coding.png';

function App() {
  const myProjects = [
    { 
      title: "Data Analytics Project", 
      description: "Built with React and Stripe.",
      image: codingImg,
      tags: ["Python", "R", "SQL", "Git"], 
      link: "#" 
    },
    { 
      title: "Running Progress", 
      description: "Real-time weather data.",
      image: runningImg, 
      tags: ["API", "Dashboard", "Strava"], 
      link: "#" 
    },
    { 
      title: "Contact", 
      description: "My contact information to get in touch",
      image: contactImg, 
      tags: ["LinkedIn", "Github", "Instagram"], 
      link: "#" 
    }
  ];

  return (
    <div style={{ 
      backgroundColor: '#1a1a1a', 
      minHeight: '100vh', 
      color: 'white', 
      fontFamily: 'sans-serif' 
      }}>
      <Navbar />
      <div style={{ padding: '40px' }}>
        <h1 id="projects" style={{ textAlign: 'center' }}>Khalid Ashani</h1>
        <div style={{ 
            display: 'flex', 
            flexDirection: 'row', // Force horizontal
            flexWrap: 'nowrap',   // Prevent them from jumping to the next line
            justifyContent: 'center', 
            alignItems: 'stretch', // Keeps all cards the same height
            overflowX: 'auto',    // Adds a scrollbar on mobile so they don't squish
            padding: '20px'
          }}>
          {myProjects.map((project, index) => (
            <ProjectCard 
              key={index}
              {...project} // Shortcut: this passes all props (title, image, etc.) at once!
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;