package hotel.hotelbooking.entity;


import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "feature_add")
public class FeatureAddition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "faid")
    private Long id;

    @Column(name = "feature_name")
    private String name;
}
