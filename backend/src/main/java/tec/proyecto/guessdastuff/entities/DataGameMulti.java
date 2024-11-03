package tec.proyecto.guessdastuff.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "dataGameMulti")
public class DataGameMulti {
    @Id
    @Column(unique = true, nullable = false)
    private String id;

    @Column
    private String idUser1;

    @Column
    private String idUser2;

    @Column
    private String idUserWin;

    @ManyToOne
    private InfoGameMulti infoGameMulti1;

    @ManyToOne
    private InfoGameMulti infoGameMulti2;

    @ManyToOne
    private InfoGameMulti infoGameMulti3;

    @Column
    private boolean isFinish;
}

