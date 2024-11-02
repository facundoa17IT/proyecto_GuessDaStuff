package tec.proyecto.guessdastuff.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import tec.proyecto.guessdastuff.entities.GameMode;

@Repository
public interface LoadDataRepository extends JpaRepository<GameMode, Long> {

  @Modifying
  @Query(value = "INSERT INTO users (at_create, at_update, birthday, id, country, email, password, reset_token, role, status, url_perfil, username) VALUES " +
      "(CURRENT_DATE, CURRENT_DATE, '1998-04-26', 1010, 'Uruguay', 'admin@gmail.com', '$2a$10$t4/y8p2qgO/8ItJvsXgGn..l2KgsfTkAE.PBE2za/JsQhGILWjAZe', null, 'ROLE_ADMIN', 'REGISTERED', 'urlDoMacaco', 'admin'), " +
      "(CURRENT_DATE, CURRENT_DATE, '2003-04-26', 1001, 'Uruguay', 'user@gmail.com', '$2a$10$t4/y8p2qgO/8ItJvsXgGn..l2KgsfTkAE.PBE2za/JsQhGILWjAZe', null, 'ROLE_USER', 'REGISTERED', 'urlDoMacaco', 'user');", nativeQuery = true)
  void insertUsers();

  ///////////////////////////////

  @Modifying
  @Query(value = "INSERT INTO public.game_mode(description, name, url_icon) VALUES " +
      "('Multiple Choice', 'MC', 'MC.URL'), " +
      "('Guess Phrase', 'GP', 'GP.URL'), " +
      "('Order Word', 'OW', 'OW.URL');", nativeQuery = true)
  void insertGameModes();

  ///////////////////////////////

  @Modifying
  @Query(value = "INSERT INTO category (id, description, name, status, url_icon) VALUES " +
      "(1, 'Películas clásicas de culto', 'Cine', 'INITIALIZED', 'cine_icon.png'), " +
      "(2, 'Eventos históricos importantes', 'Historia', 'INITIALIZED', 'historia_icon.png'), " +
      "(3, 'Descubrimientos y avances científicos', 'Ciencia', 'INITIALIZED', 'ciencia_icon.png'), " +
      "(4, 'Deportes y logros deportivos', 'Deportes', 'INITIALIZED', 'deportes_icon.png'), " +
      "(5, 'Géneros y estilos musicales', 'Música', 'INITIALIZED', 'musica_icon.png');", nativeQuery = true)
  void insertCategories();

  ///////////////////////////////

  @Modifying
  @Query(value = "INSERT INTO games (" +
          "id, " +
          "id_category, " +
          "id_game_mode, " +
          "dtype, " +
          "hint1, " +
          "hint2, " +
          "hint3, " +
          "random_word1, " +
          "random_word2, " +
          "random_word3, " +
          "random_correct_word, " +
          "question, " +
          "phrase, " +
          "correct_word, " +
          "word" +
      ") VALUES " +
      "(1020, 1, 'MC', 'MultipleChoice', 'Saga de ciencia ficción', 'Batallas espaciales', 'Robots y Jedi', 'Galaxia', 'Espacio', 'Universo', 'Star Wars', '¿Cuál es la película icónica de George Lucas?', NULL, NULL, NULL), " +
      "(1021, 1, 'MC', 'MultipleChoice', 'Drama familiar', 'Historia de lealtad y traición', 'Premios de cine', 'Familia', 'Cosa Nostra', 'Omertá', 'El Padrino', '¿Cuál es la famosa película de mafias dirigida por Coppola?', NULL, NULL, NULL), " +
      "(1022, 2, 'MC', 'MultipleChoice', 'Separación histórica', 'Reconstrucción social', 'Simbolismo de libertad', 'Muro', 'Alemania Oriental', 'Alemania Occidental', 'Berlín', '¿Qué ciudad representa la caída de la Guerra Fría?', NULL, NULL, NULL), " +
      "(1023, 2, 'MC', 'MultipleChoice', 'Exploración espacial', 'Éxito de la misión Apolo', 'Hito para la humanidad', 'Luna', 'Cohete', 'Astronauta', 'Alunizaje', '¿Cuál fue el primer aterrizaje humano en la Luna?', NULL, NULL, NULL), " +
      "(1024, 2, 'MC', 'MultipleChoice', 'Conflicto global', 'Alianzas internacionales', 'Resolución de paz', 'Victoria', 'Derrota', 'Armisticio', 'Segunda Guerra Mundial', '¿Qué evento histórico tuvo a los Aliados y al Eje como bandos?', NULL, NULL, NULL), " +
      "(1025, 3, 'MC', 'MultipleChoice', 'Medicamento revolucionario', 'Impacto en la salud mundial', 'Descubrimiento casual', 'Bacterias', 'Infección', 'Curación', 'Penicilina', '¿Cuál fue el descubrimiento de Alexander Fleming?', NULL, NULL, NULL), " +
      "(1026, 3, 'MC', 'MultipleChoice', 'Principios de la física moderna', 'Conceptos de tiempo y espacio', 'Impacto científico', 'Teoría', 'Espacio', 'Tiempo', 'Relatividad', '¿Qué teoría famosa es obra de Einstein?', NULL, NULL, NULL), " +
      "(1027, 4, 'MC', 'MultipleChoice', 'Campeonato mundial', 'Evento deportivo histórico', 'Triunfo brasileño', 'Copa', 'Campeón', 'Estadio', 'Mundial 1970', '¿Qué torneo ganó Brasil con Pelé como estrella?', NULL, NULL, NULL), " +
      "(1028, 4, 'MC', 'MultipleChoice', 'Evento deportivo destacado', 'Récords de medallas', 'Icono de la natación', 'Competencia', 'Estadio Nacional', 'Ceremonia', 'Olimpiadas 2008', '¿Dónde se llevaron a cabo las Olimpiadas con la participación de Phelps en 2008?', NULL, NULL, NULL);",
      nativeQuery = true)
  void insertMultipleMC();
  
  

  ///////////////////////////////

  @Modifying
@Query(value = "INSERT INTO games (" +
        "id, " +
        "id_category, " +
        "id_game_mode, " +
        "dtype, " +
        "hint1, " +
        "hint2, " +
        "hint3, " +
        "random_word1, " +
        "random_word2, " +
        "random_word3, " +
        "random_correct_word, " +
        "phrase, " +
        "correct_word, " +
        "word, " +
        "question" +
    ") VALUES " +
    "(1030, 3, 'OW', 'OrderWord', 'Descubrimiento de la penicilina', 'Alexander Fleming', 'Antibióticos', NULL, NULL, NULL, NULL, NULL, NULL, 'penicilina', NULL), " +
    "(1031, 2, 'OW', 'OrderWord', 'Caída del Muro de Berlín', 'Alemania', 'Unificación', NULL, NULL, NULL, NULL, NULL, NULL, 'muro de Berlín', NULL), " +
    "(1033, 3, 'OW', 'OrderWord', 'Género musical uruguayo', 'Percusión', 'Raíces africanas', NULL, NULL, NULL, NULL, NULL, NULL, 'candombe', NULL), " +
    "(1034, 4, 'OW', 'OrderWord', 'Mundial de fútbol de 1970', 'Brasil', 'Triunfo mundial', NULL, NULL, NULL, NULL, NULL, NULL, 'fútbol', NULL), " +
    "(1032, 1, 'OW', 'OrderWord', 'Lanzamiento de Star Wars', 'George Lucas', 'Saga de películas', NULL, NULL, NULL, NULL, NULL, NULL, 'Star Wars', NULL);",
    nativeQuery = true)
void insertMultiplesOW(); 
  
  ///////////////////////////////

  @Modifying
  @Query(value = "INSERT INTO games (" +
          "id, " +
          "id_category, " +
          "id_game_mode, " +
          "dtype, " +
          "hint1, " +
          "hint2, " +
          "hint3, " +
          "random_word1, " +
          "random_word2, " +
          "random_word3, " +
          "random_correct_word, " +
          "phrase, " +
          "correct_word, " +
          "word, " +
          "question" +
      ") VALUES " +
      "(1040, 1, 'GP', 'GuessPhrase', 'Dirigida por Francis Ford Coppola', 'Protagonizada por Marlon Brando', 'Es una película de gánsteres', NULL, NULL, NULL, NULL, 'Película que popularizó la frase \\\"Le haré una oferta que no podrá rechazar\\\"', 'El Padrino', NULL, NULL), " +
      "(1041, 1, 'GP', 'GuessPhrase', 'Protagonista de la saga', 'Es un actor estadounidense', 'Conocido por sus escenas de acción', NULL, NULL, NULL, NULL, 'Actor famoso por interpretar a Ethan Hunt en \\\"Misión Imposible\\\"', 'Tom Cruise', NULL, NULL), " +
      "(1042, 2, 'GP', 'GuessPhrase', 'Revolucionó la electricidad', 'Es un tipo de corriente eléctrica', 'Se opone a la corriente directa', NULL, NULL, NULL, NULL, 'Tipo de corriente que revolucionó el uso de electricidad en el mundo', 'Corriente alterna', NULL, NULL), " +
      "(1043, 2, 'GP', 'GuessPhrase', 'Es el planeta más pequeño del sistema solar', 'Es rocoso y sin atmósfera', 'No tiene lunas', NULL, NULL, NULL, NULL, 'Planeta que se encuentra más cerca del sol', 'Mercurio', NULL, NULL), " + 
      "(1044, 3, 'GP', 'GuessPhrase', 'Banda británica', 'Freddie Mercury era su vocalista', 'La canción es de los años 70', NULL, NULL, NULL, NULL, 'Banda que popularizó la canción \\\"Bohemian Rhapsody\\\"', 'Queen', NULL, NULL), " + 
      "(1045, 3, 'GP', 'GuessPhrase', 'Conocido como el Rey del Pop', 'Fue un éxito en los años 80', 'El videoclip tiene temática de terror', NULL, NULL, NULL, NULL, 'Cantante del éxito musical \\\"Thriller\\\"', 'Michael Jackson', NULL, NULL), " + 
      "(1046, 4, 'GP', 'GuessPhrase', 'Se encuentra en Dubái', 'Tiene más de 160 pisos', 'Es una atracción turística famosa', NULL, NULL, NULL, NULL, 'Edificio más alto del mundo ubicado en Dubái', 'Burj Khalifa', NULL, NULL), " + 
      "(1047, 4, 'GP', 'GuessPhrase', 'Pasa por Brasil', 'Es conocido por su biodiversidad', 'Desemboca en el Océano Atlántico', NULL, NULL, NULL, NULL, 'Río más largo de Sudamérica', 'Amazonas', NULL, NULL), " + 
      "(1048, 5, 'GP', 'GuessPhrase', 'Artista estadounidense', 'Reconocido por sus letras poéticas', 'Comienza con B', NULL, NULL, NULL, NULL, 'Cantante de la famosa canción \\\"Like a Rolling Stone\\\"', 'Bob Dylan', NULL, NULL);", 
      nativeQuery = true)
  void insertMultipleGP();
  
  
  

};
