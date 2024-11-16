package tec.proyecto.guessdastuff;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import tec.proyecto.guessdastuff.converters.DateConverter;
import tec.proyecto.guessdastuff.dtos.DtoAuthResponse;
import tec.proyecto.guessdastuff.dtos.DtoDate;
import tec.proyecto.guessdastuff.dtos.DtoLoginRequest;
import tec.proyecto.guessdastuff.dtos.DtoRegisterRequest;
import tec.proyecto.guessdastuff.entities.User;
import tec.proyecto.guessdastuff.entitiesSocket.DtoUserOnline;
import tec.proyecto.guessdastuff.enums.ERole;
import tec.proyecto.guessdastuff.enums.EStatus;
import tec.proyecto.guessdastuff.exceptions.UserException;
import tec.proyecto.guessdastuff.repositories.UserRepository;
import tec.proyecto.guessdastuff.services.AuthService;
import tec.proyecto.guessdastuff.services.JwtService;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private DateConverter dateConverter;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private DtoLoginRequest loginRequest;
    private DtoRegisterRequest registerRequest;

    @BeforeEach
    public void setUp(){
        MockitoAnnotations.openMocks(this);  // Initializes mocks
        authService = new AuthService(userRepository, jwtService, passwordEncoder, authenticationManager, dateConverter);
        //authService = new AuthService(userRepository, jwtService, null, authenticationManager, null);  // Pass mocked dependencies
        registerRequest = new DtoRegisterRequest("testuser", "password123", "testuser@example.com", 0, "url", "USA", new DtoDate(1, 1, 2000));
        // Configura el mock de dateConverter para que devuelva una fecha específica
        lenient().when(dateConverter.toLocalDate(any(DtoDate.class))).thenReturn(LocalDate.of(2000, 1, 1));
        
        testUser = User.builder()

            .id(1L)
            .username("testuser")
            .email("testuser@example.com")
            .password("password123")
            .status(EStatus.REGISTERED) // Set necessary non-null fields
            .role(ERole.ROLE_USER)
            .atCreate(LocalDateTime.now())
            .atUpdate(LocalDateTime.now())
            .build();

        loginRequest = new DtoLoginRequest("testuser", "password123");


    // Stubbing necesario solo para el test login
    lenient().when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
        .thenReturn(null); // Usado en el test de login
    lenient().when(userRepository.findByUsername("testuser"))
        .thenReturn(Optional.of(testUser)); // Usado en el test de login
    lenient().when(jwtService.generateTokenWithClaims(anyMap(), any(UserDetails.class)))
        .thenReturn("sampleToken"); // Usado en el test de login

    testUser = new User();  // Inicializa tu objeto testUser

    // Stubbing necesario solo para el test CheckPassword
    lenient().when(passwordEncoder.encode("password123")).thenReturn("encodedPassword123");

    // Stubbing necesario solo para el test CheckPassword
    lenient().when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);
    }

    @Test
    public void testAddListConnect_Success() throws Exception {
    // Given: Un objeto DtoUserOnline
    DtoUserOnline userOnline = new DtoUserOnline(1L, "testuser", "testuser@example.com");

    // When: Se agrega el usuario a la lista
    authService.addListConnect(userOnline);

    // Then: Verificar que la lista contiene el usuario
    Field connectedUsersField = authService.getClass().getDeclaredField("connectedUsers");
    connectedUsersField.setAccessible(true);
    @SuppressWarnings("unchecked")
    List<DtoUserOnline> connectedUsers = (List<DtoUserOnline>) connectedUsersField.get(authService);

    assertNotNull(connectedUsers); // La lista no debe ser null
    assertEquals(1, connectedUsers.size()); // Debe haber un elemento en la lista
    assertEquals(userOnline, connectedUsers.get(0)); // El elemento debe ser el mismo que agregamos
    }

    //CheckPassword exito
    @Test
    public void testCheckPassword_Success() {
        String rawPassword = "password123";
        String encodedPassword = "encodedPassword123"; // Simula una contraseña codificada
    
        // Stubbing del comportamiento de passwordEncoder.matches
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);
    
        // Llamada al método checkPassword
        boolean result = authService.checkPassword(rawPassword, encodedPassword);
    
        // Verificación
        assertTrue(result);  // Verifica que el resultado sea true (la contraseña coincide)
        verify(passwordEncoder, times(1)).matches(rawPassword, encodedPassword); // Verifica que matches haya sido llamado una vez
    }

    //CheckPassword fallo 
    @Test
    public void testCheckPassword_Failure() {
        String rawPassword = "password123";
        String encodedPassword = "encodedPassword123"; // Simula una contraseña codificada

        // Stubbing del comportamiento de passwordEncoder.matches
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(false);

        // Llamada al método checkPassword
        boolean result = authService.checkPassword(rawPassword, encodedPassword);

        // Verificación
        assertFalse(result);  // Verifica que el resultado sea false (la contraseña no coincide)
        verify(passwordEncoder, times(1)).matches(rawPassword, encodedPassword); // Verifica que matches haya sido llamado una vez
    }

    //Login exito
    @Test
    public void testLogin_Success() throws UserException {

    // Inicialización del testUser

    testUser = User.builder()
    .id(1L)
    .username("testuser")
    .email("testuser@example.com")
    .password("encodedPassword123")
    .status(EStatus.REGISTERED)
    .role(ERole.ROLE_USER)
    .atCreate(LocalDateTime.now())
    .atUpdate(LocalDateTime.now())
    .build();

    // Mockear la autenticación
    when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
        .thenReturn(null);  // Simula autenticación exitosa

    // Usar un Answer para devolver el mismo usuario en ambas invocaciones
    when(userRepository.findByUsername(anyString()))
        .thenAnswer(invocation -> Optional.of(testUser));  // Devuelve el mismo testUser para ambas invocaciones

    // Mockear la generación de token
    when(jwtService.generateTokenWithClaims(any(), any(UserDetails.class)))
        .thenReturn("sampleToken");  // Simula la generación del token JWT

    // When: Llamada al método login
    DtoAuthResponse response = authService.login(loginRequest);

    // Then: Verificaciones
    assertNotNull(response);
    assertEquals("User successfully logged in", response.getMessage());
    assertEquals("testuser", response.getUsername());
    assertEquals("sampleToken", response.getToken());

    // Verificar que findByUsername se haya llamado dos veces
    verify(userRepository, times(2)).findByUsername("testuser");  // Verifica que findByUsername se haya llamado dos veces
    verify(jwtService).generateTokenWithClaims(any(), any(UserDetails.class));  // Verifica la llamada a jwtService
    verify(userRepository).save(testUser);  // Verifica la actualización del estado
    }

    //Login usuario bloqueado
    @Test
    public void testLogin_UserBlocked_ThrowsException() {

        // Given: Usuario bloqueado
    testUser.setStatus(EStatus.BLOCKED);
    testUser.setUsername("testuser"); // Asegúrate de configurar el username

    when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
        .thenReturn(null);
    when(userRepository.findByUsername("testuser"))
        .thenReturn(Optional.of(testUser));

    // When: Intentar hacer login
    UserException exception = assertThrows(UserException.class, () -> {
        authService.login(loginRequest);
    });

    // Then: Verificar que se lanza la excepción con el mensaje adecuado
    assertEquals("El usuario testuser se encuentra bloqueado o eliminado. Por favor contactese con el administrador.", exception.getMessage());
    }
        
    //Login usuario no existe
    @Test
    public void testLogin_UserNotFound_ThrowsException() {
        // Given: El usuario no existe en la base de datos
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(null);
        when(userRepository.findByUsername("testuser"))
            .thenReturn(Optional.empty());  // Simula que el usuario no existe

        // When: Intentar hacer login
        UserException exception = assertThrows(UserException.class, () -> {
            authService.login(loginRequest);
        });

        // Then: Verificar que se lanza la excepción con el mensaje adecuado
        assertEquals("User not found", exception.getMessage());
    }

    //Registro exito
    @Test
    public void testRegister_Success() {
    // Given: Datos de registro válidos
    DtoRegisterRequest request = DtoRegisterRequest.builder()
    .username("newuser")
    .password("securepassword")
    .email("newuser@example.com")
    .role(0) // ROLE_USER
    .urlPerfil("http://example.com/profile.png")
    .country("USA")
    .birthday(new DtoDate(2000, 1, 1))
    .build();

    LocalDate birthdate = LocalDate.of(2000, 1, 1);

    // Creación manual de la instancia User
    User userToSave = User.builder()
        .username(request.getUsername())
        .password("encodedPassword") // La contraseña ya codificada
        .email(request.getEmail())
        .role(ERole.ROLE_USER)
        .urlPerfil(request.getUrlPerfil())
        .country(request.getCountry())
        .birthday(birthdate)
        .status(EStatus.REGISTERED)
        .build();

    User savedUser = User.builder()
        .id(1L) // Asignar el ID
        .username(userToSave.getUsername())
        .password(userToSave.getPassword())
        .email(userToSave.getEmail())
        .role(userToSave.getRole())
        .urlPerfil(userToSave.getUrlPerfil())
        .country(userToSave.getCountry())
        .birthday(userToSave.getBirthday())
        .status(userToSave.getStatus())
        .build();

    // Configuración de los mocks
    when(dateConverter.toLocalDate(any())).thenReturn(birthdate);
    when(passwordEncoder.encode("securepassword")).thenReturn("encodedPassword");
    when(userRepository.save(any(User.class))).thenReturn(savedUser);
    when(userRepository.findById(1L)).thenReturn(Optional.of(savedUser));

    // Capturar el argumento de jwtService.getToken
    ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
    when(jwtService.getToken(userCaptor.capture())).thenReturn("mockedJwtToken");

    // When: Registrar usuario
    DtoAuthResponse response = authService.register(request);

    // Then: Verificar respuesta
    assertNotNull(response);
    assertEquals("Usuario registrado correctamente!", response.getMessage());
    assertEquals("newuser", response.getUsername());
    assertEquals("ROLE_USER", response.getRole());
    assertEquals("mockedJwtToken", response.getToken());

    // Verificar interacciones con los mocks
    verify(dateConverter).toLocalDate(request.getBirthday());
    verify(passwordEncoder).encode("securepassword");
    verify(userRepository).save(any(User.class));
    verify(userRepository).findById(1L);
    verify(jwtService).getToken(any(User.class));

    // Verificar que el objeto capturado tiene las propiedades esperadas
    User capturedUser = userCaptor.getValue();
    assertNotNull(capturedUser);
    assertEquals("newuser", capturedUser.getUsername());
    assertEquals("encodedPassword", capturedUser.getPassword());
    assertEquals(ERole.ROLE_USER, capturedUser.getRole());
    assertEquals("USA", capturedUser.getCountry());
    assertEquals(EStatus.REGISTERED, capturedUser.getStatus());

    }

    //Registro Fallo, tira exception
    @Test
    public void testRegister_UserSaveFails_ThrowsException() {
         // Given: Datos de registro válidos
    DtoRegisterRequest request = DtoRegisterRequest.builder()
        .username("newuser")
        .password("securepassword")
        .email("newuser@example.com")
        .role(0) // ROLE_USER
        .urlPerfil("http://example.com/profile.png")
        .country("USA")
        .birthday(new DtoDate(2000, 1, 1))
        .build();
    
    LocalDate birthdate = LocalDate.of(2000, 1, 1);

    // Creación manual de la instancia User
    User userToSave = User.builder()
        .username(request.getUsername())
        .password("encodedPassword") // La contraseña ya codificada
        .email(request.getEmail())
        .role(ERole.ROLE_USER)
        .urlPerfil(request.getUrlPerfil())
        .country(request.getCountry())
        .birthday(birthdate)
        .status(EStatus.REGISTERED)
        .build();

    // Configuración de los mocks para simular el fallo
    when(dateConverter.toLocalDate(any())).thenReturn(birthdate);
    when(passwordEncoder.encode("securepassword")).thenReturn("encodedPassword");
    when(userRepository.save(any(User.class))).thenReturn(null); // Simular fallo en el guardado
    
    // When & Then: Registrar usuario y verificar que lanza excepción
    RuntimeException exception = assertThrows(RuntimeException.class, () -> {
        authService.register(request);
    });

    // Verificar mensaje de excepción
    assertEquals("User registration failed. Please try again.", exception.getMessage());

    // Verificar interacciones con los mocks
    verify(dateConverter).toLocalDate(request.getBirthday());
    verify(passwordEncoder).encode("securepassword");
    verify(userRepository).save(any(User.class));
    // Verificar que no se intentó obtener el token, ya que el guardado falló
    verifyNoInteractions(jwtService);
    }

    //Logout exito
    @Test
    public void testLogout_Success() {
    // Given: Un usuario válido con estado inicial
    User user = User.builder()
        .id(1L)
        .username("testuser")
        .email("testuser@example.com")
        .password("encodedPassword")
        .role(ERole.ROLE_USER)
        .urlPerfil("http://example.com/profile.png")
        .country("USA")
        .birthday(LocalDate.of(2000, 1, 1))
        .status(EStatus.ONLINE) // Estado inicial
        .build();

    when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
    when(userRepository.save(any(User.class))).thenReturn(user);

    // When: Se llama al método logout
    ResponseEntity<?> response = authService.logout("testuser");

    // Then: Verificar que la respuesta sea correcta
    assertNotNull(response);
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals("Finalizo la sesion", response.getBody());

    // Verificar que el usuario se actualizó y guardó correctamente
    verify(userRepository).findByUsername("testuser");
    ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
    verify(userRepository).save(userCaptor.capture());

    User updatedUser = userCaptor.getValue();
    assertEquals(EStatus.OFFLINE, updatedUser.getStatus());
    }

    //Logout usuario no existe
    @Test
    public void testLogout_UserNotFound() {
    // Given: El repositorio no encuentra el usuario
    when(userRepository.findByUsername("unknownuser")).thenReturn(Optional.empty());

    // When: Se llama al método logout
    NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> {
        authService.logout("unknownuser");
    });

    // Then: Verificar mensaje de excepción
    assertEquals("No value present", exception.getMessage());

    // Verificar que el repositorio no intentó guardar ningún usuario
    verify(userRepository).findByUsername("unknownuser");
    verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void testGetConnectedUsers_Success() throws Exception {
        // Given: Una lista de usuarios conectados
        DtoUserOnline user1 = new DtoUserOnline(1L, "user1", "user1@example.com");
        DtoUserOnline user2 = new DtoUserOnline(2L, "user2", "user2@example.com");
    
        // Usar reflexión para acceder a la lista privada y añadir usuarios manualmente
        Field connectedUsersField = authService.getClass().getDeclaredField("connectedUsers");
        connectedUsersField.setAccessible(true);
        @SuppressWarnings("unchecked")
        List<DtoUserOnline> connectedUsers = (List<DtoUserOnline>) connectedUsersField.get(authService);
        connectedUsers.add(user1);
        connectedUsers.add(user2);
    
        // When: Se llama al método getConnectedUsers
        List<DtoUserOnline> result = authService.getConnectedUsers();
    
        // Then: Verificar que la lista devuelta contiene los usuarios conectados
        assertNotNull(result); // La lista no debe ser null
        assertEquals(2, result.size()); // La lista debe contener dos elementos
        assertTrue(result.contains(user1)); // Debe contener al usuario1
        assertTrue(result.contains(user2)); // Debe contener al usuario2
    }

    // Utility method for String -> DtoDate conversion
    private DtoDate parseStringToDtoDate(String dateStr) {
    String[] parts = dateStr.split("-"); // Split the date by "-"
    int anio = Integer.parseInt(parts[0]);  // Year
    int mes = Integer.parseInt(parts[1]);   // Month
    int dia = Integer.parseInt(parts[2]);   // Day
    return new DtoDate(anio, mes, dia);     // Return the DtoDate object
    }

    @Test
    public void testRemoveListConnect_Success() throws Exception {
    // Given: Una lista con usuarios conectados
    DtoUserOnline user1 = new DtoUserOnline(1L, "user1", "user1@example.com");
    DtoUserOnline user2 = new DtoUserOnline(2L, "user2", "user2@example.com");

    // Usar reflexión para acceder a la lista privada y añadir usuarios manualmente
    Field connectedUsersField = authService.getClass().getDeclaredField("connectedUsers");
    connectedUsersField.setAccessible(true);
    @SuppressWarnings("unchecked")
    List<DtoUserOnline> connectedUsers = (List<DtoUserOnline>) connectedUsersField.get(authService);
    connectedUsers.add(user1);
    connectedUsers.add(user2);

    // When: Se llama al método removeListConnect con el username "user1"
    authService.removeListConnect("user1");

    // Then: Verificar que el usuario fue eliminado de la lista
    assertEquals(1, connectedUsers.size()); // Solo debe quedar un usuario
    assertFalse(connectedUsers.stream().anyMatch(user -> user.getUsername().equals("user1"))); // user1 no debe estar
    assertTrue(connectedUsers.stream().anyMatch(user -> user.getUsername().equals("user2"))); // user2 debe seguir
    }
}



