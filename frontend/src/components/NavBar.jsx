import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, Search, Map, Home, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function NavBar() {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'முகப்பு', icon: Home, path: '/home' },
    { label: 'தேடல்', icon: Search, path: '/search' },
    { label: 'என் பயணங்கள்', icon: Map, path: '/account?tab=bookings' },
  ];

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className="hidden md:flex sticky top-0 z-50 w-full bg-slate-900/90 backdrop-blur-md text-white border-b border-white/10 shadow-lg h-16 items-center px-8 transition-all duration-300">
        {/* Left Section: Logo */}
        <div className="flex-1">
          <Link to="/home" className="text-2xl font-bold font-sans tracking-tight hover:text-blue-400 transition-colors">
            நம்ம யாத்திரை
          </Link>
        </div>

        {/* Center Section: Main Navigation Links */}
        <div className="flex-[2] flex justify-center space-x-10">
          {isAuthenticated && navItems.map((item) => (
            <Link key={item.label} to={item.path} className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors font-medium group">
              <item.icon size={20} className="group-hover:scale-110 group-hover:text-blue-400 transition-all duration-300" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Right Section: My Account & Logout */}
        <div className="flex-1 flex justify-end items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link to="/account" className="flex items-center space-x-3 hover:opacity-80 transition group">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md transform group-hover:scale-105 transition-all">
                  {user?.username?.charAt(0) || 'ந'}
                </div>
                <span className="font-semibold hidden lg:block text-slate-200 group-hover:text-white">கணக்கு</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="bg-slate-800 text-slate-300 p-2.5 rounded-full hover:bg-slate-700 hover:text-red-400 transition-all shadow-sm border border-slate-700 flex items-center justify-center"
                title="வெளியேறு"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white px-5 py-2 rounded-full font-bold shadow-md transition-all transform hover:-translate-y-[1px]">உள்நுழை</Link>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <nav className="md:hidden fixed bottom-0 z-50 w-full bg-slate-900/95 backdrop-blur-md shadow-[0_-10px_40px_rgba(0,0,0,0.2)] h-16 flex items-center justify-around text-slate-400 border-t border-slate-800">
          {navItems.map((item) => (
            <Link key={item.label} to={item.path} className="flex flex-col items-center justify-center w-full h-full hover:text-blue-400 active:text-blue-400 focus:text-blue-400 transition-colors">
              <item.icon size={22} className="mb-1" />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
