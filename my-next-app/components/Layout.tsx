// components/Layout.tsx
import React from 'react';
import Header from '../components/head/Header';
import Footer from '../components/foot/Footer'; // Assuming you create a Footer.tsx in components/foot

const Layout: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <>
            <Header/>
            <main>{children}</main>
            <Footer/>
        </>
    );
};

export default Layout;
