import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mx-auto w-full">
          {children}
        </div>
      </main>
      <footer className="mt-auto py-6 text-center text-sm text-gray-600">
        <p> {new Date().getFullYear()} Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
