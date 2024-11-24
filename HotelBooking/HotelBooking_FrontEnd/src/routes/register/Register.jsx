import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ApiService from 'services/ApiService';

const Register = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);

  const validationSchema = Yup.object().shape({
    fullname: Yup.string()
      .required('Bạn chưa điền họ tên')
      .min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email không được để trống'),
    phoneNumber: Yup.string()
      .required('Bạn chưa điền số điện thoại')
      .matches(/^[0-9]+$/, 'Số điện thoại không hợp lệ')
      .min(10, 'Số điện thoại phải có ít nhất 10 số'),
    password: Yup.string()
      .required('Bạn chưa nhập mật khẩu')
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: Yup.string()
      .required('Bạn chưa xác nhận mật khẩu')
      .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const userPayload = {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        role: 'USER'
      };

      const response = await ApiService.registerUser(userPayload);

      if (response.statusCode === 200) {
        setToastType('success');
        setToastMessage('Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.');
        setShowToast(true);
        setRegisteredEmail(values.email);
        setShowResendForm(true);
      } else {
        setToastType('error');
        setToastMessage(response.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        setShowToast(true);
      }
    } catch (error) {
      setToastType('error');
      setToastMessage(
        error.response?.data?.message ||
        'Đã xảy ra lỗi khi đăng ký tài khoản. Vui lòng thử lại.'
      );
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await ApiService.resendVerification(registeredEmail);
      if (response.statusCode === 200) {
        setToastType('success');
        setToastMessage('Email xác thực đã được gửi lại');
      } else {
        setToastType('error');
        setToastMessage(response.message || 'Lỗi khi gửi lại email xác thực');
      }
    } catch (error) {
      setToastType('error');
      setToastMessage(error.response?.data?.message || 'Lỗi khi gửi lại email xác thực');
    }
    setShowToast(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Tạo tài khoản mới
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!showResendForm ? (
            <Formik
              initialValues={{
                fullname: '',
                email: '',
                phoneNumber: '',
                password: '',
                confirmPassword: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                      Họ và tên
                    </label>
                    <Field
                      name="fullname"
                      type="text"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.fullname && touched.fullname ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.fullname && touched.fullname && (
                      <div className="text-red-500 text-sm mt-1">{errors.fullname}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.email && touched.email ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.email && touched.email && (
                      <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <Field
                      name="phoneNumber"
                      type="tel"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.phoneNumber && touched.phoneNumber && (
                      <div className="text-red-500 text-sm mt-1">{errors.phoneNumber}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Mật khẩu
                    </label>
                    <Field
                      name="password"
                      type="password"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.password && touched.password ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.password && touched.password && (
                      <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Nhập lại mật khẩu
                    </label>
                    <Field
                      name="confirmPassword"
                      type="password"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-sm text-gray-600">
                Email xác thực đã được gửi đến email {registeredEmail}. Kiểm tra hộp thư đến hoặc thư rác để xác thực tài khoản.
              </p>
              <button
                onClick={handleResendVerification}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Gửi lại email xác thực
              </button>
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Đã có tài khoản?{' '}
                  <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Đăng nhập
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Register;