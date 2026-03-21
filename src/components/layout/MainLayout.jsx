import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';

export function MainLayout({ products }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header products={products} />
      <main className="flex-grow bg-white">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
