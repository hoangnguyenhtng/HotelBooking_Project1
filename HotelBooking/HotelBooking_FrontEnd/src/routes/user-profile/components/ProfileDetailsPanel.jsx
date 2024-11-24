import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Toast from 'components/ux/toast/Toast';
import ApiService from 'services/ApiService';

const ProfileDetailsPanel = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    role: '',
    fullname: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await ApiService.getUserProfile();
      if (response && response.statusCode === 200) {
        setUserDetails(response.user);
        setFormData({
          email: response.user.email || '',
          fullname: response.user.fullname || '',
          phoneNumber: response.user.phoneNumber || '',
          role: response.user.role || '',
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Có lỗi xảy ra:', error);
      setToastMessage({
        type: 'error',
        message: 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.',
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    // Reset fields to original values
    if (userDetails) {
      setFormData(prev => ({
        ...prev,
        phoneNumber: userDetails.phoneNumber || '',
        fullname: userDetails.fullname || ''
      }));
    }
  };

  const handleSaveClick = async () => {
    try {
      // Implement the API call to update the user profile
      setUserDetails({ ...userDetails, phoneNumber: formData.phoneNumber, fullname: formData.fullname });
      setIsEditMode(false);
      setToastMessage({
        type: 'success',
        message: 'Thông tin cá nhân đã được cập nhật.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setToastMessage({
        type: 'error',
        message: 'Có lỗi xảy ra khi cập nhật thông tin cá nhân.',
      });
    }
  };

  const handleChangePasswordClick = async () => {
    try {
      const passwordDetails = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      };
      const response = await ApiService.changePassword(passwordDetails);
      if (response.statusCode === 200) {
        setToastMessage({ type: 'success', message: response.message });
        // Clear password fields after successful change
        setFormData(prev => ({
          ...prev,
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        // Clear the authentication token and other related data from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('userId');
        // Redirect to login page
        window.location.href = '/login';
      } else {
        setToastMessage({ type: 'error', message: 'Error changing password' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setToastMessage({ type: 'error', message: 'Error changing password' });
    }
  };

  const clearToastMessage = () => {
    setToastMessage(null);
  };

  if (!userDetails) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg flex flex-col">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-xl leading-6 font-medium text-gray-900">
          Thông tin tài khoản
        </h3>
        <p className="mt-1 max-w-2xl text-gray-500">
          Thông tin tài khoản của bạn
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <DisplayField label="Email" value={formData.email} />
          {isEditMode ? (
            <TextField
              label="Phone number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
          ) : (
            <DisplayField label="Số điện thoại" value={formData.phoneNumber} />
          )}
          {isEditMode ? (
            <TextField
              label="Full name"
              value={formData.fullname}
              onChange={(e) => handleInputChange('fullname', e.target.value)}
            />
          ) : (
            <DisplayField label="Họ và tên" value={formData.fullname} />
          )}
          <DisplayField label="Vai trò" value={formData.role} />
        </dl>
      </div>
      <div className="flex justify-between px-4 py-3 bg-gray-50 text-right sm:px-6">
        {isEditMode ? (
          <>
            <button
              onClick={handleCancelClick}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Huỷ
            </button>
            <button
              onClick={handleSaveClick}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Lưu
            </button>
          </>
        ) : (
          <button
            onClick={handleEditClick}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sửa
          </button>
        )}
      </div>
      <div className="bg-white shadow rounded-lg flex flex-col mt-6 p-6">
        <h3 className="text-xl leading-6 font-medium text-gray-900 mb-4">
          Thay đổi mật khẩu
        </h3>
        <div className="space-y-4">
          <div className="relative">
            <TextField
              label="Mật khẩu cũ"
              type={showOldPassword ? 'text' : 'password'}
              value={formData.oldPassword}
              onChange={(e) => handleInputChange('oldPassword', e.target.value)}
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          <div className="relative">
            <TextField
              label="Mật khẩu mới"
              type={showNewPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          <div className="relative">
            <TextField
              label="Xác nhận mật khẩu mới"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          <button
            onClick={handleChangePasswordClick}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full"
          >
            Thay đổi mật khẩu
          </button>
        </div>
        {toastMessage && (
          <div className="m-2">
            <Toast
              type={toastMessage.type}
              message={toastMessage.message}
              dismissError={clearToastMessage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const DisplayField = ({ label, value }) => (
  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
  </div>
);

const TextField = ({ label, value, onChange, type = 'text' }) => (
  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 sm:mt-0 sm:col-span-2">
      <input
        type={type}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        value={value}
        onChange={onChange}
      />
    </dd>
  </div>
);

export default ProfileDetailsPanel;