package hotel.hotelbooking.service.impl;

import hotel.hotelbooking.dto.*;
import hotel.hotelbooking.entity.ResetPasswordRequest;
import hotel.hotelbooking.entity.User;
import hotel.hotelbooking.exception.OurException;
import hotel.hotelbooking.repo.UserRepository;
import hotel.hotelbooking.service.interfac.IUserService;
import hotel.hotelbooking.utils.JWTUtils;
import hotel.hotelbooking.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService implements IUserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JavaMailSender mailSender;

    private Set<String> tokenBlacklist = ConcurrentHashMap.newKeySet();


    public boolean isValidResetCode(String resetCode) {
        try {
            log.info("Validating reset code: {}", resetCode);

            Optional<User> userOpt = userRepository.findByResetCode(resetCode);
            if (userOpt.isEmpty()) {
                log.warn("No user found with reset code: {}", resetCode);
                return false;
            }

            User user = userOpt.get();
            if (user.getResetCodeExpiry() == null) {
                log.warn("Reset code expiry is null for user: {}", user.getEmail());
                return false;
            }

            boolean isValid = LocalDateTime.now().isBefore(user.getResetCodeExpiry());
            log.info("Reset code is valid: {} for user: {}", isValid, user.getEmail());

            return isValid;
        } catch (Exception e) {
            log.error("Error validating reset code", e);
            return false;
        }
    }
    public void updatePasswordByResetCode(String resetCode, String newPassword) {
        log.info("Updating password for reset code: {}", resetCode);

        User user = userRepository.findByResetCode(resetCode)
                .orElseThrow(() -> new OurException("Invalid reset code"));

        if (user.getResetCodeExpiry() == null ||
                LocalDateTime.now().isAfter(user.getResetCodeExpiry())) {
            throw new OurException("Reset code has expired");
        }

        // Cập nhật mật khẩu mới
        user.setPassword(newPassword);

        // Xóa mã reset và thời gian hết hạn
        user.setResetCode(null);
        user.setResetCodeExpiry(null);

        userRepository.save(user);
        log.info("Password updated successfully for user: {}", user.getEmail());
    }

    private void cleanupExpiredResetCodes() {
        try {
            log.info("Cleaning up expired reset codes");
            List<User> usersWithResetCodes = userRepository.findAllByResetCodeIsNotNull();

            for (User user : usersWithResetCodes) {
                if (user.getResetCodeExpiry() != null &&
                        LocalDateTime.now().isAfter(user.getResetCodeExpiry())) {
                    user.setResetCode(null);
                    user.setResetCodeExpiry(null);
                    userRepository.save(user);
                    log.info("Cleaned up expired reset code for user: {}", user.getEmail());
                }
            }
        } catch (Exception e) {
            log.error("Error cleaning up expired reset codes", e);
        }
    }

    @Override
    public Response register(User user) {
        Response response = new Response();
        try {
            // Kiểm tra role
            if (user.getRole() == null || user.getRole().isBlank()) {
                user.setRole("USER");
            }

            // Kiểm tra email tồn tại
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new OurException("Địa chỉ email" + user.getEmail() + " đã tồn tại trong hệ thống. Vui lòng chọn Email khác!");
            }

            // Thêm kiểm tra số điện thoại tồn tại
            if (userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
                throw new OurException("Số điện thoại " + user.getPhoneNumber() + " đã tồn tại trong hệ thống. Vui lòng chọn số khác!");
            }

            // Validate định dạng số điện thoại
            if (!isValidPhoneNumber(user.getPhoneNumber())) {
                throw new OurException("Sai định dạng số điện thoại. Vui lòng nhập số điện thoại hợp lệ!");
            }

            String token = UUID.randomUUID().toString();
            user.setVerificationToken(token);

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setCreatedAt(LocalDateTime.now());
            log.info("{}",user.getCreatedAt().toString());
            User savedUser = userRepository.save(user);

            sendVerificationEmail(savedUser.getEmail(), token);

            UserDTO userDTO = Utils.mapUserEntityToUserDTO(savedUser);
            response.setStatusCode(200);
            response.setUser(userDTO);
            response.setMessage("Hãy kiểm tra email của bạn để xác nhận tài khoản!");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Có lỗi xảy ra trong quá trình đăng ký. " + e.getMessage());
        }
        return response;
    }
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String email, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail); // Thêm email người gửi
            message.setTo(email);
            message.setSubject("Xác nhận đăng ký tài khoản");

            String verificationUrl = "http://localhost:3000/verify-email/" + token; // URL frontend của bạn
            String emailContent = "Xin chào,\n\n"
                    + "Vui lòng click vào link sau để xác nhận tài khoản của bạn:\n"
                    + verificationUrl + "\n\n"
                    + "Link xác thực này sẽ hết hạn sau 24 giờ.\n"
                    + "Nếu bạn không yêu cầu đăng ký tài khoản, vui lòng bỏ qua email này.\n\n"
                    + "Trân trọng,\n"
                    + "Hotel Booking Team";

            message.setText(emailContent);

            mailSender.send(message);
            log.info("Verification email sent successfully to: " + email);

        } catch (MailException e) {
            log.error("Failed to send verification email to: " + email, e);
            throw new RuntimeException("Error sending verification email: " + e.getMessage());
        }
    }

    // Thêm method validate số điện thoại
    private boolean isValidPhoneNumber(String phone) {
        if (phone == null || phone.isEmpty()) {
            return false;
        }
        // Regex cho số điện thoại Việt Nam
        String phoneRegex = "(84|0[3|5|7|8|9])+([0-9]{8})\\b";
        return phone.matches(phoneRegex);
    }

    @Override
    public Response login(LoginRequest loginRequest) {
        Response response = new Response();

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            var user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new OurException("user Not found"));

            var verificationToken = user.getVerificationToken();
            log.info("{}", verificationToken);

            // Thay đổi điều kiện kiểm tra - chỉ chặn khi verificationToken có giá trị
            if (verificationToken != null && !verificationToken.isEmpty()) {
                response.setStatusCode(500);
                response.setMessage("Tài khoản chưa được xác thực");
                return response;
            }

            var token = jwtUtils.generateToken(user);
            response.setStatusCode(200);
            response.setId(user.getId());
            response.setToken(token);
            response.setRole(user.getRole());
            response.setExpirationTime("7 Days");
            response.setMessage("successful");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Occurred During User Login " + e.getMessage());
        }
        return response;
    }


    @Override
    public Response getAllUsers() {
        Response response = new Response();
        try {
            List<User> userList = userRepository.findAll();
            List<UserDTO> userDTOList = Utils.mapUserListEntityToUserListDTO(userList);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUserList(userDTOList);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getUserBookingHistory(String userId) {
        Response response = new Response();


        try {
            User user = userRepository.findById(Long.valueOf(userId)).orElseThrow(() -> new OurException("User Not Found"));
            UserDTO userDTO = Utils.mapUserEntityToUserDTOPlusUserBookingsAndRoom(user);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser(userDTO);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteUser(String userId) {
        Response response = new Response();

        try {
            userRepository.findById(Long.valueOf(userId)).orElseThrow(() -> new OurException("User Not Found"));
            userRepository.deleteById(Long.valueOf(userId));
            response.setStatusCode(200);
            response.setMessage("successful");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getUserById(String userId) {
        Response response = new Response();

        try {
            User user = userRepository.findById(Long.valueOf(userId)).orElseThrow(() -> new OurException("User Not Found"));
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(user);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser(userDTO);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getUserByEmail(String email) {
        Response response = new Response();

        try {
            log.info("Email: {}", email);
            User user = userRepository.findByEmail(email).orElseThrow(() -> new OurException("Email Not Found"));
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser1(user);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        log.info("{}",response.toString());
        return response;
    }
    public void savePasswordResetInfo(User user, PasswordResetDTo passwordResetDTO) {
        user.setResetCode(passwordResetDTO.getResetCode());
        user.setResetCodeExpiry(passwordResetDTO.getResetCodeExpiry());
        userRepository.save(user);
    }

    public Response resetPassword(ResetPasswordRequest request) {
        Response response = new Response();

        try {
            log.info("Processing reset password request with code: {}", request.getResetCode());

            // Find user by reset code
            User user = userRepository.findByResetCode(request.getResetCode())
                    .orElseThrow(() -> new OurException("Mã xác thực không hợp lệ"));

            // Check if reset code has expired
            if (user.getResetCodeExpiry() == null || user.getResetCodeExpiry().isBefore(LocalDateTime.now())) {
                throw new OurException("Mã xác thực đã hết hạn");
            }

            // Update password
            String encodedPassword = passwordEncoder.encode(request.getNewPassword());
            user.setPassword(encodedPassword);

            // Clear reset code data
            user.setResetCode(null);
            user.setResetCodeExpiry(null);

            // Save updated user
            userRepository.save(user);

            response.setStatusCode(200);
            response.setMessage("Đặt lại mật khẩu thành công");
            response.setUser1(user);

            log.info("Password reset successful for user: {}", user.getEmail());

        } catch (OurException e) {
            log.warn("Reset password failed: {}", e.getMessage());
            response.setStatusCode(400);
            response.setMessage(e.getMessage());

        } catch (Exception e) {
            log.error("Error processing reset password request", e);
            response.setStatusCode(500);
            response.setMessage("Có lỗi xảy ra khi đặt lại mật khẩu: " + e.getMessage());
        }

        return response;
    }


    @Override
    public Response getMyInfo(String email) {
        Response response = new Response();

        try {
            User user = userRepository.findByEmail(email).orElseThrow(() -> new OurException("User Not Found"));
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(user);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser(userDTO);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        log.info("{}",response.toString());
        return response;
    }

    @Override
    public Response changePassword(String email, ChangePasswordRequest changePasswordRequest) {
        Response response = new Response();

        try {
            User user = userRepository.findByEmail(email).orElseThrow(() -> new OurException("User Not Found"));

            if (!passwordEncoder.matches(changePasswordRequest.getOldPassword(), user.getPassword())) {
                throw new OurException("Old password is incorrect");
            }

            if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmPassword())) {
                throw new OurException("New password and confirm password do not match");
            }

            user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
            userRepository.save(user);

            response.setStatusCode(200);
            response.setMessage("Password changed successfully");
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error changing password: " + e.getMessage());
        }

        return response;
    }


}
