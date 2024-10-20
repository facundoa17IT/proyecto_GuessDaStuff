package tec.proyecto.guessdastuff.services;

import java.util.Optional;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Iterator;
import java.util.Date;

import java.time.ZoneId;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import tec.proyecto.guessdastuff.converters.DateConverter;
import tec.proyecto.guessdastuff.dtos.DtoOrderByDate;
import tec.proyecto.guessdastuff.entities.Category;
import tec.proyecto.guessdastuff.entities.GameMode;
import tec.proyecto.guessdastuff.entities.OrderByDate;
import tec.proyecto.guessdastuff.enums.EGameMode;
import tec.proyecto.guessdastuff.exceptions.GameModeException;
import tec.proyecto.guessdastuff.repositories.CategoryRepository;
import tec.proyecto.guessdastuff.repositories.GameModeRepository;
import tec.proyecto.guessdastuff.repositories.GameRepository;

@Service
public class GameService {

    @Autowired
    GameRepository gameRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    GameModeRepository gameModeRepository;

    @Autowired
    DateConverter dateConverter;

    /* EL ID PARA EL MODO DE JUEGO SE LO PASO HARCODEADO PORQUE ES EL 1 EN LA BD*/

    public ResponseEntity<?> createODBIndividual (DtoOrderByDate dtoOrderByDate) throws GameModeException{

        Optional<Category> categoryOpt = categoryRepository.findById(dtoOrderByDate.getId_Category());
        if(!categoryOpt.isPresent()){
            throw new GameModeException("La categoria ingresada no existe");
        }

        Category categoryEntidad = categoryOpt.get();


        Optional<GameMode> gameModeOpt = gameModeRepository.findByName(EGameMode.OBD.toString());
        GameMode gameModeEnt = gameModeOpt.orElseThrow(() -> new GameModeException("El modo de juego no existe"));

        LocalDate startDate = dateConverter.toLocalDate(dtoOrderByDate.getStartDate());
        LocalDate endDate = dateConverter.toLocalDate(dtoOrderByDate.getEndDate());

        if (startDate != null && endDate != null && !startDate.isBefore(endDate)) {
            throw new GameModeException("La fecha de inicio debe ser anterior a la fecha de fin para el evento: " + dtoOrderByDate.getEvent());
        }

        OrderByDate odb = new OrderByDate(null, gameModeEnt, categoryEntidad, dtoOrderByDate.getEvent(), dtoOrderByDate.getInfoEvent(), 
                                          startDate, endDate, dtoOrderByDate.getHint1(), dtoOrderByDate.getHint2(), dtoOrderByDate.getHint3()); // {{ edit_1 }}

        gameRepository.save(odb);

        return ResponseEntity.ok("El titulo " + dtoOrderByDate.getEvent() + " se creo correctamente para la categoria " + categoryEntidad.getName() + 
                                 " y modo de juego " + gameModeEnt.getName());
    
    }
}
