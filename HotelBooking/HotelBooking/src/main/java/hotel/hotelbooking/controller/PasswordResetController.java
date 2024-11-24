package hotel.hotelbooking.controller;

import hotel.hotelbooking.dto.PasswordResetDTo;
import hotel.hotelbooking.dto.Response;
import hotel.hotelbooking.entity.EmailRequest;
import hotel.hotelbooking.entity.MessageResponse;
import hotel.hotelbooking.entity.ResetPasswordRequest;
import hotel.hotelbooking.entity.User;
import hotel.hotelbooking.service.impl.EmailService;
import hotel.hotelbooking.service.impl.UserService;
import hotel.hotelbooking.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/auth")
public class PasswordResetController {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetController.class);
    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody EmailRequest request) {
        try {

            log.info("Received forgot password request for email: {}", request.getEmail());
            // Kiểm tra email tồn tại
            Response user = userService.getUserByEmail(request.getEmail());
            log.info("{}",user);
            if (user == null) {
                log.warn("Email not found in the system: {}", request.getEmail());
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(new MessageResponse("Email không tồn tại trong hệ thống"));
            }

            // Tạo mã xác thực
            String resetCode = generateResetCode();

            // Lưu mã xác thực và thời gian hết hạn
            PasswordResetDTo passwordResetDTO = new PasswordResetDTo();
            passwordResetDTO.setResetCode(resetCode);
            passwordResetDTO.setResetCodeExpiry(LocalDateTime.now().plusMinutes(15));
            log.info("{}",user.getUser1());
            userService.savePasswordResetInfo(user.getUser1(), passwordResetDTO);
            log.info("Password reset info saved for user: {}", user.getUser1().getEmail());

            // Gửi email
            emailService.sendResetCode(request.getEmail(), resetCode);
            log.info("Reset code email sent to: {}", request.getEmail());

            return ResponseEntity.ok(new MessageResponse("Mã xác thực đã được gửi đến email của bạn"));
        } catch (Exception e) {
            log.error("Error processing forgot password request", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Có lỗi xảy ra khi xử lý yêu cầu"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            log.info("Received reset password request with code: {}", request.getResetCode());

            // Kiểm tra mã xác thực
            boolean isValidCode = userService.isValidResetCode(request.getResetCode());
            if (!isValidCode) {
                log.warn("Invalid reset code: {}", request.getResetCode());
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(new MessageResponse("Mã xác thực không hợp lệ"));
            }

            // Cập nhật mật khẩu mới
            String encodedPassword = passwordEncoder.encode(request.getNewPassword());
            userService.updatePasswordByResetCode(request.getResetCode(), encodedPassword);
            log.info("Password reset successful for reset code: {}", request.getResetCode());

            return ResponseEntity.ok(new MessageResponse("Đặt lại mật khẩu thành công"));
        } catch (Exception e) {
            log.error("Error processing reset password request with code", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Có lỗi xảy ra khi xử lý yêu cầu"));
        }
    }

    private String generateResetCode() {
        return Utils.generateRandomConfirmationCode(6);
    }
}

