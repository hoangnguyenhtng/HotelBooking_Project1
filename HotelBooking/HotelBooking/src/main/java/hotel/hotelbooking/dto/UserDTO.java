package hotel.hotelbooking.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)

public class UserDTO {
    private Long id;
    private String email;
    private String fullname;
    private String phoneNumber;
    private String role;
    private LocalDateTime createdAt;
    private List<BookingDTO> bookings = new ArrayList<>();

}
