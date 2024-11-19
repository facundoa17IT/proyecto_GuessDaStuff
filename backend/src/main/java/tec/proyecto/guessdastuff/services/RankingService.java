package tec.proyecto.guessdastuff.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tec.proyecto.guessdastuff.dtos.DtoRankingResponse;
import tec.proyecto.guessdastuff.repositories.DataGameMultiRepository;
import tec.proyecto.guessdastuff.repositories.DataGameSingleRepository;

@Service
public class RankingService {
    
    @Autowired
    DataGameSingleRepository dataGameSingleRepository;

    @Autowired
    DataGameMultiRepository dataGameMultiRepository;

    public List<DtoRankingResponse> rankingPartidasWin() {
        // Recuperar los datos desde el repositorio
        List<Object[]> rawData = dataGameMultiRepository.getRankingPartidasGanadas();

        // Convertir la lista de Object[] a DtoRankingPartidasWin
        return rawData.stream()
                .map(data -> new DtoRankingResponse(
                        (String) data[0], // username
                        ((Number) data[1]).longValue() // partidas_win
                ))
                .collect(Collectors.toList());
    }

    public Map<String, List<DtoRankingResponse>> rankingPuntaje(){

        Map<String, List<DtoRankingResponse>> listPuntaje = new HashMap<>();

        List<Object[]> rawDataMulti = dataGameMultiRepository.getRankingPuntaje();
        List<Object[]> rawDataSingle = dataGameSingleRepository.getRankingPuntajeSingle();

        List<DtoRankingResponse> puntajeSingle = rawDataSingle.stream()
                                                        .map(data -> new DtoRankingResponse(
                                                                (String) data[0], // username
                                                                ((Number) data[1]).longValue() // points
                                                        ))
                                                        .collect(Collectors.toList());
        
        List<DtoRankingResponse> puntajeMulti = rawDataMulti.stream()
                                                            .map(data -> new DtoRankingResponse(
                                                                    (String) data[0], // username
                                                                    ((Number) data[1]).longValue() // points
                                                            ))
                                                            .collect(Collectors.toList());
        
        listPuntaje.put("INDIVIDUAL", puntajeSingle);
        listPuntaje.put("MULTIPLAYER", puntajeMulti);

        return listPuntaje;

    }

    public Map<String, List<DtoRankingResponse>> rankingTiempo(){

        Map<String, List<DtoRankingResponse>> listTiempo = new HashMap<>();

        List<Object[]> rawDataMulti = dataGameMultiRepository.getRankingMenorTiempoMulti();
        List<Object[]> rawDataSingle = dataGameSingleRepository.getRankingMenorTiempoSingle();

        List<DtoRankingResponse> tiempoSingle = rawDataSingle.stream()
                                                        .map(data -> new DtoRankingResponse(
                                                                (String) data[0], // username
                                                                ((Number) data[1]).longValue() // time_playing
                                                        ))
                                                        .collect(Collectors.toList());
        
        List<DtoRankingResponse> tiempoMulti = rawDataMulti.stream()
                                                            .map(data -> new DtoRankingResponse(
                                                                    (String) data[0], // username
                                                                    ((Number) data[1]).longValue() // time_playing
                                                            ))
                                                            .collect(Collectors.toList());
        listTiempo.put("INDIVIDUAL", tiempoSingle);
        listTiempo.put("MULTIPLAYER", tiempoMulti);

        return listTiempo;

    }

}
