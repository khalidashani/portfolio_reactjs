import React from "react";

const SocialCard = ({ image, title, link }) => {
  const cardStyle = {
    width: "200px",
    backgroundColor: "#3a3939ff",
    border: "1px solid #f9f9f9ff",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    flexDirection: "column", // Forces vertical stack
    alignItems: "center", // Centers items horizontally
    textAlign: "center",
    gap: "10px",
    margin: "10px",
    transition: "transform 0.2s ease-in-out",
    cursor: "pointer",
    textDecoration: "none", // Removes underline from the whole card if wrapped
  };

  const imageStyle = {
    width: "60px",
    height: "60px",
    objectFit: "contain",
  };

  const titleStyle = {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#ffffff",
    margin: 0,
  };

  const handleStyle = {
    fontSize: "0.85rem",
    color: "#9ca3af", // Subtle gray
    margin: 0,
  };

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={cardStyle}
      onMouseOver={(e) =>
        (e.currentTarget.style.transform = "translateY(-5px)")
      }
      onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* Line 1: Image */}
      <img src={image} alt={title} style={imageStyle} />

      {/* Line 2: Name */}
      <h3 style={titleStyle}>{title}</h3>

      {/* Line 3: Handle */}
      <p style={handleStyle}>@khalidashani</p>
    </a>
  );
};

export default SocialCard;
