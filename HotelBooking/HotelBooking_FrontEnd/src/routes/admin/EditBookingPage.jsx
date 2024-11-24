import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from 'services/ApiService';


const EditBookingPage = () => {
    const navigate = useNavigate();
    const { bookingCode } = useParams();
    const [bookingDetails, setBookingDetails] = useState(null); // State variable for booking details
    const [error, setError] = useState(null); // Track any errors
    const [success, setSuccessMessage] = useState(null); // Track any errors



    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await ApiService.getBookingByConfirmationCode(bookingCode);
                setBookingDetails(response.booking);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchBookingDetails();
    }, [bookingCode]);


    const acheiveBooking = async (bookingId) => {
        if (!window.confirm('Bạn có muốn hủy bỏ đặt phòng này không?')) {
            return; // Do nothing if the user cancels
        }

        try {
            const response = await ApiService.cancelBooking(bookingId);
            if (response.statusCode === 200) {
                setSuccessMessage("Đơn đặt đã hủy bỏ thành công")
                
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/admin/manage-bookings');
                }, 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="find-booking-page">
            <h2>Chi tiết đặt phòng</h2>
            {error && <p className='error-message'>{error}</p>}
            {success && <p className='success-message'>{success}</p>}
            {bookingDetails && (
                <div className="booking-details">
                    <h3>Chi tiết đặt phòng</h3>
                    <p>Mã xác nhận: {bookingDetails.bookingConfirmationCode}</p>
                    <p>Ngày Check-in: {bookingDetails.checkInDate}</p>
                    <p>Ngày Check-out: {bookingDetails.checkOutDate}</p>
                    <p>Số người lớn: {bookingDetails.numOfAdults}</p>
                    <p>Số trẻ nhỏ: {bookingDetails.numOfChildren}</p>
                    <p>Email của khách: {bookingDetails.guestEmail}</p>

                    <br />
                    <hr />
                    <br />
                    <h3>Chi tiết người đặt</h3>
                    <div>
                        <p> Họ và tên: {bookingDetails.user.name}</p>
                        <p> Email: {bookingDetails.user.email}</p>
                        <p> Số điện thoại: {bookingDetails.user.phoneNumber}</p>
                    </div>

                    <br />
                    <hr />
                    <br />
                    <h3>Chi tiết phòng</h3>
                    <div>
                        <p> Phòng số: 103</p>
                        <p> Loại phòng: {bookingDetails.room.roomType}</p>
                        <p> Giá phòng: {bookingDetails.room.roomPrice}VND</p>
                        <p> Mô tả phòng: {bookingDetails.room.roomDescription}</p>
                        <img src={bookingDetails.room.roomPhotoUrl} alt="" sizes="" srcSet="" />
                    </div>
                    <button
                        className="acheive-booking"
                        onClick={() => acheiveBooking(bookingDetails.id)}>Bỏ đặt phòng
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditBookingPage;
