import { Routes, Route } from 'react-router-dom'; // MISSING IMPORT
import Navbar from './components/Navbar';
import ProjectCard from './components/ProjectCard';
import Contact from './pages/Contact';
import Running from './pages/Running';

import runningImg from './assets/images/running.png';
import contactImg from './assets/images/contact.png';
import codingImg from './assets/images/coding.png';

function App() {
  const myProjects = [
    { 
      title: "Data Analytics Project 🚧", 
      description: "Built with React and Stripe.",
      image: codingImg,
      tags: ["Python", "R", "SQL", "Git"], 
      link: "https://github.com/khalidashani/Python" 
    },
    { 
      title: "Running Progress 🚧", 
      description: "Real-time running progress data.",
      image: runningImg, 
      tags: ["API", "Dashboard", "Strava"], 
      link: "/running" 
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
    <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      <Navbar />
      
      <Routes>
        {/* HOME PAGE: Shows the Projects */}
        <Route path="/" element={
          <div style={{ padding: '40px' }}>
            <h1 id="projects" style={{ textAlign: 'center' }}>Khalid Ashani</h1>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                flexWrap: 'nowrap',   
                justifyContent: 'center', 
                alignItems: 'stretch', 
                overflowX: 'auto',    
                padding: '20px'
              }}>
              {myProjects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </div>
        } />

        {/* RUNNING PAGE: Shows only the Running component */}  
        <Route path="/running" element={<Running />} />

        {/* CONTACT PAGE: Shows only the Contact component */}
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;