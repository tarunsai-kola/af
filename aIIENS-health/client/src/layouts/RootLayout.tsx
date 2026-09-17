import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function RootLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Pages that have a dark full-bleed hero section that should go under the transparent Navbar
  const isDarkHeroPage = location.pathname === '/impact' || location.pathname === '/transparency';

  return (
    <div className="flex flex-col min-h-screen bg-surface-50">
      <Navbar isDarkBackground={isDarkHeroPage} />
      <main className={`flex-1 ${isDarkHeroPage ? '' : 'pt-20'}`}>
        <Outlet />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
