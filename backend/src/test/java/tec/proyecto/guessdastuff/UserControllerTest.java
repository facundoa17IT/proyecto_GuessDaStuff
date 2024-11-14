package tec.proyecto.guessdastuff;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;
import tec.proyecto.guessdastuff.dtos.DtoAdmin;
import tec.proyecto.guessdastuff.dtos.DtoUserRequest;
import tec.proyecto.guessdastuff.services.UserService;
import tec.proyecto.guessdastuff.controllers.UserController;

import java.util.Collections;

class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testListUsers() throws Exception {
        // Mock the service method
        when(userService.listUsers()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/users/v1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())  // Empty array, as per mock return
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    @WithMockUser(roles = "USER")
    void testListActiveUsers() throws Exception {
        // Mock the service method
        when(userService.listActiveUsers()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/users/v1/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())  // Empty array
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testFindUserByUsername() throws Exception {
        String username = "testUser";
        
        // Mock the service method
        when(userService.findUserByUsername(username)).thenReturn("User found");

        mockMvc.perform(get("/api/users/v1/{username}", username))
                .andExpect(status().isOk())
                .andExpect(content().string("User found"))
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testEditUser() throws Exception {
        String username = "testUser";
        DtoUserRequest dtoUser = new DtoUserRequest();
        dtoUser.setName("Updated User");
        
        // Mock the service method
        when(userService.editUser(eq(username), any(DtoUserRequest.class))).thenReturn("User updated");

        mockMvc.perform(put("/api/users/v1/edit/{username}", username)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(dtoUser)))
                .andExpect(status().isOk())
                .andExpect(content().string("User updated"))
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testDeleteUser() throws Exception {
        String username = "testUser";
        
        // Mock the service method
        when(userService.deleteUser(username)).thenReturn("User deleted");

        mockMvc.perform(put("/api/users/v1/delete/{username}", username))
                .andExpect(status().isOk())
                .andExpect(content().string("User deleted"))
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testAddAdmin() throws Exception {
        DtoAdmin dtoAdmin = new DtoAdmin();
        dtoAdmin.setUsername("newAdmin");

        // Mock the service method
        when(userService.addAdmin(any(DtoAdmin.class))).thenReturn("Admin added");

        mockMvc.perform(post("/api/users/v1")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(dtoAdmin)))
                .andExpect(status().isOk())
                .andExpect(content().string("Admin added"))
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testBlockUser() throws Exception {
        String username = "testUser";

        // Mock the service method
        when(userService.blockUser(username)).thenReturn("User blocked");

        mockMvc.perform(put("/api/users/v1/block/{username}", username))
                .andExpect(status().isOk())
                .andExpect(content().string("User blocked"))
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testUnblockUser() throws Exception {
        String username = "testUser";

        // Mock the service method
        when(userService.unblockUser(username)).thenReturn("User unblocked");

        mockMvc.perform(put("/api/users/v1/unblock/{username}", username))
                .andExpect(status().isOk())
                .andExpect(content().string("User unblocked"))
                .andDo(MockMvcResultHandlers.print());
    }

    // Test cases for failure scenarios can be added, for example:
    @Test
    @WithMockUser(roles = "ADMIN")
    void testListUsers_failure() throws Exception {
        when(userService.listUsers()).thenThrow(new RuntimeException("Service error"));

        mockMvc.perform(get("/api/users/v1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Service error"))
                .andDo(MockMvcResultHandlers.print());
    }
}
