// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={navStyle}>
      <h2 style={{ margin: 0 }}>Khalid Ashani</h2>
      <ul style={ulStyle}>
        <li style={liStyle}><Link hide to="/" style={linkStyle}>About</Link></li>
        <li style={liStyle}><Link hide to="#projects" style={linkStyle}>Projects</Link></li>
        {/* Change this from <a> to <Link> */}
        <li style={liStyle}>
          <Link to="/contact" style={linkStyle}>Contact</Link>
        </li>
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