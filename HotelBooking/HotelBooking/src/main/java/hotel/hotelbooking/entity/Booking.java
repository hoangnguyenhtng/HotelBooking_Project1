package hotel.hotelbooking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private int numAdult;

    private int numChild;

    private int totalNumOfGuest;

    private double totalBill;

    private boolean paymentStatus;

    private String bookingConfirmationCode;

    @Enumerated(EnumType.STRING)  // Thêm annotation này
    @Column(name = "status", length = 20)  // Thêm định nghĩa column
    private BookingStatus status = BookingStatus.PENDING;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;



    public void calculateTotalNumberOfGuest() {
        this.totalNumOfGuest = this.numAdult + this.numChild;
    }

    public void setNumOfAdults(int numOfAdults) {
        this.numAdult = numOfAdults;
        calculateTotalNumberOfGuest();
    }

    public void setNumOfChildren(int numOfChildren) {
        this.numChild = numOfChildren;
        calculateTotalNumberOfGuest();
    }

    @Override
    public String toString() {
        return "Booking{" +
                "id=" + id +
                ", checkInDate=" + checkInDate +
                ", checkOutDate=" + checkOutDate +
                ", numAdult=" + numAdult +
                ", numChild=" + numChild +
                ", totalNumOfGuest=" + totalNumOfGuest +
                ", totalBill=" + totalBill +
                ", paymentStatus=" + paymentStatus +
                ", bookingConfirmationCode='" + bookingConfirmationCode + '\'' +
                '}';
    }
}
