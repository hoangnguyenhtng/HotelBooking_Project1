package hotel.hotelbooking.repo;

import hotel.hotelbooking.entity.Booking;
import hotel.hotelbooking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking,Long> {
    Optional<Booking> findByBookingConfirmationCode(String confirmationCode);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.user.id = :userId AND b.room.id = :roomId AND b.status = :status")
    boolean existsByUserIdAndHotelIdAndStatus(Long userId, Long roomId, BookingStatus status);
}
