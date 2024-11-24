import { useState } from 'react';
import { Link } from 'react-router-dom';
import validations from 'utils/validations';
import Toast from 'components/ux/toast/Toast';
import ApiService from 'services/ApiService';

 const ForgotPassword = () => {
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const dismissError = () => {
    setErrorMessage('');
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    if (validations.validate('email', email)) {
      try {
        console.log(email);
        const response = await ApiService.forgotPassword(email);
        console.log(response);
        if (response.message) {
          setSuccess(true);
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Email không tồn tại trong hệ thống');
      }
    } else {
      setErrorMessage('Email không hợp lệ');
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
      {success ? (
        <div className="bg-white p-6 md:mx-auto">
          <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
            <path
              fill="currentColor"
              d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
            ></path>
          </svg>
          <div className="text-center">
            <h3 className="md:text-2xl text-base text-gray-700 font-semibold text-center">
              Mã xác thực đã được gửi!
            </h3>
            <p className="text-gray-600 mt-2">
              Vui lòng kiểm tra email của bạn (bao gồm cả thư mục spam)
            </p>
            <div className="py-6 space-y-4">
              <Link
                to="/reset-password"
                className="px-12 bg-brand hover:bg-indigo-500 text-white font-semibold py-3 block"
              >
                Đặt lại mật khẩu
              </Link>
              <Link
                to="/"
                className="px-12 text-brand hover:text-indigo-500 font-semibold block"
              >
                Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleForgotSubmit}
          className="w-full max-w-lg p-4 md:p-10 shadow-md"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-brand my-4">
              Quên mật khẩu
            </h2>
            <div className="mb-6">
              <input
                type="email"
                name="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={handleInputChange}
                autoComplete="email"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              />
              <p className="text-gray-700">
                Chúng tôi sẽ gửi mã xác thực đến email này nếu tài khoản tồn tại.
              </p>
            </div>
            {errorMessage && (
              <Toast
                type="error"
                message={errorMessage}
                dismissError={dismissError}
              />
            )}
            <div className="flex-wrap items-center justify-between">
              <button
                type="submit"
                className="w-full bg-brand hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Gửi mã xác thực
              </button>
              <div className="mt-5">
                <Link
                  to="/login"
                  className="inline-block align-baseline text-lg text-gray-500 hover:text-blue-800"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
