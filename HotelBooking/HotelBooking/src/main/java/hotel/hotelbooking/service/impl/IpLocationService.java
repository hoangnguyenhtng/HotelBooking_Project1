package hotel.hotelbooking.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class IpLocationService {

    @Value("${ipstack.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getCityByIp(String ip) {
        String url = "https://api.ipstack.com/" + ip + "?access_key=" + apiKey;
        IpLocationResponse response = restTemplate.getForObject(url, IpLocationResponse.class);
        return response != null ? response.getCity() : null;
    }

    private static class IpLocationResponse {
        private String region_name;

        public String getCity() {
            return region_name;
        }

        public void setCity(String city) {
            this.region_name = city;
        }
    }
}