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
@Table(name = "gameMode")
public class GameMode {

    @Id
    @Column(unique = true, nullable = false)
    private String name;

    @Column
    private String urlIcon;

    @Column
    private String description;
    
/*
    @Column
    private String childrenName;
 */
}
