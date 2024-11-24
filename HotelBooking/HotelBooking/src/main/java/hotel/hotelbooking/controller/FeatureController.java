package hotel.hotelbooking.controller;

import hotel.hotelbooking.dto.FeatureDTO;
import hotel.hotelbooking.entity.Feature;
import hotel.hotelbooking.service.impl.FeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/features")
public class FeatureController {
    @Autowired
    private FeatureService featureService;

    @PostMapping("/create")
    public Feature createFeature(@RequestBody FeatureDTO featureDTO) {
        return featureService.createFeature(featureDTO);
    }

    @GetMapping("/getAll")
    public List<FeatureDTO> getAllFeatures() {
        return featureService.getAllFeatures();
    }
}
