import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';

const EmailVerification = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState({
        status: 'loading',
        message: 'Đang xác thực email của bạn...'
    });
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await ApiService.verifyEmail(token);
                if (response.statusCode === 200) {
                    setVerificationStatus({
                        status: 'success',
                        message: 'Xác thực email thành công!'
                    });

                    // Start countdown timer
                    let timeLeft = 5;
                    const timer = setInterval(() => {
                        timeLeft -= 1;
                        setCountdown(timeLeft);

                        if (timeLeft === 0) {
                            clearInterval(timer);
                            navigate('/login');
                        }
                    }, 1000);

                } else {
                    setVerificationStatus({
                        status: 'error',
                        message: response.message || 'Xác thực thất bại'
                    });
                }
            } catch (error) {
                setVerificationStatus({
                    status: 'error',
                    message: error.response?.data?.message || 'Xác thực thất bại. Vui lòng thử lại.'
                });
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Xác Thực Email
                    </h2>

                    {verificationStatus.status === 'loading' && (
                        <div className="flex justify-center mb-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                        </div>
                    )}

                    {verificationStatus.status === 'success' && (
                        <div className="mb-4">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium text-green-600 mb-2">
                                {verificationStatus.message}
                            </p>
                            <p className="text-sm text-gray-500">
                                Tự động chuyển đến trang đăng nhập sau {countdown} giây...
                            </p>
                        </div>
                    )}

                    {verificationStatus.status === 'error' && (
                        <div className="mb-4">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <p className="text-sm text-red-600">
                                {verificationStatus.message}
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Đến trang đăng nhập
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;