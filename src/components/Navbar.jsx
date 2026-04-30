import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const baseLinkStyle = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-150";
  const activeStyle = "border-blue-500 text-gray-900";
  const inactiveStyle = "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600 tracking-tight">Team Task Manager</span>
            </div>
            <div className="hidden sm:-my-px sm:ml-8 sm:flex sm:space-x-8">
              <Link 
                to="/dashboard" 
                className={`${baseLinkStyle} ${isActive('/dashboard') ? activeStyle : inactiveStyle}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/projects" 
                className={`${baseLinkStyle} ${isActive('/projects') ? activeStyle : inactiveStyle}`}
              >
                Projects
              </Link>
              <Link 
                to="/tasks" 
                className={`${baseLinkStyle} ${isActive('/tasks') ? activeStyle : inactiveStyle}`}
              >
                Tasks
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition duration-150"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
