package hotel.hotelbooking.service.interfac;

import hotel.hotelbooking.dto.HotelDTO;
import hotel.hotelbooking.dto.Response;
import hotel.hotelbooking.dto.ServiceDTO;

import java.util.List;

public interface IHotelService {
    List<HotelDTO> getAllHotels();
    List<HotelDTO> getHotelsByCityId(Long cityId);
    Response getHotelById(Long hotelId);
    List<ServiceDTO> getServicesByHotelId(Long hotelId);
}
