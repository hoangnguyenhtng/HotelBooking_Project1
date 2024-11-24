import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Toast from 'components/ux/toast/Toast';
import ApiService from 'services/ApiService';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        resetCode: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: false
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Reset error when user types
        if (errorMessage) {
            setErrorMessage('');
            setStatus(prev => ({ ...prev, error: false }));
        }
    };

    const dismissError = () => {
        setErrorMessage('');
        setStatus(prev => ({ ...prev, error: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { resetCode, newPassword, confirmPassword } = formData;

        // Validation
        if (!resetCode.trim()) {
            setErrorMessage('Vui lòng nhập mã xác thực');
            setStatus(prev => ({ ...prev, error: true }));
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Mật khẩu xác nhận không khớp');
            setStatus(prev => ({ ...prev, error: true }));
            return;
        }

        if (newPassword.length < 6) {
            setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự');
            setStatus(prev => ({ ...prev, error: true }));
            return;
        }

        setStatus(prev => ({ ...prev, loading: true, error: false }));

        try {
            const response = await ApiService.resetPassword(resetCode, newPassword);
            if (response.message) {
                setStatus({ loading: false, success: true, error: false });
                // Hiển thị thành công trước khi chuyển trang
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Mã xác thực không hợp lệ';
            setErrorMessage(errorMsg);
            setStatus({ loading: false, success: false, error: true });
            // Reset form nếu mã xác thực sai
            if (errorMsg.includes('không hợp lệ')) {
                setFormData(prev => ({ ...prev, resetCode: '' }));
            }
        }
    };

    if (status.success) {
        return (
            <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
                <div className="bg-white p-6 md:mx-auto text-center">
                    <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
                        <path
                            fill="currentColor"
                            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                        ></path>
                    </svg>
                    <h3 className="md:text-2xl text-base text-gray-700 font-semibold">
                        Đặt lại mật khẩu thành công!
                    </h3>
                    <p className="text-gray-600 mt-2">
                        Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg p-4 md:p-10 shadow-md"
            >
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-brand my-4">
                        Đặt lại mật khẩu
                    </h2>
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                name="resetCode"
                                placeholder="Nhập mã xác thực"
                                value={formData.resetCode}
                                onChange={handleInputChange}
                                className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white ${status.error ? 'border-red-500' : ''
                                    }`}
                            />
                            {status.error && (
                                <p className="text-red-500 text-xs italic mt-1 text-left">
                                    {errorMessage}
                                </p>
                            )}
                        </div>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Mật khẩu mới"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu mới"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                        />
                    </div>

                    {errorMessage && (
                        <Toast
                            type="error"
                            message={errorMessage}
                            dismissError={dismissError}
                        />
                    )}

                    <div className="mt-6 space-y-4">
                        <button
                            type="submit"
                            disabled={status.loading}
                            className={`w-full bg-brand hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${status.loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {status.loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
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
        </div>
    );
};

export default ResetPassword;