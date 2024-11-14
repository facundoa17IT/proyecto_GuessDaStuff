package tec.proyecto.guessdastuff.services;

import java.util.Optional;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import tec.proyecto.guessdastuff.converters.DateConverter;
import tec.proyecto.guessdastuff.converters.GameConverter;
import tec.proyecto.guessdastuff.dtos.DtoGuessPhrase;
import tec.proyecto.guessdastuff.dtos.DtoListTitlesResponse;
import tec.proyecto.guessdastuff.dtos.DtoLoadPlaygameResponse;
import tec.proyecto.guessdastuff.dtos.DtoMultipleChoice;
import tec.proyecto.guessdastuff.dtos.DtoOrderWord;
import tec.proyecto.guessdastuff.dtos.DtoTitleWithId;
import tec.proyecto.guessdastuff.entities.Category;
import tec.proyecto.guessdastuff.entities.DataGameSingle;
import tec.proyecto.guessdastuff.entities.Game;
import tec.proyecto.guessdastuff.entities.GameMode;
import tec.proyecto.guessdastuff.entities.GuessPhrase;
import tec.proyecto.guessdastuff.entities.MultipleChoice;
import tec.proyecto.guessdastuff.entities.OrderWord;
import tec.proyecto.guessdastuff.enums.ECategoryStatus;
import tec.proyecto.guessdastuff.enums.EGameMode;
import tec.proyecto.guessdastuff.exceptions.GameModeException;
import tec.proyecto.guessdastuff.repositories.CategoryRepository;
import tec.proyecto.guessdastuff.repositories.DataGameSingleRepository;
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
    DataGameSingleRepository dataGameSingleRepository;

    @Autowired
    DateConverter dateConverter;

    @Autowired
    GameConverter gameConverter;

    public DtoListTitlesResponse listTitlesOfCategory(Long idCategory) throws GameModeException {
        List<Object[]> result = gameRepository.listTitlesOfCategory(idCategory);
    
        if (result.isEmpty()) {
            throw new GameModeException("Para la categoria ingresada no existen titulos");
        }

        Map<String, List<DtoTitleWithId>> titlesMap = new HashMap<>();

        for (Object[] row : result) {
            String gameMode = (String) row[0];
            String title = (String) row[1];
            Long id  = ((Number) row[2]).longValue();

            DtoTitleWithId titleWithId = new DtoTitleWithId(title, id);
        
            // computeIfAbsent para obtener la lista existente o crear una nueva si no existe
            titlesMap.computeIfAbsent(gameMode, k -> new ArrayList<>()).add(titleWithId);
        }

        return new DtoListTitlesResponse(titlesMap);
}
    public DtoLoadPlaygameResponse listPlayGames() throws GameModeException {
        List<DataGameSingle> result = dataGameSingleRepository.findAll();
        if (result.isEmpty()) {
            throw new GameModeException("No hay partidas");
        }

        Map<String, List<DataGameSingle>> response = new HashMap<>();

        for (DataGameSingle dataGameSingle : result) {
            boolean isFinish = dataGameSingle.isFinish();
            
            String statusKey = isFinish ? "Finalizadas" : "Activas";

            response.computeIfAbsent(statusKey, k -> new ArrayList<>()).add(dataGameSingle);
        }
        
        return new DtoLoadPlaygameResponse(response);
    }


    /***** INDIVIDUAL *****/
    public ResponseEntity<?> createMCIndividual (DtoMultipleChoice dtoMultipleChoice) throws GameModeException{

        Optional<Category> categoryOpt = categoryRepository.findById(dtoMultipleChoice.getId_Category());
        if(!categoryOpt.isPresent()){
            throw new GameModeException("La categoria ingresada no existe");
        }

        Category categoryEntidad = categoryOpt.get();

        if(categoryEntidad.getStatus().equals(ECategoryStatus.EMPTY)){
            categoryEntidad.setStatus(ECategoryStatus.INITIALIZED);
            categoryRepository.save(categoryEntidad);
        }

        Optional<GameMode> gameModeOpt = gameModeRepository.findByName(EGameMode.MC.toString());
        GameMode gameModeEnt = gameModeOpt.orElseThrow(() -> new GameModeException("El modo de juego no existe"));

        MultipleChoice mC = new MultipleChoice(null, gameModeEnt, categoryEntidad, dtoMultipleChoice.getRandomCorrectWord().toUpperCase(), dtoMultipleChoice.getRandomWord1().toUpperCase(), 
        dtoMultipleChoice.getRandomWord2().toUpperCase(),dtoMultipleChoice.getRandomWord3().toUpperCase(),dtoMultipleChoice.getQuestion(), dtoMultipleChoice.getHint1(), dtoMultipleChoice.getHint2(), dtoMultipleChoice.getHint3());

        gameRepository.save(mC);

        return ResponseEntity.ok("El titulo: " + dtoMultipleChoice.getQuestion() + ", se creo correctamente para la categoria " + categoryEntidad.getName() + 
                                 " y modo de juego " + gameModeEnt.getName());
    
    }

    public ResponseEntity<?> createOWIndividual(DtoOrderWord dtoOrderWord) throws GameModeException {
        Optional<Category> categoryOpt = categoryRepository.findById(dtoOrderWord.getId_Category());
        if (!categoryOpt.isPresent()) {
            throw new GameModeException("La categoria ingresada no existe");
        }

        Category categoryEntidad = categoryOpt.get();

        if(categoryEntidad.getStatus().equals(ECategoryStatus.EMPTY)){
            categoryEntidad.setStatus(ECategoryStatus.INITIALIZED);
            categoryRepository.save(categoryEntidad);
        }

        Optional<GameMode> gameModeOpt = gameModeRepository.findByName(EGameMode.OW.toString());
        GameMode gameModeEnt = gameModeOpt.orElseThrow(() -> new GameModeException("El modo de juego no existe"));

        OrderWord ow = new OrderWord(null, gameModeEnt, categoryEntidad, dtoOrderWord.getWord().toUpperCase(), dtoOrderWord.getHint1(), dtoOrderWord.getHint2(), dtoOrderWord.getHint3()); // {{ edit_1 }}

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

        if(categoryEntidad.getStatus().equals(ECategoryStatus.EMPTY)){
            categoryEntidad.setStatus(ECategoryStatus.INITIALIZED);
            categoryRepository.save(categoryEntidad);
        }

        Optional<GameMode> gameModeOpt = gameModeRepository.findByName(EGameMode.GP.toString());
        GameMode gameModeEnt = gameModeOpt.orElseThrow(() -> new GameModeException("El modo de juego no existe"));

        GuessPhrase gp = new GuessPhrase(null, gameModeEnt, categoryEntidad, dtoGuessPhrase.getPhrase(), dtoGuessPhrase.getCorrectWord().toUpperCase(), dtoGuessPhrase.getHint1(), dtoGuessPhrase.getHint2(), dtoGuessPhrase.getHint3()); // {{ edit_2 }}

        gameRepository.save(gp);

        return ResponseEntity.ok("La frase " + dtoGuessPhrase.getPhrase() + " se creó correctamente para la categoría " + categoryEntidad.getName() +
                " y modo de juego " + gameModeEnt.getName());
    }

    /***** MASIVO ******/
    public ResponseEntity<?> createMCMasive (Long idCategory, MultipartFile archivo) throws IOException, GameModeException{

        Optional<GameMode> gameModeOpt = gameModeRepository.findByName(EGameMode.MC.toString());
        GameMode gameModeEnt = gameModeOpt.orElseThrow(() -> new GameModeException("El modo de juego no existe"));

        Optional<Category> categoryOpt = categoryRepository.findById(idCategory);
        Category categoryEntidad = categoryOpt.get();
        
        if(categoryEntidad.getStatus().equals(ECategoryStatus.EMPTY)){
            categoryEntidad.setStatus(ECategoryStatus.INITIALIZED);
            categoryRepository.save(categoryEntidad);
        }
        
        // Abre el archivo Excel
        try (Workbook workbook = new XSSFWorkbook(archivo.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0); // Asume que las titulos están en la primera hoja
            Iterator<Row> rows = sheet.iterator();

            // Saltar la primera fila que contiene los nombres de las columnas
            if (rows.hasNext()) {
                rows.next(); // Esto avanza a la segunda fila, saltando la primera
            }
            
            int rowIndex = 2; // Para contar las filas (empieza en 2 porque se saltó la primera)
            
            while(rows.hasNext()){
                Row currentRow = rows.next();
                
                MultipleChoice multipleChoice = new MultipleChoice();
                
                multipleChoice.setIdGameMode(gameModeEnt);
                multipleChoice.setIdCategory(categoryEntidad);
                
                //Las columnas deben ir en el siguiente orden: event, infoEvent, startDate, endDate, hint1, hint2, hint3
                
                //Evento
                if(currentRow.getCell(0) != null){
                    multipleChoice.setRandomCorrectWord(currentRow.getCell(0).getStringCellValue());
                }
                
                //InfoEvent
                if(currentRow.getCell(1) != null){
                    multipleChoice.setRandomWord1(currentRow.getCell(1).getStringCellValue());
                }
                
                //StartDate
                if(currentRow.getCell(2) != null){
                    multipleChoice.setRandomWord2(currentRow.getCell(2).getStringCellValue());
                }
                
                //EndDate
                if(currentRow.getCell(3) != null){
                    multipleChoice.setRandomWord3(currentRow.getCell(3).getStringCellValue());
                }

                if(currentRow.getCell(3) != null){
                    multipleChoice.setQuestion(currentRow.getCell(3).getStringCellValue()); //verificar
                }
                
                //Hint1
                if(currentRow.getCell(4) != null){
                    multipleChoice.setHint1(currentRow.getCell(4).getStringCellValue());
                }
                //Hint2
                if(currentRow.getCell(5) != null){
                    multipleChoice.setHint2(currentRow.getCell(5).getStringCellValue());
                }
                //Hint3
                if(currentRow.getCell(6) != null){
                    multipleChoice.setHint3(currentRow.getCell(6).getStringCellValue());
                }
                
                gameRepository.save(multipleChoice);
                rowIndex++;
            }
        }
        return ResponseEntity.ok("Se cargaron correctamente los eventos para la categoria " + categoryEntidad.getName() + " y modo de juego " + gameModeEnt.getName());
    
    }

    public ResponseEntity<?> createOWMasive (Long idCategory, MultipartFile archivo) throws IOException, GameModeException{

        Optional<GameMode> gameModeOpt = gameModeRepository.findByName(EGameMode.OW.toString());
        GameMode gameModeEnt = gameModeOpt.orElseThrow(() -> new GameModeException("El modo de juego no existe"));

        Optional<Category> categoryOpt = categoryRepository.findById(idCategory);
        Category categoryEntidad = categoryOpt.get();

        if(categoryEntidad.getStatus().equals(ECategoryStatus.EMPTY)){
            categoryEntidad.setStatus(ECategoryStatus.INITIALIZED);
            categoryRepository.save(categoryEntidad);
        }
        
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

    public ResponseEntity<?> createGPMasive (Long idCategory, MultipartFile archivo) throws IOException, GameModeException{

        Optional<GameMode> gameModeOpt = gameModeRepository.findByName(EGameMode.GP.toString());
        GameMode gameModeEnt = gameModeOpt.orElseThrow(() -> new GameModeException("El modo de juego no existe"));

        Optional<Category> categoryOpt = categoryRepository.findById(idCategory);
        Category categoryEntidad = categoryOpt.get();

        if(categoryEntidad.getStatus().equals(ECategoryStatus.EMPTY)){
            categoryEntidad.setStatus(ECategoryStatus.INITIALIZED);
            categoryRepository.save(categoryEntidad);
        }

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

    /******  GET DATA  ******/
    public ResponseEntity<?> getDataOfGameMode(Long id) throws GameModeException{
        
        Optional<Game> gameOpt = gameRepository.findById(id);

        Game game = gameOpt.get();

        if(game instanceof GuessPhrase){
            GuessPhrase guessPhrase = (GuessPhrase) game;
            DtoGuessPhrase dtoGuessPhrase = gameConverter.toDtoGuessPhrase(guessPhrase);
            return ResponseEntity.ok(dtoGuessPhrase);
        }
        
        if(game instanceof OrderWord){
            OrderWord orderWord = (OrderWord) game;
            DtoOrderWord dtoOrderWord = gameConverter.toDtoOrderWord(orderWord);
            return ResponseEntity.ok(dtoOrderWord);
        }

        if(game instanceof MultipleChoice){
            MultipleChoice multipleChoice = (MultipleChoice) game;
            DtoMultipleChoice dtoMultipleChoice = gameConverter.toDtoMultipleChoice(multipleChoice);
            return ResponseEntity.ok(dtoMultipleChoice);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Game mode not found");
        
    }
    
    /******  EDIT  ******/
    public ResponseEntity<?> editMultipleCoice(Long idGame, DtoMultipleChoice dtoMultipleChoice){

        Optional<Game> gameOpt = gameRepository.findById(idGame);

        Game game = gameOpt.get();

        if(game instanceof MultipleChoice){
            MultipleChoice multipleChoice = (MultipleChoice) game;
            multipleChoice.setRandomCorrectWord(dtoMultipleChoice.getRandomCorrectWord());
            multipleChoice.setRandomWord1(dtoMultipleChoice.getRandomWord1());
            multipleChoice.setRandomWord2(dtoMultipleChoice.getRandomWord2());
            multipleChoice.setRandomWord3(dtoMultipleChoice.getRandomWord3());
            multipleChoice.setQuestion(dtoMultipleChoice.getQuestion());
            multipleChoice.setHint1(dtoMultipleChoice.getHint1());
            multipleChoice.setHint2(dtoMultipleChoice.getHint2());
            multipleChoice.setHint3(dtoMultipleChoice.getHint3());

            gameRepository.save(multipleChoice);
            return ResponseEntity.ok("El modo de juego " + multipleChoice.getIdGameMode().getName() + " con id " + idGame + " ha sido modificado correctamente!");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Game mode not found");
    }

    public ResponseEntity<?> editOrderWord(Long idGame, DtoOrderWord dtoOrderWord){

        Optional<Game> gameOpt = gameRepository.findById(idGame);

        Game game = gameOpt.get();

        if(game instanceof OrderWord){
            OrderWord orderWord = (OrderWord) game;
            orderWord.setWord(dtoOrderWord.getWord());
            orderWord.setHint1(dtoOrderWord.getHint1());
            orderWord.setHint2(dtoOrderWord.getHint2());
            orderWord.setHint3(dtoOrderWord.getHint3());

            gameRepository.save(orderWord);

            return ResponseEntity.ok("El modo de juego " + orderWord.getIdGameMode().getName() + " con id " + idGame + " ha sido modificado correctamente!");
            
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Game mode not found");

    }

    public ResponseEntity<?> editGuessPhrase(Long idGame, DtoGuessPhrase dtoGuessPhrase){
        Optional<Game> gameOpt = gameRepository.findById(idGame);

        Game game = gameOpt.get();

        if(game instanceof GuessPhrase){
            GuessPhrase guessPhrase = (GuessPhrase) game;
            guessPhrase.setPhrase(dtoGuessPhrase.getPhrase());
            guessPhrase.setCorrectWord(dtoGuessPhrase.getCorrectWord());
            guessPhrase.setHint1(dtoGuessPhrase.getHint1());
            guessPhrase.setHint2(dtoGuessPhrase.getHint2());
            guessPhrase.setHint3(dtoGuessPhrase.getHint3());

            gameRepository.save(guessPhrase);

            return ResponseEntity.ok("El modo de juego " + guessPhrase.getIdGameMode().getName() + " con id " + idGame + " ha sido modificado correctamente!");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Game mode not found");
    }

}
