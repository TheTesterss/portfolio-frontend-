import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Skills from './components/Skills';
import Changelog from './components/Changelog';
import Socials from './components/Socials';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
// import { useTheme } from './contexts/ThemeContext';
// import { useLanguage } from './contexts/LanguageContext';
import { getCookieConsent, setCookieConsent } from './utils/cookieUtils';

const App: React.FC = () => {
    // const { theme } = useTheme();
    const theme = 'light';
    // const { translations } = useLanguage();
    const [showCookieConsent, setShowCookieConsent] = useState(false);
    const [canInteract, setCanInteract] = useState(false);

    useEffect(() => {
        // document.body.className = theme === 'dark' ? 'bg-gray-900 text-gray-50' : 'bg-white text-gray-900';
        document.body.className = 'bg-white text-gray-900';
    }, [theme]);

    useEffect(() => {
        const consent = getCookieConsent();
        if (consent === null) {
            setShowCookieConsent(true);
            setCanInteract(false);
        } else {
            setCanInteract(true);
        }
    }, []);

    const handleAcceptCookies = () => {
        setCookieConsent('accepted');
        setShowCookieConsent(false);
        setCanInteract(true);
    };

    const handleDeclineCookies = () => {
        setCookieConsent('declined');
        setShowCookieConsent(false);
        setCanInteract(true);
    };

    return (
        <div className={`relative min-h-screen flex flex-col ${!canInteract ? 'overflow-hidden' : ''}`}>
            {}
            {!canInteract && showCookieConsent && <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>}

            {}
            <Header />
            <Navigation />
            <main className={`flex-grow container mx-auto p-4 ${!canInteract ? 'pointer-events-none opacity-50' : ''}`}>
                <section id="skills" className="py-16">
                    <Skills />
                </section>
                <section id="changelog" className="py-16">
                    <Changelog />
                </section>
                <section id="socials" className="py-16">
                    <Socials />
                </section>
                <section id="contact" className="py-16">
                    <ContactForm />
                </section>
            </main>
            <Footer />

            {}
            {showCookieConsent && <CookieConsent onAccept={handleAcceptCookies} onDecline={handleDeclineCookies} />}
        </div>
    );
};

export default App;
