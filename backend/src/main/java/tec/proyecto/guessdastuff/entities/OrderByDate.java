package tec.proyecto.guessdastuff.entities;

import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table
(name = "order_by_date")
public class OrderByDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long idOrderByDate;

    @ManyToOne
    @JoinColumn(name = "id_modegame", nullable = false)
    private GameMode gameMode;

    @ManyToOne
    @JoinColumn(name = "id_category", nullable = false)
    private Category category;
    
    @Column
    private String event;

    @Column
    private String infoEvent;

    @Column
    private LocalDate startDate;

    @Column
    private LocalDate endDate;

    @Column
    private String hint1;

    @Column
    private String hint2;

    @Column
    private String hint3;

}
