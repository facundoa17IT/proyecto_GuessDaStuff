package tec.proyecto.guessdastuff.entities;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
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

    @EmbeddedId
    private InfoGameMultiId infoGameMultiId;

    @Column
    private String idUserWin;

    @Column
    private int points;

    @Column
    private float timePlaying;

    @Column
    private boolean isFinish;
}
