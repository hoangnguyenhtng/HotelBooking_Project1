// UserProfile.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import Tabs from 'components/ux/tabs/Tabs';
import TabPanel from 'components/ux/tab-panel/TabPanel';
import {
  faAddressCard,
  faHotel,
  faCreditCard,
  faBars,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from 'contexts/AuthContext';
import PaymentMethodsPanel from './components/PaymentsMethodsPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useOutsideClickHandler from 'hooks/useOutsideClickHandler';
import { useNavigate } from 'react-router-dom';
import BookingPanel from './components/BookingPanel';
import ProfileDetailsPanel from './components/ProfileDetailsPanel';
import ApiService from 'services/ApiService';

/**
 * UserProfile
 * Renders the user profile page with tabs for personal details, bookings, and payment methods.
 * @returns {JSX.Element} - The UserProfile component
 */
const UserProfile = () => {
  const { userDetails } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const wrapperRef = useRef();
  const buttonRef = useRef();

  const [isTabsVisible, setIsTabsVisible] = useState(false);

  // Fetch user bookings data
  const [userBookingsData, setUserBookingsData] = useState({
    isLoading: true,
    data: [],
    errors: [],
  });

  // Fetch user payment methods data
  const [userPaymentMethodsData, setUserPaymentMethodsData] = useState({
    isLoading: true,
    data: [],
    errors: [],
  });

  useOutsideClickHandler(wrapperRef, (event) => {
    if (!buttonRef.current.contains(event.target)) {
      setIsTabsVisible(false);
    }
  });

  const onTabsMenuButtonAction = () => {
    setIsTabsVisible(!isTabsVisible);
  };

  // Effect to set initial state of user details
  useEffect(() => {
    if (!userDetails) {
      navigate('/login');
    }
  }, [navigate, userDetails]);

  // Effect to set initial state of user bookings data
  useEffect(() => {
    const getInitialData = async () => {
      try {
        if (!userId) {
          console.error("User ID is not available");
          setUserBookingsData({
            isLoading: false,
            data: [],
            errors: ['Không tìm thấy thông tin người dùng.'],
          });
          return;
        }

        const userBookingsDataResponse = await ApiService.getUserBookings(userId);
        console.log("User Bookings API Response:", userBookingsDataResponse);

        // Cập nhật theo cấu trúc thực tế của API
        setUserBookingsData({
          isLoading: false,
          data: userBookingsDataResponse.user?.bookings || [],
          errors: userBookingsDataResponse.errors || [],
        });

        // Tạm thời set payment methods là một mảng rỗng
        setUserPaymentMethodsData({
          isLoading: false,
          data: [],
          errors: [],
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserBookingsData({
          isLoading: false,
          data: [],
          errors: ['Có lỗi xảy ra khi tải dữ liệu người dùng.'],
        });
        setUserPaymentMethodsData({
          isLoading: false,
          data: [],
          errors: ['Có lỗi xảy ra khi tải dữ liệu người dùng.'],
        });
      }
    };

    getInitialData();
  }, [userId]);

  return (
    <>
      <div className="container mx-auto p-4 my-10 min-h-[530px]">
        <div className="mx-4">
          <button
            ref={buttonRef}
            onClick={onTabsMenuButtonAction}
            className="block md:hidden items-center px-4 py-1.5 border border-gray-300 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FontAwesomeIcon
              icon={isTabsVisible ? faXmark : faBars}
              size="lg"
            />
          </button>
        </div>
        {userBookingsData.isLoading ? (
          <div className="text-center">Đang tải danh sách đặt phòng...</div>
        ) : userBookingsData.errors.length > 0 ? (
          <div className="text-center text-red-500">
            {userBookingsData.errors.join(', ')}
          </div>
        ) : (
          <Tabs isTabsVisible={isTabsVisible} wrapperRef={wrapperRef}>
            <TabPanel label="Thông tin cá nhân" icon={faAddressCard}>
              <ProfileDetailsPanel userDetails={userDetails} />
            </TabPanel>
            <TabPanel label="Đơn đặt phòng" icon={faHotel}>
              <BookingPanel bookings={userBookingsData.data} />
            </TabPanel>
            <TabPanel label="Phương thức thanh toán" icon={faCreditCard}>
              <PaymentMethodsPanel
                userPaymentMethodsData={userPaymentMethodsData}
                setUserPaymentMethodsData={setUserPaymentMethodsData}
              />
            </TabPanel>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default UserProfile;
