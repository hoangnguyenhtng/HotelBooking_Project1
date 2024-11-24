package hotel.hotelbooking.service.impl;

import hotel.hotelbooking.dto.FeatureAdditionDTO;
import hotel.hotelbooking.entity.FeatureAddition;
import hotel.hotelbooking.repo.FeatureAdditionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeatureAddService {
    @Autowired
    private FeatureAdditionRepository featureAdditionRepository;

    public List<FeatureAdditionDTO> getAllFeatures() {
        return featureAdditionRepository.findAll().stream()
                .map(featureAddition -> {
                    FeatureAdditionDTO dto = new FeatureAdditionDTO();
                    dto.setId(featureAddition.getId());
                    dto.setName(featureAddition.getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
