package hotel.hotelbooking.repo;

import hotel.hotelbooking.entity.Feature;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeatureRepository extends JpaRepository<Feature, Long>{
}
