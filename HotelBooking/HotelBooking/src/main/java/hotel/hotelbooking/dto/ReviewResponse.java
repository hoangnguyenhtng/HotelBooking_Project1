package hotel.hotelbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private List<ReviewDTO> data;
    private ReviewMetadata metadata;
    private PageInfo pagination;
    private boolean isLoading;
}
