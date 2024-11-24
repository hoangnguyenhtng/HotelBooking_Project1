package hotel.hotelbooking.service.interfac;

import hotel.hotelbooking.dto.ReviewDTO;
import hotel.hotelbooking.dto.ReviewMetadata;
import hotel.hotelbooking.dto.ReviewResponse;
import hotel.hotelbooking.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface IReviewService {
    ReviewResponse addReview(Long userId, ReviewDTO reviewDTO) throws Exception;
    ReviewResponse getReviews(Long hotelId, int page, int size);
    ReviewMetadata getReviewStats(Long hotelId);
    boolean canUserReview(Long userId, Long hotelId);
    ReviewDTO updateReview(Long userId, Long reviewId, ReviewDTO reviewDTO) throws Exception;
    void deleteReview(Long userId, Long reviewId) throws Exception;
    Page<ReviewDTO> getUserReviews(Long userId, int page, int size);
}
