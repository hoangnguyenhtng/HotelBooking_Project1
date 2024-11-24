package hotel.hotelbooking.controller;

import hotel.hotelbooking.dto.HotelDTO;
import hotel.hotelbooking.dto.Response;
import hotel.hotelbooking.dto.ServiceDTO;
import hotel.hotelbooking.service.interfac.IHotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/hotels")
public class HotelController {
    @Autowired
    private IHotelService hotelService;

    @GetMapping("/all")
    public List<HotelDTO> getAllHotels() {
        return hotelService.getAllHotels();
    }

    @GetMapping("/by-city/{cityId}")
    public List<HotelDTO> getHotelsByCityId(@PathVariable Long cityId) {
        List<HotelDTO> hotels = hotelService.getHotelsByCityId(cityId);
        return hotelService.getHotelsByCityId(cityId);
    }

    @GetMapping("/{hotelId}")
    public Response getHotelById(@PathVariable Long hotelId) {
        return hotelService.getHotelById(hotelId);
    }

    @GetMapping("/{hotelId}/services")
    public List<ServiceDTO> getServicesByHotelId(@PathVariable Long hotelId) {
        return hotelService.getServicesByHotelId(hotelId);
    }
}
