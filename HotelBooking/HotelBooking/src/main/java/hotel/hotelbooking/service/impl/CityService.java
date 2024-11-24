package hotel.hotelbooking.service.impl;

import hotel.hotelbooking.dto.CityDTO;
import hotel.hotelbooking.repo.CityRepository;
import hotel.hotelbooking.service.interfac.ICityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CityService implements ICityService {
    @Autowired
    private CityRepository cityRepository;

    @Override
    public List<CityDTO> getAllCities() {
        return cityRepository.findAll().stream()
                .map(city -> {
                    CityDTO dto = new CityDTO();
                    dto.setId(city.getId());
                    dto.setName(city.getName());
                    dto.setCount(city.getCount());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
