package hotel.hotelbooking.service.interfac;

import hotel.hotelbooking.dto.FeatureAdditionDTO;

import java.util.List;

public interface IFeatureAdditionService {
    void addFeature(Long hotelId, Long featureId);
    void deleteFeature(Long hotelId, Long featureId);
    List<FeatureAdditionDTO> getAllFeatures();
}
