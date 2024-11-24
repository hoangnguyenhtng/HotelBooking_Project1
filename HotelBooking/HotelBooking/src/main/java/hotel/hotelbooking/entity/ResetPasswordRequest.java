package hotel.hotelbooking.entity;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String resetCode;
    private String newPassword;
}
