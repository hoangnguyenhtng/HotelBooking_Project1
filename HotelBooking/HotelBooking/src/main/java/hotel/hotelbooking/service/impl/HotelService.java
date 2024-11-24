// package hotel.hotelbooking.service.impl;

package hotel.hotelbooking.service.impl;

import hotel.hotelbooking.dto.HotelDTO;
import hotel.hotelbooking.dto.Response;
import hotel.hotelbooking.dto.RoomDTO;
import hotel.hotelbooking.dto.ServiceDTO;
import hotel.hotelbooking.entity.Hotel;
import hotel.hotelbooking.entity.Room;
import hotel.hotelbooking.exception.OurException;
import hotel.hotelbooking.repo.HotelRepository;
import hotel.hotelbooking.service.interfac.IHotelService;
import hotel.hotelbooking.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelService implements IHotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Override
    public List<HotelDTO> getAllHotels() {
        return hotelRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<HotelDTO> getHotelsByCityId(Long cityId) {
        List<Hotel> hotels = hotelRepository.findByCityId(cityId);
        return hotels.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Response getHotelById(Long hotelId) {
        Response response = new Response();

        try {
            Hotel hotel = hotelRepository.findHotelById(hotelId);
            if (hotel == null) {
                throw new OurException("Hotel Not Found");
            }
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setHotel(convertToDTO(hotel)); // Chuyển đổi sang DTO

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error retrieving the hotel: " + e.getMessage());
        }

        return response;
    }

    @Override
    public List<ServiceDTO> getServicesByHotelId(Long hotelId) {
    Hotel hotel = hotelRepository.findHotelById(hotelId);
        return hotel.getServices().stream()
                .map(service -> {
                    ServiceDTO dto = new ServiceDTO();
                    dto.setName(service.getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }


    private HotelDTO convertToDTO(Hotel hotel) {
        HotelDTO dto = new HotelDTO();
        dto.setId(hotel.getId());
        dto.setName(hotel.getName());
        dto.setCount(hotel.getCount());
        dto.setCityId(hotel.getCity().getId());
        dto.setAverageRating(hotel.getAverageRating());
        dto.setTotalReviews(hotel.getTotalReviews());
        dto.setUrl(hotel.getUrl());
        dto.setDescription(hotel.getDescription());
        return dto;
    }
}
