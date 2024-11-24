package hotel.hotelbooking.controller;

import hotel.hotelbooking.dto.CityDTO;
import hotel.hotelbooking.service.interfac.ICityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/cities")
public class CityController {
    @Autowired
    private ICityService cityService;

    @GetMapping("/all")
    public List<CityDTO> getAllCities() {
        return cityService.getAllCities();
    }
}
