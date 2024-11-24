package hotel.hotelbooking.repo;

import hotel.hotelbooking.dto.ReviewMetadata;
import hotel.hotelbooking.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByHotelIdOrderByCreatedAtDesc(Long hotelId, Pageable pageable);
    Page<Review> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    boolean existsByUserIdAndHotelId(Long userId, Long hotelId);
    List<Review> findByHotelId(Long hotelId);
}
