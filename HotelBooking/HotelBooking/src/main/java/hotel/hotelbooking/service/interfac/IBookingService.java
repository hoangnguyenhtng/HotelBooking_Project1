package hotel.hotelbooking.service.interfac;

import hotel.hotelbooking.dto.Response;
import hotel.hotelbooking.entity.Booking;

public interface IBookingService {
    Response saveBooking(Long roomId, Long userId, Booking bookingRequest);

    Response findBookingByConfirmationCode(String confirmationCode);

    Response getAllBookings();

    Response cancelBooking(Long bookingId);

    void sendBookingConfirmationEmail(String email, String confirmationCode);}

