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
import tec.proyecto.guessdastuff.exceptions.GameModeException;
import tec.proyecto.guessdastuff.repositories.CategoryRepository;
import tec.proyecto.guessdastuff.repositories.GameModeRepository;
import tec.proyecto.guessdastuff.repositories.OrderByDateRepository;

@Service
public class OrderByDateService {

    @Autowired
    OrderByDateRepository orderByDateRepository;

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

        if(orderByDateRepository.existsByCategoryIdAndEvent(categoryEntidad.getId(), dtoOrderByDate.getEvent())){
            throw new GameModeException("La categoria " + categoryEntidad.getName() + " ya tiene asociado el evento " + dtoOrderByDate.getEvent() + ".Intente ingresar otro evento");
        }

        Optional<GameMode> gameModeOpt = gameModeRepository.findById((long) 1);
        GameMode gameModeEnt = gameModeOpt.get();

        LocalDate startDate = dateConverter.toLocalDate(dtoOrderByDate.getStartDate());
        LocalDate endDate = dateConverter.toLocalDate(dtoOrderByDate.getEndDate());

        if (startDate != null && endDate != null && !startDate.isBefore(endDate)) {
            throw new GameModeException("La fecha de inicio debe ser anterior a la fecha de fin para el evento: " + dtoOrderByDate.getEvent());
        }

        OrderByDate odb = new OrderByDate(null, gameModeEnt, categoryEntidad, dtoOrderByDate.getEvent(), dtoOrderByDate.getInfoEvent(), 
                                          startDate, endDate, dtoOrderByDate.getHint1(), dtoOrderByDate.getHint2(), dtoOrderByDate.getHint3());

        orderByDateRepository.save(odb);

        return ResponseEntity.ok("El titulo " + dtoOrderByDate.getEvent() + " se creo correctamente para la categoria " + categoryEntidad.getName() + 
                                 " y modo de juego " + gameModeEnt.getName());
    
    }

    public ResponseEntity<?> createOBDMasive (Long idCategory, MultipartFile archivo) throws IOException, GameModeException{

        Optional<GameMode> gameModeOpt = gameModeRepository.findById((long) 1); 
        GameMode gameModeEnt = gameModeOpt.get();

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

                orderByDate.setGameMode(gameModeEnt);
                orderByDate.setCategory(categoryEntidad);

                //Las columnas deben ir en el siguiente orden: event, infoEvent, startDate, endDate, hint1, hint2, hint3

                if(currentRow.getCell(0) != null){
                    orderByDate.setEvent(currentRow.getCell(0).getStringCellValue());
                    String event = currentRow.getCell(0).getStringCellValue();

                    // Verificar si ya existe la combinación de categoría y evento
                    if (orderByDateRepository.existsByCategoryIdAndEvent(idCategory, event)) {
                        throw new GameModeException(String.format("En la fila %d, la categoría \"%s\" ya tiene asociado el evento \"%s\". Intente ingresar otro evento.", rowIndex, categoryEntidad.getName(), event));
                    }

                    orderByDate.setEvent(event);
                }

                if(currentRow.getCell(1) != null){
                    orderByDate.setInfoEvent(currentRow.getCell(1).getStringCellValue());
                }

                if(currentRow.getCell(2) != null){
                    if (currentRow.getCell(2).getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(currentRow.getCell(2))) {
                        // Convertir Date a LocalDate
                        Date date = currentRow.getCell(2).getDateCellValue();
                        startDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                        orderByDate.setStartDate(startDate);
                    } else {
                        // Manejo de error o log en caso de que la celda no sea una fecha
                        throw new GameModeException("La celda no contiene una fecha válida");
                    }

                }

                if(currentRow.getCell(3) != null){

                    if (currentRow.getCell(3).getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(currentRow.getCell(3))) {
                        // Convertir Date a LocalDate
                        Date date = currentRow.getCell(3).getDateCellValue();
                        endDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                        orderByDate.setEndDate(endDate);
                    } else {
                        // Manejo de error en caso de que la celda no sea una fecha
                        throw new GameModeException("La celda no contiene una fecha válida");
                    }

                }

                // Validar que startDate sea menor que endDate
                if (startDate != null && endDate != null && !startDate.isBefore(endDate)) {
                    throw new GameModeException(" En la fila " + rowIndex + " la fecha de inicio debe ser anterior a la fecha de fin para el evento: " + orderByDate.getEvent());
                }

                if(currentRow.getCell(4) != null){
                    orderByDate.setHint1(currentRow.getCell(4).getStringCellValue());
                }
                
                if(currentRow.getCell(5) != null){
                    orderByDate.setHint2(currentRow.getCell(5).getStringCellValue());
                }

                if(currentRow.getCell(6) != null){
                    orderByDate.setHint3(currentRow.getCell(6).getStringCellValue());
                }

                orderByDateRepository.save(orderByDate);
                rowIndex++;

            }
        }
        return ResponseEntity.ok("Se cargaron correctamente los eventos para la categoria " + categoryEntidad.getName() + " y modo de juego " + gameModeEnt.getName());
    }
    
}
