// src/components/Navbar.jsx

function Navbar() {
  return (
    <nav style={navStyle}>
      <h2 style={{ margin: 0 }}>Khalid Ashani</h2>
      <ul style={ulStyle}>
        <li style={liStyle}><a href="#about" style={linkStyle}>About</a></li>
        <li style={liStyle}><a href="#projects" style={linkStyle}>Projects</a></li>
        <li style={liStyle}><a href="#contact" style={linkStyle}>Contact</a></li>
      </ul>
    </nav>
  );
}

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 40px',
  backgroundColor: '#333',
  color: 'white',
};

const ulStyle = {
  display: 'flex',
  listStyle: 'none',
  gap: '20px',
  margin: 0
};

const liStyle = { cursor: 'pointer' };
const linkStyle = { color: 'white', textDecoration: 'none' };

export default Navbar;