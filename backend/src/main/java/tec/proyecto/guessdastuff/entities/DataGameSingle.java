package tec.proyecto.guessdastuff.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
@Table(name = "dataGameSingle")
public class DataGameSingle {
    @Id
    @Column(unique = true, nullable = false)
    private String id;

    @Column
    private String idUser;

    @Column
    private String idDataGame1;

    @Column
    private String idDataGame2;  

    @Column
    private String idDataGame3;  

    @Column
    private int points;  
    
    @Column
    private float timePlaying;

    @Column(name = "tmstmp_init")
    private LocalDateTime tmstmpInit;

    @Column
    private boolean isFinish;  
}
