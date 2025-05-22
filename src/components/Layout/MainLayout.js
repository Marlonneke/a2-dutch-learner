import React from 'react';
import Header from './Header'; // Assuming Header is in the same Layout folder
import Footer from './Footer'; // Assuming Footer is in the same Layout folder
// You can create specific CSS module for MainLayout or use global App.css
// import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout"> {/* Referencing class from App.css or a CSS module */}
      <Header />
      <main className="site-main"> {/* Referencing class from App.css */}
        {children} {/* This is where your page content (HomePage, LessonsPage, etc.) will be rendered */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;