import React from 'react';
import Header from '../MasterLayout/Header/Header';
import Footer from '../MasterLayout/Footer/Footer';
import ChatWidget from './chat-widget';


const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <ChatWidget/>

      <Footer />
    </>
  );
};

export default MainLayout;
