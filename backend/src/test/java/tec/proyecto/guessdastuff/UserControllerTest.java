// package tec.proyecto.guessdastuff;

// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.ArgumentMatchers.eq;
// import static org.mockito.Mockito.*;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.test.web.servlet.setup.MockMvcBuilders;
// import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
// import org.springframework.security.test.context.support.WithMockUser;
// import tec.proyecto.guessdastuff.dtos.DtoAdmin;
// import tec.proyecto.guessdastuff.dtos.DtoUserRequest;
// import tec.proyecto.guessdastuff.services.UserService;
// import tec.proyecto.guessdastuff.controllers.UserController;

// import java.util.Collections;

// class UserControllerTest {

//     private MockMvc mockMvc;

//     @Mock
//     private UserService userService;

//     @InjectMocks
//     private UserController userController;

//     private ObjectMapper objectMapper;

//     @BeforeEach
//     void setUp() {
//         objectMapper = new ObjectMapper();
//         mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
//     }

//     @Test
//     @WithMockUser(roles = "ADMIN")
//     void testListUsers() throws Exception {
//         // Using doAnswer instead of thenReturn
//         doAnswer(invocation -> {
//             return Collections.emptyList(); // Returning the mocked response
//         }).when(userService).listUsers();

//         mockMvc.perform(get("/api/users/v1"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$").isArray())  // Empty array, as per mock return
//                 .andDo(MockMvcResultHandlers.print());

//         // Verify interaction
//         verify(userService, times(1)).listUsers();
//     }

//     @Test
//     @WithMockUser(roles = "USER")
//     void testListActiveUsers() throws Exception {
//         // Using doAnswer to mock the response
//         doAnswer(invocation -> {
//             return Collections.emptyList(); // Returning the mocked response
//         }).when(userService).listActiveUsers();

//         mockMvc.perform(get("/api/users/v1/active"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$").isArray())  // Empty array as expected
//                 .andDo(MockMvcResultHandlers.print());

//         // Verify interaction
//         verify(userService, times(1)).listActiveUsers();
//     }

//     @Test
//     @WithMockUser(roles = "ADMIN")
//     void testFindUserByUsername() throws Exception {
//         String username = "testUser";
        
//         // Using doAnswer to mock the response
//         doAnswer(invocation -> {
//             return "User found"; // Returning mocked response
//         }).when(userService).findUserByUsername(username);

//         mockMvc.perform(get("/api/users/v1/{username}", username))
//                 .andExpect(status().isOk())
//                 .andExpect(content().string("User found"))
//                 .andDo(MockMvcResultHandlers.print());

//         // Verify interaction
//         verify(userService, times(1)).findUserByUsername(username);
//     }

//     // @Test
//     // @WithMockUser(roles = "ADMIN")
//     // void testEditUser() throws Exception {
//     //     String username = "testUser";
//     //     DtoUserRequest dtoUser = new DtoUserRequest();
//     //     dtoUser.setPassword("UpdatedPassword");  // Set password instead of name
        
//     //     // Using doAnswer to mock the response
//     //     doAnswer(invocation -> {
//     //         return "User updated"; // Returning mocked response
//     //     }).when(userService).editUser(eq(username), any(DtoUserRequest.class));

//     //     mockMvc.perform(put("/api/users/v1/edit/{username}", username)
//     //                         .contentType("application/json")
//     //                         .content(objectMapper.writeValueAsString(dtoUser)))
//     //                 .andExpect(status().isOk())
//     //                 .andExpect(content().string("User updated"))
//     //                 .andDo(MockMvcResultHandlers.print());

//     //     // Verify interaction
//     //     verify(userService, times(1)).editUser(eq(username), any(DtoUserRequest.class));
//     // }

//     @Test
//     @WithMockUser(roles = "ADMIN")
//     void testDeleteUser() throws Exception {
//         String username = "testUser";
        
//         // Using doAnswer to mock the response
//         doAnswer(invocation -> {
//             return "User deleted"; // Returning mocked response
//         }).when(userService).deleteUser(username);

//         mockMvc.perform(put("/api/users/v1/delete/{username}", username))
//                 .andExpect(status().isOk())
//                 .andExpect(content().string("User deleted"))
//                 .andDo(MockMvcResultHandlers.print());

//         // Verify interaction
//         verify(userService, times(1)).deleteUser(username);
//     }

//     @Test
//     @WithMockUser(roles = "ADMIN")
//     void testAddAdmin() throws Exception {
//         DtoAdmin dtoAdmin = new DtoAdmin();
//         dtoAdmin.setUsername("newAdmin");

//         // Using doAnswer to mock the response
//         doAnswer(invocation -> {
//             return "Admin added"; // Returning mocked response
//         }).when(userService).addAdmin(any(DtoAdmin.class));

//         mockMvc.perform(post("/api/users/v1")
//                         .contentType("application/json")
//                         .content(objectMapper.writeValueAsString(dtoAdmin)))
//                 .andExpect(status().isOk())
//                 .andExpect(content().string("Admin added"))
//                 .andDo(MockMvcResultHandlers.print());

//         // Verify interaction
//         verify(userService, times(1)).addAdmin(any(DtoAdmin.class));
//     }

//     @Test
//     @WithMockUser(roles = "ADMIN")
//     void testBlockUser() throws Exception {
//         String username = "testUser";

//         // Using doAnswer to mock the response
//         doAnswer(invocation -> {
//             return "User blocked"; // Returning mocked response
//         }).when(userService).blockUser(username);

//         mockMvc.perform(put("/api/users/v1/block/{username}", username))
//                 .andExpect(status().isOk())
//                 .andExpect(content().string("User blocked"))
//                 .andDo(MockMvcResultHandlers.print());

//         // Verify interaction
//         verify(userService, times(1)).blockUser(username);
//     }

//     @Test
//     @WithMockUser(roles = "ADMIN")
//     void testUnblockUser() throws Exception {
//         String username = "testUser";

//         // Using doAnswer to mock the response
//         doAnswer(invocation -> {
//             return "User unblocked"; // Returning mocked response
//         }).when(userService).unblockUser(username);

//         mockMvc.perform(put("/api/users/v1/unblock/{username}", username))
//                 .andExpect(status().isOk())
//                 .andExpect(content().string("User unblocked"))
//                 .andDo(MockMvcResultHandlers.print());

//         // Verify interaction
//         verify(userService, times(1)).unblockUser(username);
//     }

//     @Test
//     @WithMockUser(roles = "ADMIN")
//     void testListUsers_failure() throws Exception {
//         // Using doAnswer to mock an exception being thrown
//         doAnswer(invocation -> {
//             throw new RuntimeException("Service error"); // Simulating a service failure
//         }).when(userService).listUsers();

//         mockMvc.perform(get("/api/users/v1"))
//                 .andExpect(status().isBadRequest())
//                 .andExpect(content().string("Service error"))
//                 .andDo(MockMvcResultHandlers.print());
//     }
// }
