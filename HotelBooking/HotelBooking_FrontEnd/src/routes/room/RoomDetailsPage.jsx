import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import DateRangePicker from 'components/ux/data-range-picker/DateRangePicker';
import ApiService from 'services/ApiService';
import 'react-datepicker/dist/react-datepicker.css';
import './RoomDetailsPage.css';

const RoomDetailsPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);
  const [selectedAdults, setSelectedAdults] = useState({ value: 1, label: '1 người lớn' });
  const [selectedChildren, setSelectedChildren] = useState({ value: 0, label: '0 trẻ em' });
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalGuests, setTotalGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // State để điều khiển modal


  // Generate a random room number between 01 and 20
  const [roomNumber] = useState(() => `${roomId}-${Math.floor(Math.random() * 20 + 1).toString().padStart(2, '0')}`);
  // Example hotel name and city
  const hotelName = "Hanoi Pearl Hotel";
  const city = "Hà Nội";

  // Room services options
  const roomServicesOptions = [
    { value: '1 giường', label: 'Thêm 1 giường' },
    { value: '2 giường', label: 'Thêm 2 giường' },
    { value: '1 tủ', label: 'Thêm 1 tủ lạnh' },
    { value: '2 tủ', label: 'Thêm 1 tủ lạnh và 1 tủ đồ' },
    { value: 'Hàng cồng kềnh', label: 'Hàng cồng kềnh cần vận chuyển (>80kg)' },
    { value: 'Dịch vụ đặc biệt', label: 'Dịch vụ đặc biệt' },
    { value: 'Chuẩn bị nước nóng, máy lạnh/ máy sưởi trước', label: 'Chuẩn bị nước nóng, máy lạnh/ máy sưởi trước' },
    { value: 'Dịch vụ giặt ủi', label: 'Dịch vụ giặt ủi' },
    { value: 'Chuẩn bị đồ ăn nhẹ ngay khi đến', label: 'Chuẩn bị đồ ăn nhẹ ngay khi đến' },
  ];
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getRoomById(roomId);
        setRoomDetails(response.room);
        const totalPrice = response.room.roomPrice;
        const userProfile = await ApiService.getUserProfile();
        setTotalPrice(totalPrice);
        setUserId(userProfile.user.id);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [roomId]);

  const numberOfSelectedServices = selectedServices.length;

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handleConfirmBooking = async () => {
    if (!dateRange[0].startDate || !dateRange[0].endDate) {
      setErrorMessage('Mời chọn ngày check-in và check-out.');
      return;
    }

    try {
      const bookingData = {
        checkInDate: dateRange[0].startDate.toISOString().split('T')[0],
        checkOutDate: dateRange[0].endDate.toISOString().split('T')[0],
        numAdult: selectedAdults.value.toString(),
        numChild: selectedChildren.value.toString(),
        services: selectedServices.map(service => service.value),
      };

      const response = await ApiService.bookRoom(roomId, userId, bookingData);

      if (response) {
        setConfirmationCode(response.bookingConfirmationCode);
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          navigate('/home');
        }, 10000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Phát sinh lỗi khi xác nhận đặt phòng. Vui lòng thử lại.');
    }
  };

  const dismissError = () => {
    setErrorMessage('');
  };

  const onDateChangeHandler = (ranges) => {
    setDateRange([ranges.selection]);
  };

  

  const adultOptions = Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: `${i + 1} người lớn` }));
  const childrenOptions = Array.from({ length: 5 }, (_, i) => ({ value: i, label: `${i} trẻ em` }));

  if (isLoading) {
    return <p className='room-detail-loading'>Đang tải chi tiết phòng...</p>;
  }

  if (error) {
    return <p className='room-detail-loading'>{error}</p>;
  }

  if (!roomDetails) {
    return <p className='room-detail-loading'>Không tìm thấy phòng.</p>;
  }

  const { roomType, roomPrice, roomPhotoUrl, roomDescription, bookings } = roomDetails;

  return (
    <div className="room-details-container">
      {showMessage && (
        <p className="booking-success-message">
          Đặt phòng thành công! Mã đặt phòng của bạn là: {confirmationCode}. Một email chứa thông tin về mã đặt phòng, thông tin đặt phòng và mã QR được gửi đến cho bạn qua email.
        </p>
      )}
      {errorMessage && (
        <p className="error-message">
          {errorMessage}
        </p>
      )}
      <h2 className="room-details-title">Chi tiết phòng</h2>
      <div className="room-details-grid">
        <div className="room-details-left">
          <img src={roomPhotoUrl} alt={roomType} className="room-details-image" />
          <div className="room-details-info">
            <h3>{roomType}</h3>
            <p>Số phòng (Số tầng - Số phòng): {roomNumber}</p>
            <p>Khách sạn: {hotelName}</p>
            <p>Thành phố: {city}</p>
            <p>Giá phòng từ: {roomPrice} VND một đêm</p>
            <p>{roomDescription}</p>
          </div>
          {bookings && bookings.length > 0 && (
            <div>
              <h3>Các đơn đặt phòng gần đây:</h3>
              <ul className="booking-list">
                {bookings.map((booking, index) => (
                  <li key={booking.id} className="booking-item">
                    <span className="booking-number">Đơn đặt phòng {index + 1} </span>
                    <span className="booking-text">Check-in: {booking.checkInDate} </span>
                    <span className="booking-text">Check-out: {booking.checkOutDate}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="room-details-right">
          <div className="booking-info">
            <div className="mb-4">
              <div className="font-semibold text-gray-800">Ngày Check-in & Check-out</div>
              <DateRangePicker
                isDatePickerVisible={showDatePicker}
                onDatePickerIconClick={() => setShowDatePicker(!showDatePicker)}
                onDateChangeHandler={onDateChangeHandler}
                setisDatePickerVisible={setShowDatePicker}
                dateRange={dateRange}
                inputStyle="DARK"
              />
            </div>
            <div className="mb-4">
              <div className="font-semibold text-gray-800 mb-2">Số lượng khách dự tính: </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm mb-1">Người lớn</label>
                <Select
                  value={selectedAdults}
                  onChange={setSelectedAdults}
                  options={adultOptions}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">Trẻ nhỏ</label>
                <Select
                  value={selectedChildren}
                  onChange={setSelectedChildren}
                  options={childrenOptions}
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-gray-800">Các dịch vụ của khách sạn</div>
              <Select
                isMulti
                value={selectedServices}
                onChange={setSelectedServices}
                options={roomServicesOptions}
              />
            </div>
            <div className="total-price">
              <p>Tổng số tiền dự kiến: </p> <p>{totalPrice + 95000 * selectedServices.length} VND</p>
              <p>Tổng số khách: {selectedAdults.value + selectedChildren.value}</p>
              {/* Link để mở điều khoản */}
              <div className="terms-link">
                <a href="#" onClick={handleToggleModal}>
                  Điều khoản đặt phòng (Vui lòng đọc kỹ trước khi đặt phòng)
                </a>
              </div>

              {/* Modal */}
              {showModal && (
                <div className="modal-overlay" onClick={handleToggleModal}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h3>Điều khoản đặt phòng</h3>
                    <p>
                      Từ ngày 20/11/2024, để đảm bảo tính bảo mật cho thông tin khách hàng, chúng tôi ngừng trung gian thông tin
                      khách hàng đặt phòng cho phía khách sạn. Quý khách vui lòng thanh toán trước khoản phí 300.000 VND để hoàn tất
                      thủ tục giữ phòng. Sau khi hoàn tất mọi giao dịch phòng, khi check-out quý khách sẽ nhận được 5% khuyến mãi
                      hóa đơn và nhận lại số dư nếu có từ phía khách sạn! Mọi thông tin thắc mắc vui lòng liên hệ hotline 0987654321
                      để được giải đáp thắc mắc!
                    </p>
                    <button onClick={handleToggleModal} className="close-modal">
                      Đóng
                    </button>
                  </div>
                </div>
              )}
              <button onClick={handleConfirmBooking} className="accept-booking">Xác nhận đặt phòng</button>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  );
};

export default RoomDetailsPage;