package tec.proyecto.guessdastuff.dtos;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tec.proyecto.guessdastuff.entities.InfoGameMulti;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoDataGameMulti {

    private String id;
    private String idUser1;
    private String idUser2;
    private String idUserWin;
    private String idInfoGameMulti;
    private boolean isFinish;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<InfoGameMulti> games;

}
