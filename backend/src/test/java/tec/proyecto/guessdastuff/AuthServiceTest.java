/*package tec.proyecto.guessdastuff;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import tec.proyecto.guessdastuff.converters.DateConverter;
import tec.proyecto.guessdastuff.dtos.*;
import tec.proyecto.guessdastuff.entities.User;
import tec.proyecto.guessdastuff.enums.*;
import tec.proyecto.guessdastuff.exceptions.UserException;
import tec.proyecto.guessdastuff.repositories.UserRepository;
import tec.proyecto.guessdastuff.services.AuthService;
import tec.proyecto.guessdastuff.services.JwtService;


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

    private AuthService authService;

    private User testUser;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);  // Initializes mocks
        authService = new AuthService(userRepository, jwtService, null, authenticationManager, null);  // Pass mocked dependencies
        testUser = User.builder()
            .id(1L)
            .username("testuser")
            .email("testuser@example.com")
            .password("password123")
            .status(EStatus.REGISTERED) // Set necessary non-null fields
            .role(ERole.ROLE_USER)
            .atCreate(LocalDateTime.now())  // Use LocalDateTime instead of LocalDate
            .atUpdate(LocalDateTime.now())  // Use LocalDateTime instead of LocalDate
            .build();
    }

    @Test
    public void testRegister() {
        // Given
        String dateStr = "1990-08-15";  // Sample date as a String
        DtoDate birthday = parseStringToDtoDate(dateStr);  // Convert String to DtoDate

        DtoRegisterRequest registerRequest = DtoRegisterRequest.builder()
            .username("exampleUser")
            .password("password123")
            .email("example@example.com")
            .role(0)
            .urlPerfil("someUrl")
            .country("SomeCountry")
            .birthday(birthday) // Set the birthday as DtoDate
            .build();

        User newUser = User.builder()
            .username("exampleUser")
            .password("password123") // Mock password encoding
            .email("example@example.com")
            .role(ERole.ROLE_USER)
            .birthday(LocalDate.of(1990, 8, 15)) // Birthday
            .status(EStatus.REGISTERED)
            .build();

        // Mock behavior
        when(userRepository.save(any(User.class))).thenReturn(newUser);  // Mock save to return newUser
        when(jwtService.getToken(any(User.class))).thenReturn("fake-token");  // Mock JWT token

        // When
        DtoAuthResponse response = authService.register(registerRequest);  // Call register method

        // Then
        assertNotNull(response);
        assertEquals("Usuario registrado correctamente!", response.getMessage());
        assertEquals("exampleUser", response.getUsername());
        assertEquals("fake-token", response.getToken());

        // Verify interactions with mocks
        verify(userRepository, times(1)).save(any(User.class));
        verify(jwtService, times(1)).getToken(any(User.class));
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
    public void testLogin_Success() throws UserException {
        DtoLoginRequest loginRequest = new DtoLoginRequest("testuser", "password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null); // Mock authenticate call
        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(testUser));
        when(jwtService.generateTokenWithClaims(anyMap(), any(UserDetails.class)))
                .thenReturn("sampleToken");

        DtoAuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("User successfully logged in", response.getMessage());
        assertEquals("testuser", response.getUsername());
        assertEquals("sampleToken", response.getToken());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    public void testLogin_UserBlocked_ThrowsException() {
        testUser.setStatus(EStatus.BLOCKED);
        DtoLoginRequest loginRequest = new DtoLoginRequest("testuser", "password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(testUser));

        UserException thrown = assertThrows(UserException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals("El usuario testuser se encuentra bloqueado o eliminado. Por favor contactese con el administrador.", thrown.getMessage());
    }

    @Test
    public void testRegister_Success() {
        // Create a DtoDate object to use in the test
        DtoDate testDate = new DtoDate(2000, 1, 1);

        // Mock the behavior of the password encoder and date converter
        when(passwordEncoder.encode("password123")).thenReturn("encryptedpassword");
        when(dateConverter.toLocalDate(testDate)).thenReturn(LocalDate.of(2000, 1, 1));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.getToken(any(User.class))).thenReturn("sampleToken");

        // Create a sample register request
        DtoRegisterRequest registerRequest = DtoRegisterRequest.builder()
                .username("newuser")
                .password("password123")
                .email("newuser@example.com")
                .birthday(testDate) // Pass the DtoDate object here
                .build();

        DtoAuthResponse response = authService.register(registerRequest);

        // Assertions
        assertNotNull(response);
        assertEquals("Usuario registrado correctamente!", response.getMessage());
        assertEquals("newuser", response.getUsername());
        assertEquals("sampleToken", response.getToken());

        // Verify the save operation is called once
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testLogout_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        ResponseEntity<?> response = authService.logout("testuser");

        assertNotNull(response);
        assertEquals("Finalizo la sesion", response.getBody());
        verify(userRepository, times(1)).save(testUser);
        assertEquals(EStatus.OFFLINE, testUser.getStatus());
    }
}
*/