import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { showToast } from '../../redux/slices/toastSlice';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDirectoriesOpen, setIsDirectoriesOpen] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showToast({ message: 'Logged out successfully', type: 'success' }));
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Logo + Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              Trikona
            </Link>

            <nav className="hidden md:flex space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>

              <div className="relative">
                <button
                  onClick={() => setIsDirectoriesOpen((open) => !open)}                  
                  className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
                >
                  Directories
                </button>

                {isDirectoriesOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-20">
                    <Link
                      to="/directory/students"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDirectoriesOpen(false)}
                    >
                      Students
                    </Link>
                    <Link
                      to="/directory/professionals"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDirectoriesOpen(false)}
                    >
                      Professionals
                    </Link>
                    <Link
                      to="/directory/corporates"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDirectoriesOpen(false)}
                    >
                      Corporate
                    </Link>
                    <Link
                      to="/directory/colleges"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDirectoriesOpen(false)}
                    >
                      Colleges
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right side: Auth */}
          <div className="flex items-center space-x-4">
            {token ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen((open) => !open)}
                  className="flex items-center text-gray-700 hover:text-indigo-600 focus:outline-none"
                >
                  <FaUserCircle className="h-8 w-8" />
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
