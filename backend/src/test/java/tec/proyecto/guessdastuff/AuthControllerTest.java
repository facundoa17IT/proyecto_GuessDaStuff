package tec.proyecto.guessdastuff;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;


import com.fasterxml.jackson.databind.ObjectMapper;

import tec.proyecto.guessdastuff.dtos.DtoAuthResponse;
import tec.proyecto.guessdastuff.dtos.DtoLoginRequest;
import tec.proyecto.guessdastuff.dtos.DtoRegisterRequest;
import tec.proyecto.guessdastuff.entities.User;
import tec.proyecto.guessdastuff.services.AuthService;
import tec.proyecto.guessdastuff.services.UserService;
import tec.proyecto.guessdastuff.repositories.UserRepository;
import tec.proyecto.guessdastuff.controllers.AuthController;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testLogin_Success() throws Exception {
        DtoLoginRequest request = new DtoLoginRequest("username", "password");
        User user = new User();
        user.setUsername("username");
        user.setPassword("encodedPassword");

        when(userRepository.findByUsername("username")).thenReturn(Optional.of(user));
        when(authService.checkPassword("password", "encodedPassword")).thenReturn(true);
        DtoAuthResponse authResponse = DtoAuthResponse.builder()
            .token("authToken")
            .username("username")
            .message("Login successful")
            .role("USER")  // Add a role if necessary
            .build();
            when(authService.login(request)).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"));
    }

    @Test
    void testLogin_Failure_InvalidUser() throws Exception {
        DtoLoginRequest request = new DtoLoginRequest("invalidUser", "password");

        when(userRepository.findByUsername("invalidUser")).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/v1/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Usuario incorrecto!"));
    }

    @Test
    void testRegister_Success() throws Exception {
        DtoRegisterRequest registerRequest = DtoRegisterRequest.builder()
            .username("testUser")
            .password("testPassword")
            .email("test@example.com")
            .country("CountryName")
            .build();

        DtoAuthResponse response = DtoAuthResponse.builder()
            .token("authToken")
            .username("newUser")
            .message("Registration successful")
            .build();

        when(userRepository.findByUsername("newUser")).thenReturn(Optional.empty());
        when(authService.register(registerRequest)).thenReturn(response);

        mockMvc.perform(post("/api/v1/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest))) // Use registerRequest here
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Registration successful"));
    }

    @Test
    void testRegister_Failure_UserAlreadyExists() throws Exception {
        DtoRegisterRequest request = DtoRegisterRequest.builder()
            .username("existingUser")
            .password("password")
            .build();
    
        User user = new User();
        user.setUsername("existingUser");
    
        when(userRepository.findByUsername("existingUser")).thenReturn(Optional.of(user));
    
        mockMvc.perform(post("/api/v1/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("El nombre de usuario ya existe!"));
    }
    

    @Test
    void testForgotPassword_Success() throws Exception {
        String email = "test@example.com";
        doNothing().when(userService).processforgot_password(email);

        mockMvc.perform(post("/api/v1/forgot-password/{email}", email))
                .andExpect(status().isOk())
                .andExpect(content().string("Password reset link has been sent to your email."));
    }

    @Test
    void testForgotPassword_Failure() throws Exception {
        String email = "test@example.com";
        doThrow(new RuntimeException("Error processing request")).when(userService).processforgot_password(email);

        mockMvc.perform(post("/api/v1/forgot-password/{email}", email))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error processing request"));
    }
}
