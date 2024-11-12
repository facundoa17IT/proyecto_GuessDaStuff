package tec.proyecto.guessdastuff.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tec.proyecto.guessdastuff.dtos.DtoCreateMultiGameRequest;
import tec.proyecto.guessdastuff.dtos.DtoSendAnswer;
import tec.proyecto.guessdastuff.entities.DataGameMulti;
import tec.proyecto.guessdastuff.repositories.DataGameMultiRepository;

@Service
public class MultiplayerService {
    @Autowired
    private DataGameMultiRepository dataGameMultiRepository;

    
    public String createGame(DtoCreateMultiGameRequest dtoCreateMultiGameRequest) {
        DataGameMulti newDataGameMulti = new DataGameMulti();
        newDataGameMulti.setId(UUID.randomUUID().toString());
        newDataGameMulti.setIdUser1(dtoCreateMultiGameRequest.getUserHost().getUserId());
        newDataGameMulti.setIdUser2(dtoCreateMultiGameRequest.getUserGuest().getUserId());

        dataGameMultiRepository.save(newDataGameMulti);

        return newDataGameMulti.getId(); // Retornar el juego creado
    }

    public void sendAnswer(DtoSendAnswer dtoSendAnswer) {
        int points = 0;
        float timePlaying = dtoSendAnswer.getTime_playing(); 
        if (timePlaying != 0){
            if (timePlaying < 8) {
                points = 5;
            } else if (timePlaying < 15) {
                points = 4;
            } else if (timePlaying < 20) {
                points = 3;
            } else if (timePlaying < 25) {
                points = 2;
            } else if (timePlaying <= 30) {
                points = 1;
            }
        }
        dataGameMultiRepository.updateDataGame(dtoSendAnswer.getIdGameMulti(), dtoSendAnswer.getIdUser(), points, timePlaying);
    }
    
}
