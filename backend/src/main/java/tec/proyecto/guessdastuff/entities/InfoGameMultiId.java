package tec.proyecto.guessdastuff.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class InfoGameMultiId implements Serializable {
    @Column(nullable = false)
    private String id;

    @Column(nullable = false)
    private String idDataGame;
}
