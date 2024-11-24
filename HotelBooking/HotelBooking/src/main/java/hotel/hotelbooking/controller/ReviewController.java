package hotel.hotelbooking.controller;

import hotel.hotelbooking.dto.ReviewDTO;
import hotel.hotelbooking.dto.ReviewMetadata;
import hotel.hotelbooking.dto.ReviewResponse;
import hotel.hotelbooking.service.interfac.IReviewService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private static final Logger log = LoggerFactory.getLogger(ReviewController.class);
    private final IReviewService reviewService;


    @PostMapping("/hotels/{userId}/{hotelId}")
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long userId,
            @PathVariable Long hotelId,
            @Valid @RequestBody ReviewDTO reviewDTO
    ) throws Exception {
        reviewDTO.setHotelId(hotelId); // Ensure hotelId is set
        return ResponseEntity.ok(reviewService.addReview(userId, reviewDTO));
    }

    @GetMapping("/hotels/{hotelId}")
    public ResponseEntity<ReviewResponse> getHotelReviews(
            @PathVariable Long hotelId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reviewService.getReviews(hotelId, page, size));
    }

    @GetMapping("/hotels/{hotelId}/stats")
    public ResponseEntity<ReviewMetadata> getHotelReviewStats(
            @PathVariable Long hotelId
    ) {
        return ResponseEntity.ok(reviewService.getReviewStats(hotelId));
    }

    @GetMapping("/check-eligibility/{userId}/{hotelId}")
    public ResponseEntity<Boolean> checkReviewEligibility(
            @PathVariable Long userId,
            @PathVariable Long hotelId
    ) {
        log.info("Checking review eligibility - userId: {}, hotelId: {}", userId, hotelId);
        if (userId == null) {
            log.error("userId is null - Authentication may not be properly configured");
            return ResponseEntity.badRequest().build();
        }
        boolean canReview = !reviewService.canUserReview(userId, hotelId);
        log.info("Review eligibility result - userId: {}, hotelId: {}, canReview: {}",
                userId, hotelId, canReview);
        return ResponseEntity.ok(canReview);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> updateReview(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewDTO reviewDTO
    ) throws Exception {
        return ResponseEntity.ok(reviewService.updateReview(userId, reviewId, reviewDTO));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long reviewId
    ) throws Exception {
        reviewService.deleteReview(userId, reviewId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user")
    public ResponseEntity<Page<ReviewDTO>> getUserReviews(
            @AuthenticationPrincipal Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reviewService.getUserReviews(userId, page, size));
    }
}
