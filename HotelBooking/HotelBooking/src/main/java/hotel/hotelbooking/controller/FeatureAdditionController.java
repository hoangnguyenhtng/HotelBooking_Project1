package hotel.hotelbooking.controller;

import hotel.hotelbooking.dto.FeatureAdditionDTO;
import hotel.hotelbooking.service.impl.FeatureAddService;
import hotel.hotelbooking.service.interfac.IFeatureAdditionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;
@RestController
@RequestMapping("/features")
public class FeatureAdditionController {
    @Autowired
    private FeatureAddService featureAdditionService;

    @GetMapping("/getAllFeaturesAddition")
    public List<FeatureAdditionDTO> getAllFeatures() {
        return featureAdditionService.getAllFeatures();
    }
}
