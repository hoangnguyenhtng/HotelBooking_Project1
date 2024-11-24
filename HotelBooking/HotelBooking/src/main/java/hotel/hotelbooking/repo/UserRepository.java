package hotel.hotelbooking.repo;

import hotel.hotelbooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
    Optional<User> findByResetCode(String resetCode);
    Optional<User> findByVerificationToken(String token);

    @Query("SELECT u FROM User u WHERE u.resetCode IS NOT NULL")
    List<User> findAllByResetCodeIsNotNull();

    boolean existsByPhoneNumber(String phoneNumber);
}
