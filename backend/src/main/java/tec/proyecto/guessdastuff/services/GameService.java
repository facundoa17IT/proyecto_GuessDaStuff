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
import tec.proyecto.guessdastuff.dtos.DtoGuessPhrase;
import tec.proyecto.guessdastuff.dtos.DtoOrderByDate;
import tec.proyecto.guessdastuff.dtos.DtoOrderWord;
import tec.proyecto.guessdastuff.entities.Category;
import tec.proyecto.guessdastuff.entities.GameMode;
import tec.proyecto.guessdastuff.entities.GuessPhrase;
import tec.proyecto.guessdastuff.entities.OrderByDate;
import tec.proyecto.guessdastuff.entities.OrderWord;
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

    /***** INDIVIDUAL *****/
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

    public ResponseEntity<?> createOWIndividual(DtoOrderWord dtoOrderWord) throws GameModeException {
        Optional<Category> categoryOpt = categoryRepository.findById(dtoOrderWord.getId_Category());
        if (!categoryOpt.isPresent()) {
            throw new GameModeException("La categoria ingresada no existe");
        }

        Category categoryEntidad = categoryOpt.get();

        Optional<GameMode> gameModeOpt = gameModeRepository.findByName(EGameMode.OW.toString());
        GameMode gameModeEnt = gameModeOpt.orElseThrow(() -> new GameModeException("El modo de juego no existe"));

        OrderWord ow = new OrderWord(null, gameModeEnt, categoryEntidad, dtoOrderWord.getWord(), dtoOrderWord.getHint1(), dtoOrderWord.getHint2(), dtoOrderWord.getHint3()); // {{ edit_1 }}

        gameRepository.save(ow);

        return ResponseEntity.ok("La palabra " + dtoOrderWord.getWord() + " se creó correctamente para la categoría " + categoryEntidad.getName() +
                " y modo de juego " + gameModeEnt.getName());
    }

    public ResponseEntity<?> createGPIndividual(DtoGuessPhrase dtoGuessPhrase) throws GameModeException {
        Optional<Category> categoryOpt = categoryRepository.findById(dtoGuessPhrase.getId_Category());
        if (!categoryOpt.isPresent()) {
            throw new GameModeException("La categoria ingresada no existe");
        }

        Category categoryEntidad = categoryOpt.get();

        Optional<GameMode> gameModeOpt = gameModeRepository.findByName(EGameMode.GP.toString());
        GameMode gameModeEnt = gameModeOpt.orElseThrow(() -> new GameModeException("El modo de juego no existe"));

        GuessPhrase gp = new GuessPhrase(null, gameModeEnt, categoryEntidad, dtoGuessPhrase.getPhrase(), dtoGuessPhrase.getCorrectWord(), dtoGuessPhrase.getHint1(), dtoGuessPhrase.getHint2(), dtoGuessPhrase.getHint3()); // {{ edit_2 }}

        gameRepository.save(gp);

        return ResponseEntity.ok("La frase " + dtoGuessPhrase.getPhrase() + " se creó correctamente para la categoría " + categoryEntidad.getName() +
                " y modo de juego " + gameModeEnt.getName());
    }

    /***** MASIVO ******/
    //OrderByDate
    public ResponseEntity<?> createOBDMasive (Long idCategory, MultipartFile archivo) throws IOException, GameModeException{

        Optional<GameMode> gameModeOpt = gameModeRepository.findByName(EGameMode.OBD.toString());
        GameMode gameModeEnt = gameModeOpt.orElseThrow(() -> new GameModeException("El modo de juego no existe"));

        Optional<Category> categoryOpt = categoryRepository.findById(idCategory);
        Category categoryEntidad = categoryOpt.get();
        
        // Abre el archivo Excel
        try (Workbook workbook = new XSSFWorkbook(archivo.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0); // Asume que las titulos están en la primera hoja
            Iterator<Row> rows = sheet.iterator();

            // Saltar la primera fila que contiene los nombres de las columnas
            if (rows.hasNext()) {
                rows.next(); // Esto avanza a la segunda fila, saltando la primera
            }

            int rowIndex = 2; // Para contar las filas (empieza en 2 porque se saltó la primera)

            //Inicializo las fechas para poder validar que una sea menor que otra
            LocalDate startDate = null;
            LocalDate endDate = null;

            while(rows.hasNext()){
                Row currentRow = rows.next();

                OrderByDate orderByDate = new OrderByDate();

                orderByDate.setIdGameMode(gameModeEnt);
                orderByDate.setIdCategory(categoryEntidad);

                //Las columnas deben ir en el siguiente orden: event, infoEvent, startDate, endDate, hint1, hint2, hint3

                //Evento
                if(currentRow.getCell(0) != null){
                    orderByDate.setEvent(currentRow.getCell(0).getStringCellValue());
                }

                //InfoEvent
                if(currentRow.getCell(1) != null){
                    orderByDate.setInfoEvent(currentRow.getCell(1).getStringCellValue());
                }

                //StartDate
                if(currentRow.getCell(2) != null){
                        // Convertir Date a LocalDate
                        Date date = currentRow.getCell(2).getDateCellValue();
                        startDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                        orderByDate.setStartDate(startDate);
                }

                //EndDate
                if(currentRow.getCell(3) != null){
                        // Convertir Date a LocalDate
                        Date date = currentRow.getCell(3).getDateCellValue();
                        endDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                        orderByDate.setEndDate(endDate);
                }

                // Validar que startDate sea menor que endDate
                if (startDate != null && endDate != null && !startDate.isBefore(endDate)) {
                    throw new GameModeException(" En la fila " + rowIndex + " la fecha de inicio debe ser anterior a la fecha de fin para el evento: " + orderByDate.getEvent());
                }

                //Hint1
                if(currentRow.getCell(4) != null){
                    orderByDate.setHint1(currentRow.getCell(4).getStringCellValue());
                }
                //Hint2
                if(currentRow.getCell(5) != null){
                    orderByDate.setHint2(currentRow.getCell(5).getStringCellValue());
                }
                //Hint3
                if(currentRow.getCell(6) != null){
                    orderByDate.setHint3(currentRow.getCell(6).getStringCellValue());
                }

                gameRepository.save(orderByDate);
                rowIndex++;
            }
        }
        return ResponseEntity.ok("Se cargaron correctamente los eventos para la categoria " + categoryEntidad.getName() + " y modo de juego " + gameModeEnt.getName());
    
    }

    //GuessPhrase
    public ResponseEntity<?> createGPMasive (Long idCategory, MultipartFile archivo) throws IOException, GameModeException{

        Optional<GameMode> gameModeOpt = gameModeRepository.findByName(EGameMode.GP.toString());
        GameMode gameModeEnt = gameModeOpt.orElseThrow(() -> new GameModeException("El modo de juego no existe"));

        Optional<Category> categoryOpt = categoryRepository.findById(idCategory);
        Category categoryEntidad = categoryOpt.get();
        
        // Abre el archivo Excel
        try (Workbook workbook = new XSSFWorkbook(archivo.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0); // Asume que las titulos están en la primera hoja
            Iterator<Row> rows = sheet.iterator();

            // Saltar la primera fila que contiene los nombres de las columnas
            if (rows.hasNext()) {
                rows.next(); // Esto avanza a la segunda fila, saltando la primera
            }

            while(rows.hasNext()){
                Row currentRow = rows.next();

                GuessPhrase GP = new GuessPhrase();

                GP.setIdGameMode(gameModeEnt);
                GP.setIdCategory(categoryEntidad);

                //Las columnas deben ir en el siguiente orden: phrase, correctWord,hint1, hint2, hint3

                if(currentRow.getCell(0) != null){
                    GP.setPhrase(currentRow.getCell(0).getStringCellValue());
                }

                if(currentRow.getCell(1) != null){
                   GP.setCorrectWord(currentRow.getCell(1).getStringCellValue());
                }

                //Hint1
                if(currentRow.getCell(2) != null){
                    GP.setHint1(currentRow.getCell(2).getStringCellValue());
                }
                //Hint2
                if(currentRow.getCell(3) != null){
                    GP.setHint2(currentRow.getCell(3).getStringCellValue());
                }
                //Hint3
                if(currentRow.getCell(4) != null){
                    GP.setHint3(currentRow.getCell(4).getStringCellValue());
                }

                gameRepository.save(GP);

            }
        }
        return ResponseEntity.ok("Se cargaron correctamente las frases para la categoria " + categoryEntidad.getName() + " y modo de juego " + gameModeEnt.getName());
    }

    //OrderWord
    public ResponseEntity<?> createOWMasive (Long idCategory, MultipartFile archivo) throws IOException, GameModeException{

        Optional<GameMode> gameModeOpt = gameModeRepository.findByName(EGameMode.OW.toString());
        GameMode gameModeEnt = gameModeOpt.orElseThrow(() -> new GameModeException("El modo de juego no existe"));

        Optional<Category> categoryOpt = categoryRepository.findById(idCategory);
        Category categoryEntidad = categoryOpt.get();
        
        // Abre el archivo Excel
        try (Workbook workbook = new XSSFWorkbook(archivo.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0); // Asume que las titulos están en la primera hoja
            Iterator<Row> rows = sheet.iterator();

            // Saltar la primera fila que contiene los nombres de las columnas
            if (rows.hasNext()) {
                rows.next(); // Esto avanza a la segunda fila, saltando la primera
            }

            while(rows.hasNext()){
                Row currentRow = rows.next();

                OrderWord OW = new OrderWord();

                OW.setIdGameMode(gameModeEnt);
                OW.setIdCategory(categoryEntidad);

                //Las columnas deben ir en el siguiente orden: word, hint1, hint2, hint3

                if(currentRow.getCell(0) != null){
                    OW.setWord(currentRow.getCell(0).getStringCellValue());
                }

                //Hint1
                if(currentRow.getCell(1) != null){
                    OW.setHint1(currentRow.getCell(1).getStringCellValue());
                }
                //Hint2
                if(currentRow.getCell(2) != null){
                    OW.setHint2(currentRow.getCell(2).getStringCellValue());
                }
                //Hint3
                if(currentRow.getCell(3) != null){
                    OW.setHint3(currentRow.getCell(3).getStringCellValue());
                }

                gameRepository.save(OW);

            }
        }
        return ResponseEntity.ok("Se cargaron correctamente las palabras para la categoria " + categoryEntidad.getName() + " y modo de juego " + gameModeEnt.getName());
    }
}
