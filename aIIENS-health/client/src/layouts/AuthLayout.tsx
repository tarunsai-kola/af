import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isDarkBackground={true} />
      
      <main 
        className="flex-1 flex pt-[72px] lg:pt-20 relative bg-cover bg-center bg-fixed"
        style={{ backgroundImage: 'url(/images/programs/medical-fundraising.jpg)' }}
      >
        <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-sm pointer-events-none" />
        
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
        
      </main>
    </div>
  );
}
