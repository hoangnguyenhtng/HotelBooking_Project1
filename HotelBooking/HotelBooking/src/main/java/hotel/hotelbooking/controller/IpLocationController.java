package hotel.hotelbooking.controller;

import hotel.hotelbooking.service.impl.IpLocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IpLocationController {

    @Autowired
    private IpLocationService ipLocationService;

    @GetMapping("/location")
    public String getLocation(@RequestParam String ip) {
        return ipLocationService.getCityByIp(ip);
    }
}