import React from 'react';
import { format, differenceInDays } from 'date-fns';
import ApiService from 'services/ApiService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingPanel = ({ bookings, onCancelBooking, onReviewBooking }) => {
  const getRandomNumber = () => {
    return Math.floor(Math.random() * 90 + 10); // Tạo số ngẫu nhiên từ 10 đến 99
  };

  const handleCancelBooking = async (booking) => {
    const today = new Date();
    const checkInDate = new Date(booking.checkInDate);
    const daysDifference = differenceInDays(checkInDate, today);

    if (daysDifference >= 2) {
      const confirmCancel = window.confirm('Quý khách có chắc chắn muốn hủy phòng này không?');
      if (confirmCancel) {
        try {
          await ApiService.cancelBooking(booking.id);
          onCancelBooking(booking.id);
          toast.success('Hủy phòng thành công!');
        } catch (error) {
          console.error('Error cancelling booking:', error);
          toast.error('Có lỗi xảy ra khi hủy phòng. Vui lòng thử lại sau.');
        }
      }
    } else {
      toast.error('Quý khách không thể hủy phòng do điều khoản đặt phòng. Vui lòng liên hệ nhà cung cấp dịch vụ để được giải đáp!');
    }
  };

  const handleReviewBooking = (booking) => {
    const today = new Date();
    const checkOutDate = new Date(booking.checkOutDate);

    if (checkOutDate >= today) {
      toast.error('Bạn chưa trả phòng, chưa thể đánh giá');
    } else {
      onReviewBooking(booking.id);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ToastContainer />
      <ul className="divide-y divide-gray-200">
        {bookings.length === 0 ? (
          <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
            Không có đặt phòng nào.
          </li>
        ) : (
          bookings.map((booking) => (
            <li key={booking.id} className="bg-white hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6 flex flex-col md:flex-row">
                {/* Hình ảnh phòng */}
                <div className="flex-shrink-0">
                  <img
                    className="h-24 w-24 rounded-md object-cover"
                    src={booking.room.roomPhotoUrl}
                    alt={`${booking.room.roomType} Room`}
                  />
                </div>
                {/* Thông tin đặt phòng */}
                <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-brand truncate">
                      Phòng {booking.room.roomType}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Mã đặt phòng: {booking.bookingConfirmationCode}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Số phòng: {booking.room.id}{getRandomNumber()}
                  </p>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Nhận phòng: {format(new Date(booking.checkInDate), 'dd/MM/yyyy')}
                      </p>
                      <p className="flex items-center text-sm text-gray-500 sm:ml-6">
                        Trả phòng: {format(new Date(booking.checkOutDate), 'dd/MM/yyyy')}
                      </p>
                      <p className="flex items-center text-sm text-gray-500 sm:ml-6">
                        Khách: {booking.numOfAdults} Người lớn, {booking.numOfChildren} Trẻ em
                      </p>
                    </div>
                    <div className="mt-2 flex flex-col items-end text-sm text-gray-500 sm:mt-0">
                      <p>
                        <span className="font-medium">Giá phòng: </span>{booking.room.roomPrice.toFixed(2)} VND/đêm
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {booking.room.roomDescription}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <button
                      onClick={() => handleCancelBooking(booking)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition duration-300"
                    >
                      Hủy phòng
                    </button>
                    <button
                      onClick={() => handleReviewBooking(booking)}
                      className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300"
                    >
                      Đánh giá
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default BookingPanel;