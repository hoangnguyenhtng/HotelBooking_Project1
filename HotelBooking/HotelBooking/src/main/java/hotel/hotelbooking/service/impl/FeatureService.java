package hotel.hotelbooking.service.impl;

import hotel.hotelbooking.dto.FeatureDTO;
import hotel.hotelbooking.entity.Feature;
import hotel.hotelbooking.repo.FeatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeatureService {
    @Autowired
    private FeatureRepository featureRepository;

    public Feature createFeature(FeatureDTO featureDTO) {
        Feature feature = new Feature();
        feature.setName(featureDTO.getName());
        return featureRepository.save(feature);
    }

    public List<FeatureDTO> getAllFeatures() {
        return featureRepository.findAll().stream()
                .map(feature -> {
                    FeatureDTO dto = new FeatureDTO();
                    dto.setName(feature.getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
