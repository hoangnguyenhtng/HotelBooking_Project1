package hotel.hotelbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewMetadata {
    private Double averageRating;
    private Long totalReviews;
    private Map<Integer, Long> starCounts;
}