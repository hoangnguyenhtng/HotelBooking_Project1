package hotel.hotelbooking.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)

public class HotelDTO {

    private Long id;
    private String name;
    private Integer count;
    private Long cityId;
    private Double averageRating;
    private Long totalReviews;
    private String url;
    private String description;
    private List<ServiceDTO> services;
}
