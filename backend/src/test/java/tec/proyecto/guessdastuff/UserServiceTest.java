package tec.proyecto.guessdastuff;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.io.IOException; 

import com.fasterxml.jackson.databind.ObjectMapper;

import tec.proyecto.guessdastuff.dtos.DtoAdmin;
import tec.proyecto.guessdastuff.dtos.DtoUserRequest;
import tec.proyecto.guessdastuff.dtos.DtoUserResponse;
import tec.proyecto.guessdastuff.entities.User;
import tec.proyecto.guessdastuff.enums.ERole;
import tec.proyecto.guessdastuff.enums.EStatus;
import tec.proyecto.guessdastuff.exceptions.UserException;
import tec.proyecto.guessdastuff.repositories.UserRepository;
import tec.proyecto.guessdastuff.services.CloudinaryService;
import tec.proyecto.guessdastuff.services.UserService;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @MockBean
    private UserRepository userRepo;

    @Autowired
    private ObjectMapper objectMapper;

    @Mock
    private CloudinaryService cloudinaryService;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private JavaMailSender mailSender;

    
    @Test
    void TestfindUserByUsername() throws UserException {
        
      var user = User.builder()
            .username("User 1")
            .password("1234")
            .email("user2@gmail.com")
            .role(ERole.ROLE_USER)
            .status(EStatus.ONLINE)
            .birthday(LocalDate.now()) 
            .country("Uruguay")
            .atCreate(LocalDateTime.now())
            .atUpdate(LocalDateTime.now())
            .build();

        when(userRepo.findByUsername("User 1")).thenReturn(Optional.of(user));

          var result = userService.findUserByUsername("User 1");

        assertNotNull(result);
        assertEquals("User 1", result.getUsername());
    }

    @Test
    void testlistUser() {
        List<User> users = Arrays.asList(
             User.builder()
            .username("User 1")
            .password("123")
            .email("user1@gmail.com")
            .role(ERole.ROLE_ADMIN)
            .status(EStatus.ONLINE)
            .birthday(LocalDate.now()) 
            .country("Uruguay")
            .atCreate(LocalDateTime.now())
            .atUpdate(LocalDateTime.now())
            .build(),

            User.builder()
            .username("User 2")
            .password("1234")
            .email("user2@gmail.com")
            .role(ERole.ROLE_USER)
            .status(EStatus.ONLINE)
            .birthday(LocalDate.now()) 
            .country("Uruguay")
            .atCreate(LocalDateTime.now())
            .atUpdate(LocalDateTime.now())
            .build()
        );

        
        when(userRepo.findAll()).thenReturn(users);

        List<DtoUserResponse> result = userService.listUsers();


        assertEquals(2, result.size());
        assertEquals("User 1", result.get(0).getUsername());
        assertEquals("User 2", result.get(1).getUsername());
     
    }

    @Test
    void testlistActiveUsers(){

    List<User> users = Arrays.asList(
             User.builder()
            .username("User 1")
            .password("123")
            .email("user1@gmail.com")
            .role(ERole.ROLE_ADMIN)
            .status(EStatus.ONLINE)
            .birthday(LocalDate.now()) 
            .country("Uruguay")
            .atCreate(LocalDateTime.now())
            .atUpdate(LocalDateTime.now())
            .build(),

            User.builder()
            .username("User 2")
            .password("1234")
            .email("user2@gmail.com")
            .role(ERole.ROLE_USER)
            .status(EStatus.ONLINE)
            .birthday(LocalDate.now()) 
            .country("Uruguay")
            .atCreate(LocalDateTime.now())
            .atUpdate(LocalDateTime.now())
            .build()
        );
    

        when(userRepo.findAll()).thenReturn(users);

        List<DtoUserResponse> result = userService.listUsers();

        assertEquals(EStatus.ONLINE, result.get(0).getStatus());
        assertEquals(EStatus.ONLINE, result.get(1).getStatus());
    }

    @Test
    void testeditUser() throws UserException, IOException {  // Añadimos IOException aquí
        var user = User.builder()
            .username("User 1")
            .password("1234")
            .email("user2@gmail.com")
            .role(ERole.ROLE_USER)
            .status(EStatus.ONLINE)
            .birthday(LocalDate.now()) 
            .country("Uruguay")
            .atCreate(LocalDateTime.now())
            .atUpdate(LocalDateTime.now())
            .build();
    
        // Datos para la edición del usuario
        var dtoEditUser = new DtoUserRequest();
        dtoEditUser.setPassword("newPassword");
        // Aquí no se toca el URL de perfil, ya que no estamos probando esa parte
    
        // Configuración de mocks
        when(userRepo.findByUsername("User 1")).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");
    
        // Ejecuta el método que deseas probar
        ResponseEntity<?> response = userService.editUser("User 1", dtoEditUser, null);  // Pasamos null ya que no estamos usando MultipartFile
    
        // Verificaciones
        assertEquals("El usuario User 1 ha sido editado correctamente!", response.getBody());
        verify(userRepo).save(user);  // Verifica que se llamó a `save`
    
        // Verifica que los datos se actualizaron
        assertEquals("encodedNewPassword", user.getPassword());  // Verifica la contraseña
        assertEquals(LocalDate.now(), user.getAtUpdate().toLocalDate());  // Verifica que la fecha de actualización se ha cambiado
    }
    



    @Test
    void testDeleteUser() throws UserException {
        // Crea un usuario con estado inicial ONLINE
        var user = User.builder()
            .username("User 1")
            .status(EStatus.ONLINE)
            .build();

        // Configuración de mocks
        when(userRepo.findByUsername("User 1")).thenReturn(Optional.of(user));

        // Ejecuta el método deleteUser
        ResponseEntity<?> response = userService.deleteUser("User 1");

        // Verifica la respuesta HTTP
        assertEquals("El usuario User 1 ha sido eliminado de forma exitosa!", response.getBody());

        // Verifica que el estado del usuario se haya cambiado a DELETED
        assertEquals(EStatus.DELETED, user.getStatus());

        // Verifica que el método save se haya llamado con el usuario actualizado
        verify(userRepo).save(user);
    }

     @Test
    void testAddAdmin_UserAlreadyExists() {
        // Configuración del DTO con datos del nuevo administrador
        var dtoAdmin = new DtoAdmin();
        dtoAdmin.setUsername("AdminUser");
        dtoAdmin.setPassword("password");
        dtoAdmin.setEmail("admin@example.com");

        // Simulación de que el usuario ya existe en el repositorio
        when(userRepo.findByUsername("AdminUser")).thenReturn(Optional.of(new User()));

        // Verificación de que lanza una excepción cuando el usuario ya existe
        UserException exception = assertThrows(UserException.class, () -> {
            userService.addAdmin(dtoAdmin);
        });
        
        assertEquals("El admin AdminUser ya existe!", exception.getMessage());
    }

    @Test
    void testaddAdmin_NewAdmin() throws UserException {
        // Configuración del DTO con datos del nuevo administrador
        var dtoAdmin = new DtoAdmin();
        dtoAdmin.setUsername("NewAdmin");
        dtoAdmin.setPassword("password");
        dtoAdmin.setEmail("newadmin@example.com");

        // Simulación de que el usuario no existe en el repositorio
        when(userRepo.findByUsername("NewAdmin")).thenReturn(Optional.empty());
        
        // Simulación de la codificación de la contraseña
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");

        // Simulación del comportamiento de guardar
        when(userRepo.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setAtCreate(LocalDateTime.now());
            user.setAtUpdate(LocalDateTime.now());
            return user;
        });

        // Llama al método `addAdmin` para crear un nuevo administrador
        ResponseEntity<?> response = userService.addAdmin(dtoAdmin);

        // Verificación de la respuesta
        assertEquals("El admin NewAdmin ha sido creado de forma exitosa!", response.getBody());

        // Verificación de que se llamó a `save` con el nuevo usuario
        verify(userRepo).save(argThat(user -> 
            user.getUsername().equals("NewAdmin") &&
            user.getPassword().equals("encodedPassword") &&
            user.getEmail().equals("newadmin@example.com") &&
            user.getRole() == ERole.ROLE_ADMIN &&
            user.getStatus() == EStatus.REGISTERED &&
            user.getCountry().equals("Uruguay") &&
            user.getAtCreate() != null &&
            user.getAtUpdate() != null
        ));
    }

    @Test
    void testProcessForgotPassword_UserExists() throws UserException {
        // Configura el usuario existente
        var user = User.builder()
            .email("user@example.com")
            .build();

        // Simula la búsqueda de usuario por correo electrónico
        when(userRepo.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        // Ejecuta el método que deseas probar
        userService.processforgot_password("user@example.com");

        // Verifica que se haya generado y asignado un token de restablecimiento
        assertNotNull(user.getResetToken());
        assertTrue(user.getResetToken().length() > 0); // Verifica que el token no esté vacío

        // Verifica que el usuario se haya guardado en el repositorio con el token
        verify(userRepo).save(user);
    }

    @Test
    void testProcessForgotPassword_UserDoesNotExist() {
        // Simula que el usuario no existe
        when(userRepo.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Verifica que se lance una excepción cuando el usuario no existe
        UserException exception = assertThrows(UserException.class, () -> {
            userService.processforgot_password("nonexistent@example.com");
        });

        assertEquals("El usuario con el correo electrónico nonexistent@example.com no existe", exception.getMessage());
    }

    @Test
    void testvalidatePasswordResetToken() {
        // Configura el token y el usuario de prueba
        String validToken = "validToken123";
        User user = new User();
        user.setResetToken(validToken);

        // Simula el comportamiento del repositorio
        when(userRepo.findByResetToken(validToken)).thenReturn(Optional.of(user));

        // Ejecuta el método y verifica que el resultado sea true
        boolean result = userService.validatePasswordResetToken(validToken);
        assertTrue(result);
    }


    @Test
    void testupdatePassword() {
        // Configura el token y el nuevo password de prueba
        String validToken = "validToken123";
        String newPassword = "newPassword";
        User user = new User();
        user.setResetToken(validToken);

        // Simula el comportamiento del repositorio y del codificador de contraseña
        when(userRepo.findByResetToken(validToken)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(newPassword)).thenReturn("encodedPassword");

        // Simula el comportamiento de guardar el usuario
        when(userRepo.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setAtUpdate(LocalDateTime.now()); // Establece la fecha de actualización como LocalDateTime
            return u;
        });

        // Ejecuta el método
        String result = userService.updatePassword(validToken, newPassword);

        // Verifica los cambios en el usuario
        assertEquals("Token válido", result);
        assertEquals("encodedPassword", user.getPassword());
        assertEquals(null, user.getResetToken()); // El token debe estar limpio
        assertEquals(LocalDate.now(), user.getAtUpdate().toLocalDate()); // Compara solo la parte de la fecha

        // Verifica que el usuario haya sido guardado con los cambios
        verify(userRepo, times(1)).save(user);
    }

    
    @Test
    void testblockUser() throws UserException {
        // Configura el nombre de usuario y el usuario de prueba
        String username = "User1";
        User user = new User();
        user.setUsername(username);
        user.setStatus(EStatus.REGISTERED);

        // Simula el comportamiento del repositorio
        when(userRepo.findByUsername(username)).thenReturn(Optional.of(user));

        // Ejecuta el método
        ResponseEntity<?> response = userService.blockUser(username);

        // Verifica que el estado del usuario haya cambiado a BLOQUEADO
        assertEquals(EStatus.BLOCKED, user.getStatus());

        // Verifica que la respuesta sea la esperada
        assertEquals("El usuario " + username + " ha sido bloqueado de forma exitosa!", response.getBody());

        // Verifica que el usuario fue guardado en el repositorio
        verify(userRepo, times(1)).save(user);
    }

    @Test
    void testunblockUser() throws UserException {
        // Configura el nombre de usuario y el usuario bloqueado de prueba
        String username = "User1";
        User user = new User();
        user.setUsername(username);
        user.setStatus(EStatus.BLOCKED);

        // Simula el comportamiento del repositorio
        when(userRepo.findByUsername(username)).thenReturn(Optional.of(user));

        // Ejecuta el método
        ResponseEntity<?> response = userService.unblockUser(username);

        // Verifica que el estado del usuario haya cambiado a REGISTERED
        assertEquals(EStatus.REGISTERED, user.getStatus());

        // Verifica que la respuesta sea la esperada
        assertEquals("El usuario " + username + " ha sido desbloqueado de forma exitosa!", response.getBody());

        // Verifica que el usuario fue guardado en el repositorio
        verify(userRepo, times(1)).save(user);
    }
}
    
