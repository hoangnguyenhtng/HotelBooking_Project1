import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ApiService from 'services/ApiService';
import { AuthContext } from 'contexts/AuthContext';
import Toast from 'components/ux/toast/Toast';
import { LOGIN_MESSAGES } from 'utils/constants';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import biểu tượng từ react-icons

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerAuthCheck } = useContext(AuthContext);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Thêm state để quản lý hiển thị mật khẩu

  const from = location.state?.from?.pathname || '/home';

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errorMessage) setErrorMessage('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      setLoading(true);
      const response = await ApiService.loginUser(loginData);

      console.log('Login response:', response);

      if (response.statusCode === 200) {
        if (!response.token || !response.id) {
          console.error('Login response is missing token or id');
          setErrorMessage('Đăng nhập thất bại: Thông tin không hợp lệ.');
          return;
        }

        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('tokenExpiration', response.expirationTime);
        localStorage.setItem('userId', response.id.toString());

        console.log('Local storage after login:', {
          token: !!localStorage.getItem('token'),
          userId: localStorage.getItem('userId'),
          role: localStorage.getItem('role')
        });
        // Trigger auth context update
        triggerAuthCheck();

        // Clear any previous error messages
        setErrorMessage('');

        // Navigate to the intended page
        navigate(from, { replace: true });
      } else {
        // Luôn hiển thị thông báo lỗi chung khi đăng nhập thất bại
        setErrorMessage('Email hoặc mật khẩu sai, vui lòng kiểm tra lại!');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Luôn hiển thị thông báo lỗi chung khi có lỗi trong quá trình đăng nhập
      setErrorMessage('Email hoặc mật khẩu sai, vui lòng kiểm tra lại!');
    } finally {
      setLoading(false);
    }
  };

  const dismissError = () => {
    setErrorMessage('');
  };

  // Hàm để toggle hiển thị mật khẩu
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div className="login__form">
        <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
          <form
            onSubmit={handleLoginSubmit}
            className="w-full max-w-lg p-4 md:p-10 shadow-md"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-brand">
                Chào mừng trở lại!
              </h2>
              <p className="text-gray-500">
                Đăng nhập để tiếp tục sử dụng dịch vụ của chúng tôi.
              </p>
            </div>
            <div className="mb-6 relative">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleInputChange}
                autoComplete="username"
                disabled={loading}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              />
            </div>
            <div className="mb-6 relative">
              <input
                type={showPassword ? 'text' : 'password'} // Thay đổi loại input dựa trên trạng thái showPassword
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                disabled={loading}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white pr-10" // Thêm padding bên phải để dành chỗ cho biểu tượng
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-600" />
                ) : (
                  <FaEye className="text-gray-600" />
                )}
              </span>
            </div>
            {errorMessage && (
              <Toast
                type="error"
                message={errorMessage}
                dismissError={dismissError}
              />
            )}
            <div className="items-center">
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-brand hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </div>
              <div className="flex flex-wrap justify-center my-3 w-full">
                <Link
                  to="/forgot-password"
                  className="inline-block align-baseline text-md text-gray-500 hover:text-blue-800 text-right"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-0 right-0 flex justify-center items-center">
                  <div className="border-t w-full absolute"></div>
                  <span className="bg-white px-3 text-gray-500 z-10">
                    Chưa có tài khoản?{' '}
                    <Link
                      to="/register"
                      className="inline-block align-baseline font-medium text-md text-brand hover:text-blue-800 text-right"
                    >
                      Đăng ký ngay
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
