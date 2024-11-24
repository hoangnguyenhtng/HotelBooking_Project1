package hotel.hotelbooking.service.interfac;

import hotel.hotelbooking.dto.ChangePasswordRequest;
import hotel.hotelbooking.dto.LoginRequest;
import hotel.hotelbooking.dto.Response;
import hotel.hotelbooking.entity.User;

public interface IUserService {
    Response register(User user);

    Response login(LoginRequest loginRequest);

    Response getAllUsers();

    Response getUserBookingHistory(String userId);

    Response deleteUser(String userId);

    Response getUserById(String userId);

    Response getUserByEmail(String email);

    Response getMyInfo(String email);

    Response changePassword(String email, ChangePasswordRequest changePasswordRequest);

}
