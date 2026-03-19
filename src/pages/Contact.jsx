import React from 'react';

// src/pages/Contact.jsx

const Contact = () => {
    const links = [
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/khalid-ashani-2a6a70213/' },
        { name: 'YouTube', url: 'https://www.youtube.com/@khalidashani' },
        { name: 'Instagram', url: 'https://www.instagram.com/khalidashani' },
        { name: 'TikTok', url: 'https://www.tiktok.com/@khalidashani' },
        { name: 'Threads', url: 'https://www.threads.net/@khalidashani' },
    ];

    const email = 'khalidnoorashani@gmail.com';
    const phone = '+601128451435';

    const containerStyle = {
        color: '#fbfbfbff',
        textAlign: 'center',
        color: '#ffffffff',
        padding: '40px 20px',
        maxWidth: '600px',
        margin: '0 auto',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '50px',
    };

    const listStyle = {
        listStyle: 'none',
        padding: 0,
        display: 'flex', // Changed from 'grid' to 'flex'
        flexDirection: 'row', // Ensures items go side-by-side
        flexWrap: 'wrap', // Allows them to wrap to a new line if the screen is too small
        gap: '15px', // Space between the buttons
        marginTop: 12,
        justifyContent: 'center', // Aligns items to the left (use 'center' if you prefer)
    };

    const linkStyle = {
        display: 'inline-block',
        padding: '8px 12px',
        borderRadius: 6,
        background: '#f3f4f6',
        color: '#111',
        textDecoration: 'none',
        maxWidth: '300px',
        margin: '0 auto',
        transition: 'background 0.3s, color 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
    };

    const socialStyle = {
        display: 'flex',          // Use flex to center text inside the button
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 20px',     // Slightly more padding for a better look
        borderRadius: '8px',
        background: '#f3f4f6',
        color: '#111',
        textDecoration: 'none',
        minWidth: '120px',        // Ensures buttons have a consistent size
        transition: 'background 0.3s, transform 0.2s',
        fontWeight: '500',
};

    return (
        <main style={{ ...containerStyle }}>
            <h1 >Contact</h1>
            <p>Feel free to reach out via email, phone, or one of the social links below.</p>

            <section aria-labelledby="social-heading" style={{ marginTop: 60 }}>
                <h2 id="social-heading">Social</h2>
                <ul style={listStyle}>
                    {links.map((l) => (
                        <li key={l.name}>
                            <a
                                href={l.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={socialStyle}
                                aria-label={l.name}
                            >
                                {l.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </section>

            <section aria-labelledby="contact-heading" style={{ marginTop: 60 }}>
                <h2 id="contact-heading">Direct contact</h2>
                <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                    <a href={`mailto:${email}`} style={linkStyle} aria-label="Email">
                        {email}
                    </a>
                    <a href={`tel:${phone}`} style={linkStyle} aria-label="Phone">
                        {phone}
                    </a>
                </div>
            </section>
        </main>
    );
};

export default Contact;