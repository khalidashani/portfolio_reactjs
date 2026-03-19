// ... (Imports removed as discussed)

function ProjectCard({ title, description, image, tags, link }) {
  return (
    <div style={cardStyle}>
      <h3 style={textStyle}>{title}</h3>
      
      <p style={{ ...textStyle, fontSize: '14px', opacity: 0.8, lineHeight: '1.4' }}>
        {description}
      </p>

      <div style={{ ...imageContainer, marginTop: '10px' }}>
        <img src={image} alt={title} style={imageStyle} />
      </div>  

      <div style={{ ...tagContainer, marginTop: '20px' }}>
        {tags.map((tag, index) => (
          <span key={index} style={tagStyle}>{tag}</span>
        ))}
      </div>
      
      <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: '10px' }}>
        <a href={link} target="_blank" rel="noreferrer" style={linkStyle}>
          {title}
        </a>
      </div>
    </div>
  );
}

const textStyle = { margin: 0, textAlign: 'center' };

const cardStyle = {
  width: '300px',
  minHeight: '300px', // Changed from height to minHeight
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  gap: '16px', 
  color: '#fbfbfbff',
  border: '1px solid #ffffff5a',
  borderRadius: '12px',
  padding: '24px',
  margin: '15px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
  backgroundColor: '#323232ff'
};

const imageContainer = {
  width: '100%',
  height: '110px', 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  borderRadius: '8px',
  margin: '0' // Removed manual margin
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const tagContainer = { 
  display: 'flex', 
  gap: '8px', 
  justifyContent: 'center', 
  flexWrap: 'wrap',
  margin: '0 10px' // Removed manual margin
};

const tagStyle = { 
  background: '#4a4a4aff', 
  color: '#fbfbfbff',
  padding: '4px 10px', 
  borderRadius: '20px', 
  fontSize: '11px',
  fontWeight: '600',
  border: '1px solid #ffffff22'
};

const linkStyle = { 
  color: '#ffffffff', 
  textDecoration: 'none', 
  fontWeight: 'bold',
  fontSize: '14px',
  borderBottom: '1px solid white' // Adds a nice underline effect
};

export default ProjectCard;