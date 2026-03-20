import React from 'react';
import SocialCard from '../components/SocialCard'; // Adjust path if needed

// Corrected relative paths for Vite
import LinkedinImg from '../assets/images/linkedin.png'; 
import YoutubeImg from '../assets/images/youtube.png';
import InstagramImg from '../assets/images/instagram.png';
import TiktokImg from '../assets/images/tiktok.png'; // Fixed duplicate import from your file
import ThreadsImg from '../assets/images/threads.png';
import GithubImg from '../assets/images/github.png';

const Contact = () => {
    const mySocial = [
        { name: "LinkedIn", url: "https://www.linkedin.com/in/khalid-ashani-2a6a70213/", icon: LinkedinImg },
        { name: "Youtube", url: "https://www.youtube.com/@khalidashani", icon: YoutubeImg },
        { name: "Instagram", url: "https://www.instagram.com/khalidashani", icon: InstagramImg },
        { name: "Tiktok", url: "https://www.tiktok.com/@khalidashani", icon: TiktokImg },
        { name: "Threads", url: "https://www.threads.net/@khalidashani", icon: ThreadsImg },
        { name: "Github", url: "https://github.com/khalidashani", icon: GithubImg },
    ];

    const email = 'khalidnoorashani@gmail.com';
    const phone = 'Please reach out via email or social media for phone contact.';

    const containerStyle = {
        color: '#ffffff',
        textAlign: 'center',
        padding: '40px 20px',
        maxWidth: '1200px', // Wider to fit cards side-by-side
        margin: '50px auto 0 auto',
        fontFamily: 'sans-serif'
    };

    const cardContainer = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '30px',
    };

    const directContainerStyle = {
        display: 'flex',
        flexDirection: 'column', // Stacks the buttons vertically
        alignItems: 'center',    // Centers the buttons horizontally in the middle
        gap: '15px',             // Adds consistent space between the buttons
        marginTop: '20px',
        width: '100%',
    };

    const directLinkStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 24px',
        borderRadius: '8px',
        backgroundColor: "#3a3939",
        
        // --- Border Fixes ---
        border: "1px solid #ffffff", // This is the shorthand way to do it
        // Alternatively, you can use:
        // borderStyle: 'solid',
        // borderWidth: '1px',
        // borderColor: '#ffffff',
        
        color: '#ffffff',
        textDecoration: 'none',
        fontWeight: '500',
        width: '100%',
        maxWidth: '320px',
        transition: 'all 0.3s ease', // 'all' will animate the border too if you change it on hover
    };

    return (
        <main style={containerStyle}>
            <h1 style={{ textTransform: 'uppercase' }}>Contact</h1>
            <p style={{ opacity: 0.8 }}>Feel free to reach out via email, phone, or one of the social links below.</p>

            <section style={{ marginTop: 40 }}>
                <h2 style={{ letterSpacing: '1px' }}>Social Media Links</h2>
                <div style={cardContainer}>
                    {mySocial.map((social) => (
                        <SocialCard 
                            key={social.name}
                            image={social.icon}
                            title={social.name}
                            link={social.url}
                        />
                    ))}
                </div>
            </section>

            <section style={{ marginTop: 40 }}>
                <h2 style={{ textAlign: 'center' }}>Direct Contact</h2>
                <div style={directContainerStyle}>
                    <a href={`mailto:${email}`} style={directLinkStyle}>
                        {email}
                    </a>
                    <a href={`tel:${phone}`} style={directLinkStyle}>
                        {phone}
                    </a>
                </div>
            </section>
        </main>
    );
};

export default Contact;