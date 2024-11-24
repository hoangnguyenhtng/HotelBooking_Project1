package hotel.hotelbooking.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import hotel.hotelbooking.entity.User;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    private int statusCode;
    private String message;

    private String token;
    private Long id;
    private String role;
    private String expirationTime;
    private String bookingConfirmationCode;
    private LocalDateTime createdAt;


    private User user1;
    private UserDTO user;
    private RoomDTO room;
    private HotelDTO hotel;
    private BookingDTO booking;
    private List<UserDTO> userList;
    private List<RoomDTO> roomList;
    private List<BookingDTO> bookingList;
}
