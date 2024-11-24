package hotel.hotelbooking.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)

public class CityDTO {
    private Long id;
    private String name;
    private Integer count;
    private List<HotelDTO> hotels = new ArrayList<>();
}
