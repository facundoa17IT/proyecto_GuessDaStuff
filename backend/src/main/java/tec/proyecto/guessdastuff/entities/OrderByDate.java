package tec.proyecto.guessdastuff.entities;

import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "games")
public class OrderByDate extends Game {

    @Column
    private LocalDate startDate;

    @Column
    private LocalDate endDate;

    @Column
    String event; 

    @Column
    String infoEvent;

    public OrderByDate(Long id, GameMode idGameMode, Category idCategory, String event, String infoEvent, LocalDate startDate, LocalDate endDate, String hint1, String hint2, String hint3) {
        super(id, idGameMode, idCategory, hint1, hint2, hint3); // Llama al constructor de la clase padre
        this.startDate = startDate;
        this.endDate = endDate;
        this.event = event;
        this.infoEvent = infoEvent;
    }
    
}
