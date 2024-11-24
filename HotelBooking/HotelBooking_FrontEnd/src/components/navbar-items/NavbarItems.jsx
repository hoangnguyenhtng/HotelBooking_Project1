import { Link, useNavigate, useLocation } from 'react-router-dom';
import DropdownButton from 'components/ux/dropdown-button/DropdownButton';
import { useContext } from 'react';
import { AuthContext } from 'contexts/AuthContext';
import ApiService from 'services/ApiService';

/**
 * A component that renders the navigation items for the navbar for both mobile/desktop view.
 *
 * @param {Object} props - The component's props.
 * @param {Function} props.onHamburgerMenuToggle - Callback to toggle mobile menu
 */
const NavbarItems = ({ onHamburgerMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, triggerAuthCheck } = useContext(AuthContext);
  const isAdmin = ApiService.isAdmin();
  const isUser = ApiService.isUser();

  /**
   * Handles the logout action by calling the logout API and updating the authentication state.
   */
  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('userId');

      // Update auth context
      await triggerAuthCheck();

      // Close mobile menu if open
      if (onHamburgerMenuToggle) {
        onHamburgerMenuToggle();
      }

      // Navigate after context is updated
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, we should still clear local state
      localStorage.clear();
      await triggerAuthCheck();
      navigate('/login');
    }
  };

  const dropdownOptions = [
    {
      name: 'Thông tin',
      onClick: () => {
        navigate('/user-profile');
        if (onHamburgerMenuToggle) onHamburgerMenuToggle();
      }
    },
    {
      name: 'Đăng xuất',
      onClick: handleLogout
    },
  ];

  /**
   * Determines if a given path is the current active path.
   *
   * @param {string} path - The path to check.
   * @returns {boolean} - True if the path is active, false otherwise.
   */
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigationClick = (path) => {
    if (onHamburgerMenuToggle) {
      onHamburgerMenuToggle();
    }
  };

  return (
    <>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to="/"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/') && 'active-link'
            }`}
          onClick={() => handleNavigationClick('/home')}
        >
          Trang chủ
        </Link>
      </li>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to="/hotels"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/hotels') && 'active-link'
            }`}
          onClick={() => handleNavigationClick('/hotels')}
        >
          Khách sạn
        </Link>
      </li>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to="/blog"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/blog') && 'active-link'}`}
          onClick={() => handleNavigationClick('/blog')}
        >
          Blog
        </Link>
      </li>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to="/about-us"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/about-us') && 'active-link'
            }`}
          onClick={() => handleNavigationClick('/about-us')}
        >
          Liên hệ
        </Link>
      </li>
      {isAdmin && !isUser && (
        <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
          <Link
            to="/admin"
            className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/admin') && 'active-link'
              }`}
            onClick={() => handleNavigationClick('/admin')}
          >
            Admin
          </Link>
        </li>
      )}
      <li
        className={`${!isAuthenticated && 'p-4 hover:bg-blue-900 md:hover:bg-brand'}`}
      >
        {isAuthenticated ? (
          <DropdownButton
            triggerType="click"
            options={dropdownOptions}
          />
        ) : (
          <Link
            to="/login"
            className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/login') && 'active-link'
              }`}
            onClick={() => handleNavigationClick('/login')}
          >
            Đăng nhập/Đăng kí
          </Link>
        )}
      </li>
    </>
  );
};

export default NavbarItems;