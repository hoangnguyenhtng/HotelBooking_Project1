package hotel.hotelbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    // Request fields
    private Long hotelId;
    private Integer rating;
    private String review;

    // Response fields
    private Long id;
    private String reviewerName;
    private LocalDateTime date;
    private Boolean verified;
}
