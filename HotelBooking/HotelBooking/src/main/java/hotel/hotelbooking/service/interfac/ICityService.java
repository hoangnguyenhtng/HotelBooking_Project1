package hotel.hotelbooking.service.interfac;

import hotel.hotelbooking.dto.CityDTO;
import hotel.hotelbooking.dto.Response;

import java.util.List;

public interface ICityService {

    List<CityDTO> getAllCities();
}
