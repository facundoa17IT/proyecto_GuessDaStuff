package tec.proyecto.guessdastuff.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tec.proyecto.guessdastuff.repositories.LoadDataRepository;

@Service
public class LoadDataService {
  @Autowired
    private LoadDataRepository loadDataRepository;

    @Transactional
   public String loadData() {

    //init users
    loadDataRepository.insertUsers();

    //insert games_mode
    loadDataRepository.insertGameModes();

    //insert category
    loadDataRepository.insertCategories();

    //insert MC
    loadDataRepository.insertMultipleMC();

    //insert OW
    loadDataRepository.insertMultiplesOW();


    //insert GP
    loadDataRepository.insertMultipleGP();

    return "Data creada con exito";
  }
}
