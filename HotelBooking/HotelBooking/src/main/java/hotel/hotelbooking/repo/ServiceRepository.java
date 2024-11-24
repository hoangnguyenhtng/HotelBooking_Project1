package hotel.hotelbooking.repo;

import hotel.hotelbooking.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<Service, Long>{
}
