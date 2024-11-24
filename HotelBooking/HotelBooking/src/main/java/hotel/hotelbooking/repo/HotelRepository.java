package hotel.hotelbooking.repo;

import hotel.hotelbooking.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByCityId(Long cityId);
    Hotel findHotelById(Long hotelId);
    @Modifying
    @Query("UPDATE Hotel h SET h.averageRating = :rating, h.totalReviews = :totalReviews WHERE h.id = :hotelId")
    void updateHotelStats(@Param("hotelId") Long hotelId,
                          @Param("rating") Double rating,
                          @Param("totalReviews") Long totalReviews);
}
