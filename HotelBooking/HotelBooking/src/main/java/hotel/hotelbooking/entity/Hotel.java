package hotel.hotelbooking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "hotels")
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "hotel_name", length = 100)
    private String name;

    @Column(name = "room_count", length = 100)
    private Integer count;

    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    @Column(name = "total_reviews")
    private Long totalReviews = 0L;

    @Column(name = "hotel_url")
    private String url;

    @Column(name = "hotel_description")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "hotel_service",
            joinColumns = @JoinColumn(name = "hotel_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )

    private List<Service> services = new ArrayList<>();
    @Override
    public String toString() {
        return "Hotel{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", count=" + count +
                ", city=" + city +
                '}';
    }
}
