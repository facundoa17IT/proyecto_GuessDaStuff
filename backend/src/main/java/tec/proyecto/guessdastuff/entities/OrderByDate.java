package tec.proyecto.guessdastuff.entities;

import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@AllArgsConstructor
@Data
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

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = super.hashCode();
        result = prime * result + ((startDate == null) ? 0 : startDate.hashCode());
        result = prime * result + ((endDate == null) ? 0 : endDate.hashCode());
        result = prime * result + ((event == null) ? 0 : event.hashCode());
        result = prime * result + ((infoEvent == null) ? 0 : infoEvent.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (!super.equals(obj))
            return false;
        if (getClass() != obj.getClass())
            return false;
        OrderByDate other = (OrderByDate) obj;
        if (startDate == null) {
            if (other.startDate != null)
                return false;
        } else if (!startDate.equals(other.startDate))
            return false;
        if (endDate == null) {
            if (other.endDate != null)
                return false;
        } else if (!endDate.equals(other.endDate))
            return false;
        if (event == null) {
            if (other.event != null)
                return false;
        } else if (!event.equals(other.event))
            return false;
        if (infoEvent == null) {
            if (other.infoEvent != null)
                return false;
        } else if (!infoEvent.equals(other.infoEvent))
            return false;
        return true;
    }

    

    
}
