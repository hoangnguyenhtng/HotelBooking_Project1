package hotel.hotelbooking.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data


public class PasswordResetDTo {
    private String resetCode;
    private LocalDateTime resetCodeExpiry;

}
