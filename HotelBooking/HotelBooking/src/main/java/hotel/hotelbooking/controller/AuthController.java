package hotel.hotelbooking.controller;

import hotel.hotelbooking.dto.LoginRequest;
import hotel.hotelbooking.dto.Response;
import hotel.hotelbooking.entity.User;
import hotel.hotelbooking.exception.OurException;
import hotel.hotelbooking.repo.UserRepository;
import hotel.hotelbooking.service.impl.UserService;
import hotel.hotelbooking.service.interfac.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private IUserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<Response> register(@RequestBody User user) {
        Response response = userService.register(user);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Response> login(@RequestBody LoginRequest loginRequest) {
        Response response = userService.login(loginRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/verify/{token}")
    public ResponseEntity<Response> verifyEmail(@PathVariable String token) {
        Response response = new Response();
        try {
            User user = userRepository.findByVerificationToken(token)
                    .orElseThrow(() -> new OurException("Invalid verification token"));

            // Kiểm tra token hết hạn (24 giờ)
            if (user.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now())) {
                throw new OurException("Verification token has expired");
            }

            user.setVerificationToken(null);
            userRepository.save(user);

            response.setStatusCode(200);
            response.setMessage("Email verified successfully");

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred during verification: " + e.getMessage());
        }
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Response> resendVerification(@RequestParam String email) {
        UserService userService = new UserService();
        Response response = new Response();
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new OurException("Email not found"));

            if (user.isEnabled()) {
                throw new OurException("Account is already verified");
            }

            String newToken = UUID.randomUUID().toString();
            user.setVerificationToken(newToken);
            user.setCreatedAt(LocalDateTime.now());
            userRepository.save(user);

            userService.sendVerificationEmail(email, newToken);

            response.setStatusCode(200);
            response.setMessage("Verification email has been resent");

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error occurred: " + e.getMessage());
        }
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
