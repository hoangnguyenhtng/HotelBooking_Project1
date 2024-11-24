package hotel.hotelbooking.service.impl;

import hotel.hotelbooking.dto.PageInfo;
import hotel.hotelbooking.dto.ReviewDTO;
import hotel.hotelbooking.dto.ReviewMetadata;
import hotel.hotelbooking.dto.ReviewResponse;
import hotel.hotelbooking.entity.BookingStatus;
import hotel.hotelbooking.entity.Hotel;
import hotel.hotelbooking.entity.Review;
import hotel.hotelbooking.entity.User;
import hotel.hotelbooking.repo.BookingRepository;
import hotel.hotelbooking.repo.HotelRepository;
import hotel.hotelbooking.repo.ReviewRepository;
import hotel.hotelbooking.repo.UserRepository;
import hotel.hotelbooking.service.interfac.IReviewService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ReviewService implements IReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;

    @Override
    public ReviewResponse addReview(Long userId, ReviewDTO reviewDTO) throws Exception {
        log.debug("Adding review for hotel {} by user {}", reviewDTO.getHotelId(), userId);

        if (!canUserReview(userId, reviewDTO.getHotelId())) {
            throw new BadRequestException("You can only review hotels you have completed staying at");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        Hotel hotel = hotelRepository.findById(reviewDTO.getHotelId())
                .orElseThrow(() -> new Exception("Hotel not found"));

        Review review = Review.builder()
                .user(user)
                .hotel(hotel)
                .rating(reviewDTO.getRating())
                .review(reviewDTO.getReview())
                .verified(true)
                .build();

        review = reviewRepository.save(review);
        calculateAndUpdateHotelRating(hotel.getId());

        return getReviews(hotel.getId(), 1, 10);
    }

    @Override
    public ReviewResponse getReviews(Long hotelId, int page, int size) {
        log.debug("Fetching reviews for hotel {} page {} size {}", hotelId, page, size);

        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Review> reviewPage = reviewRepository.findByHotelIdOrderByCreatedAtDesc(hotelId, pageable);

        List<ReviewDTO> reviews = reviewPage.getContent().stream()
                .map(this::mapToReviewDTO)
                .collect(Collectors.toList());

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        ReviewMetadata metadata = ReviewMetadata.builder()
                .averageRating(hotel.getAverageRating())
                .totalReviews(hotel.getTotalReviews())
                .build();

        return ReviewResponse.builder()
                .data(reviews)
                .metadata(metadata)
                .pagination(PageInfo.builder()
                        .currentPage(page)
                        .totalPages(reviewPage.getTotalPages())
                        .totalElements(reviewPage.getTotalElements())
                        .build())
                .isLoading(false)
                .build();
    }

    @Override
    public ReviewMetadata getReviewStats(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        return ReviewMetadata.builder()
                .averageRating(hotel.getAverageRating())
                .totalReviews(hotel.getTotalReviews())
                .build();
    }

    @Override
    public boolean canUserReview(Long userId, Long hotelId) {

        if (userId == null) {
            log.error("userId is null in canUserReview method");
            return false;
        }
        log.info("Checking review eligibility for userId: {} and hotelId: {}", userId, hotelId);

        boolean hasCompletedBooking = bookingRepository
                .existsByUserIdAndHotelIdAndStatus(userId, hotelId, BookingStatus.COMPLETED);

        boolean hasExistingReview = reviewRepository
                .existsByUserIdAndHotelId(userId, hotelId);

        return hasCompletedBooking && !hasExistingReview;

    }

    @Override
    public ReviewDTO updateReview(Long userId, Long reviewId, ReviewDTO reviewDTO) throws Exception {
        log.debug("Updating review {} by user {}", reviewId, userId);

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new Exception("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only update your own reviews");
        }

        review.setRating(reviewDTO.getRating());
        review.setReview(reviewDTO.getReview());
        review = reviewRepository.save(review);

        calculateAndUpdateHotelRating(review.getHotel().getId());

        return mapToReviewDTO(review);
    }

    @Override
    public void deleteReview(Long userId, Long reviewId) throws Exception{
        log.debug("Deleting review {} by user {}", reviewId, userId);

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new Exception("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only delete your own reviews");
        }

        Long hotelId = review.getHotel().getId();
        reviewRepository.delete(review);
        calculateAndUpdateHotelRating(hotelId);
    }

    @Override
    public Page<ReviewDTO> getUserReviews(Long userId, int page, int size) {
        log.debug("Fetching reviews for user {} page {} size {}", userId, page, size);

        Pageable pageable = PageRequest.of(page - 1, size);
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToReviewDTO);
    }

    private void calculateAndUpdateHotelRating(Long hotelId) {
        List<Review> reviews = reviewRepository.findByHotelId(hotelId);

        double averageRating = 0.0;
        if (!reviews.isEmpty()) {
            averageRating = reviews.stream()
                    .mapToDouble(Review::getRating)
                    .average()
                    .orElse(0.0);
        }

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        hotel.setAverageRating(averageRating);
        hotel.setTotalReviews((long) reviews.size());

        hotelRepository.save(hotel);
    }

    private ReviewDTO mapToReviewDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .hotelId(review.getHotel().getId())
                .reviewerName(review.getUser().getFullname())
                .date(review.getCreatedAt())
                .review(review.getReview())
                .rating(review.getRating())
                .verified(review.getVerified())
                .build();
    }
}
