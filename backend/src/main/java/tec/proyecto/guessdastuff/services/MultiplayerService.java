package tec.proyecto.guessdastuff.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tec.proyecto.guessdastuff.dtos.DtoCreateMultiGameRequest;
import tec.proyecto.guessdastuff.dtos.DtoSendAnswer;
import tec.proyecto.guessdastuff.dtos.DtoSendAnswerResponse;
import tec.proyecto.guessdastuff.entities.DataGameMulti;
import tec.proyecto.guessdastuff.repositories.DataGameMultiRepository;
import tec.proyecto.guessdastuff.repositories.InfoGameMultiRepository;

@Service
public class MultiplayerService {
    @Autowired
    private DataGameMultiRepository dataGameMultiRepository;
    @Autowired
    private InfoGameMultiRepository infoGameMultiRepository;
    
    public String createGame(DtoCreateMultiGameRequest dtoCreateMultiGameRequest) {
        DataGameMulti newDataGameMulti = new DataGameMulti();
        newDataGameMulti.setId(UUID.randomUUID().toString());
        newDataGameMulti.setIdUser1(dtoCreateMultiGameRequest.getUserHost().getUserId());
        newDataGameMulti.setIdUser2(dtoCreateMultiGameRequest.getUserGuest().getUserId());

        dataGameMultiRepository.save(newDataGameMulti);

        return newDataGameMulti.getId(); // Retornar el juego creado
    }

    public DtoSendAnswerResponse sendAnswer(DtoSendAnswer dtoSendAnswer) {
        int points = 0;
        float timePlaying = dtoSendAnswer.getTime_playing(); 

        DtoSendAnswerResponse dtoSendAnswerResponse = new DtoSendAnswerResponse();
        dtoSendAnswerResponse.setIdGame(dtoSendAnswer.getIdGame());
        dtoSendAnswerResponse.setIdGameMulti(dtoSendAnswer.getIdGameMulti());
        dtoSendAnswerResponse.setIs_win(false);
        if (timePlaying <= 30){
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
            dtoSendAnswerResponse.setIdUserWin(dtoSendAnswer.getIdUserWin());
            dtoSendAnswerResponse.setIs_win(true);
        }
        dtoSendAnswerResponse.setPoints(points);
        if (dtoSendAnswer.getCardinal() == 1){
            infoGameMultiRepository.updateDataGame(dtoSendAnswer.getIdGameMulti(), dtoSendAnswer.getIdUserWin(), points, timePlaying);
        }
    return dtoSendAnswerResponse;
    }
 
}
