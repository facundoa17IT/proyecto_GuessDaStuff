package tec.proyecto.guessdastuff.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "infoGameMulti")
public class InfoGameMulti {
    @Id
    @Column(unique = true, nullable = false)
    private String id;

    @Column
    private String idUserWin;

    @Column
    private String idDataGame;

    @Column
    private int points;  
    
    @Column
    private float timePlaying;

    @Column
    private boolean isFinish;  
}
