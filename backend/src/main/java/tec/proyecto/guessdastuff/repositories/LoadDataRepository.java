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
      "('Order By Date', 'OBD', 'OBD.URL'), " +
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
  @Query(value = "INSERT INTO games (end_date, start_date, id, id_category, dtype, event, correct_word, hint1, hint2, hint3, id_game_mode, info_event, phrase, word) VALUES " +
      "('1977-06-25', '1977-05-25', 1020, 1, 'OrderByDate', 'Lanzamiento de Star Wars', NULL, 'Icono del espacio', 'George Lucas', 'Saga de películas', 'OBD', 'estreno de la primera película de Star Wars', NULL, NULL), " +
      "('1972-04-15', '1972-03-15', 1021, 1, 'OrderByDate', 'Lanzamiento de El Padrino', NULL, 'Mafia', 'Francis Ford Coppola', 'Adaptación de novela', 'OBD', 'estreno de la película El Padrino', NULL, NULL), " +
      "('1989-11-10', '1989-11-09', 1022, 2, 'OrderByDate', 'Caída del Muro de Berlín', NULL, 'Guerra Fría', 'Alemania', 'Unificación', 'OBD', 'fin de la división entre Alemania Oriental y Occidental', NULL, NULL), " +
      "('1969-07-21', '1969-07-20', 1023, 2, 'OrderByDate', 'Llegada del hombre a la luna', NULL, 'NASA', 'Neil Armstrong', 'Apolo 11', 'OBD', 'primer alunizaje del Apolo 11', NULL, NULL), " +
      "('1945-09-02', '1945-05-08', 1024, 2, 'OrderByDate', 'Fin de la Segunda Guerra Mundial', NULL, 'Aliados', 'Eje', 'Paz Mundial', 'OBD', 'rendición de Alemania y Japón', NULL, NULL), " +
      "('1928-10-05', '1928-09-28', 1025, 3, 'OrderByDate', 'Descubrimiento de la penicilina', NULL, 'Alexander Fleming', 'Infecciones', 'Antibióticos', 'OBD', 'primer antibiótico efectivo', NULL, NULL), " +
      "('1905-07-15', '1905-06-30', 1026, 3, 'OrderByDate', 'Publicación de la teoría de la relatividad', NULL, 'Einstein', 'Tiempo y espacio', 'Física moderna', 'OBD', 'Einstein publica la teoría de la relatividad', NULL, NULL), " +
      "('1970-06-21', '1970-05-31', 1027, 4, 'OrderByDate', 'Mundial de fútbol de 1970', NULL, 'Pelé', 'Brasil', 'Triunfo mundial', 'OBD', 'Brasil gana la Copa del Mundo en México', NULL, NULL), " +
      "('2008-08-24', '2008-08-08', 1028, 4, 'OrderByDate', 'Juegos Olímpicos de 2008 en Beijing', NULL, 'Beijing', 'Ceremonia espectacular', 'Michael Phelps', 'OBD', 'se celebran los Juegos Olímpicos en China', NULL, NULL);", nativeQuery = true)
  void insertMultipleODB();

  ///////////////////////////////

  @Modifying
  @Query(value = "INSERT INTO public.games (end_date, start_date, id, id_category, dtype, correct_word, event, hint1, hint2, hint3, id_game_mode, info_event, phrase, word) VALUES " +
      "(NULL, NULL, 1030, 3, 'OrderWord', NULL, NULL, 'Descubrimiento de la penicilina', 'Alexander Fleming', 'Antibióticos', 'OW', NULL, NULL, 'penicilina'), " +
      "(NULL, NULL, 1031, 2, 'OrderWord', NULL, NULL, 'Caída del Muro de Berlín', 'Alemania', 'Unificación', 'OW', NULL, NULL, 'muro de Berlín'), " +
      "(NULL, NULL, 1033, 3, 'OrderWord', NULL, NULL, 'Género musical uruguayo', 'Percusión', 'Raíces africanas', 'OW', NULL, NULL, 'candombe'), " +
      "(NULL, NULL, 1034, 4, 'OrderWord', NULL, NULL, 'Mundial de fútbol de 1970', 'Brasil', 'Triunfo mundial', 'OW', NULL, NULL, 'fútbol'), " +
      "(NULL, NULL, 1032, 1, 'OrderWord', NULL, NULL, 'Lanzamiento de Star Wars', 'George Lucas', 'Saga de películas', 'OW', NULL, NULL, 'Star Wars');",
      nativeQuery = true)
  void insertMultiplesOW();  
  
  ///////////////////////////////

  @Modifying
  @Query(value = "INSERT INTO public.games (end_date, start_date, id, id_category, dtype, correct_word, event, hint1, hint2, hint3, id_game_mode, info_event, phrase, word) VALUES " +
      "(NULL, NULL, 1040, 1, 'GuessPhrase', '1972', NULL, 'Dirigida por Francis Ford Coppola', 'Protagonizada por Marlon Brando', 'Es una película de gánsteres', 'GP', NULL, '¿En qué año se estrenó El Padrino?', NULL), " +
      "(NULL, NULL, 1041, 1, 'GuessPhrase', 'Tom Cruise', NULL, 'Protagonista de la saga', 'Es un actor estadounidense', 'Conocido por sus escenas de acción', 'GP', NULL, '¿Cuál es el nombre del actor principal en Misión Imposible?', NULL), " +
      "(NULL, NULL, 1042, 2, 'GuessPhrase', 'Corriente Alterna', NULL, 'Revolucionó la electricidad', 'Es un tipo de corriente eléctrica', 'Se opone a la corriente directa', 'GP', NULL, '¿Cuál fue el invento más famoso de Nikola Tesla?', NULL), " +
      "(NULL, NULL, 1043, 2, 'GuessPhrase', 'Mercurio', NULL, 'Es el planeta más pequeño del sistema solar', 'Es rocoso y sin atmósfera', 'No tiene lunas', 'GP', NULL, '¿Cuál es el planeta más cercano al sol?', NULL), " + 
      "(NULL, NULL, 1044, 3, 'GuessPhrase', 'Queen', NULL, 'Banda británica', 'Freddie Mercury era su vocalista', 'La canción es de los años 70', 'GP', NULL, '¿Cuál es el nombre de la banda que canta Bohemian Rhapsody?', NULL), " + 
      "(NULL, NULL, 1045, 3, 'GuessPhrase', 'Michael Jackson', NULL, 'Conocido como el Rey del Pop', 'Fue un éxito en los años 80', 'El videoclip tiene temática de terror', 'GP', NULL, '¿Quién canta Thriller?', NULL), " + 
      "(NULL, NULL, 1046, 4, 'GuessPhrase', 'Burj Khalifa', NULL, 'Se encuentra en Dubái', 'Tiene más de 160 pisos', 'Es una atracción turística famosa', 'GP', NULL, '¿Cuál es el edificio más alto del mundo?', NULL), " + 
      "(NULL, NULL, 1047, 4, 'GuessPhrase', 'Amazonas', NULL, 'Pasa por Brasil', 'Es conocido por su biodiversidad', 'Desemboca en el Océano Atlántico', 'GP', NULL, '¿Cuál es el río más largo de Sudamérica?', NULL), " + 
      "(NULL, NULL, 1048, 5, 'GuessPhrase', 'Bob Dylan', NULL, 'Artista estadounidense', 'Reconocido por sus letras poéticas', 'Comienza con B', 'GP', NULL, '¿Quién canta Like a Rolling Stone?', NULL);", 
      nativeQuery = true)
  void insertMultipleGP();
  

};
