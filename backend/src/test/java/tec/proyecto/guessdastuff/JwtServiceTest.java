package tec.proyecto.guessdastuff;

import java.lang.reflect.Method;
import java.security.Key;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.SignatureException;
import tec.proyecto.guessdastuff.services.JwtService;

@SpringBootTest
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    @Mock
    private UserDetails testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testUser = User.builder()
                .username("testuser")
                .password("password123")
                .authorities(new ArrayList<>())
                .build();
    }

    @Test
    void testGetToken_ShouldGenerateToken() {
        String token = jwtService.getToken(testUser);
        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    void testGetTokenv2_ShouldGenerateTokenWithExtraClaims() {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", "ROLE_USER");
        extraClaims.put("customClaim", "customValue");

        String token = jwtService.getTokenv2(extraClaims, testUser);
        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    void testGetUsernameFromToken_ShouldExtractUsername() {
        String token = jwtService.getToken(testUser);
        String extractedUsername = jwtService.getUsernameFromToken(token);

        assertEquals(testUser.getUsername(), extractedUsername);
    }

    @Test
    void testIsTokenValid_ShouldReturnTrueForValidToken() {
        String token = jwtService.getToken(testUser);
        boolean isValid = jwtService.isTokenValid(token, testUser);

        assertTrue(isValid);
    }

  /*   @Test
    void testIsTokenValid_ShouldReturnFalseForInvalidToken() {
        String invalidToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c3VhcmlvSW52YWxpZG8iLCJleHAiOjE2MDAwMDAwMDB9.invalidsignature";
        when(jwtService.isTokenValid(invalidToken, testUser)).thenReturn(false);

        boolean isValid = jwtService.isTokenValid(invalidToken, testUser);
        assertFalse(isValid);

        // Verificar que el método fue llamado
        verify(jwtService).isTokenValid(invalidToken, testUser);
    }
*/


    @Test
    void testIsTokenValid_ShouldReturnFalseForInvalidToken() {
    // Genera un token válido
    String validToken = jwtService.getToken(testUser);
    
    // Modifica el token para que sea inválido (por ejemplo, cambiando un carácter)
    String invalidToken = validToken.substring(0, validToken.length() - 1) + "x";
    
    // Verifica si es inválido manejando la excepción SignatureException
    boolean isValid;
    try {
        isValid = jwtService.isTokenValid(invalidToken, testUser);
    } catch (SignatureException e) {
        isValid = false;
    }
    
    // Confirmamos que el token es inválido
    assertFalse(isValid, "The token should be invalid due to a modified signature.");
}

   @Test
    void testIsTokenExpired_ShouldReturnTrueForExpiredToken() {
    String expiredToken = Jwts.builder()
            .setSubject(testUser.getUsername())
            .setExpiration(new Date(System.currentTimeMillis() - 1000)) // Token ya expirado
            .signWith(getKeyUsingReflection(), SignatureAlgorithm.HS256)
            .compact();

    boolean isExpired;
    try {
        isExpired = jwtService.isTokenValid(expiredToken, testUser);
    } catch (ExpiredJwtException e) {
        isExpired = true;
    }

    // Confirmamos que el token expirado es tratado como inválido
    assertTrue(isExpired, "The token should be considered expired and invalid.");
}

    @Test
    void testGetKeyUsingReflection() throws Exception {
        Method getKeyMethod = JwtService.class.getDeclaredMethod("getKey");
        getKeyMethod.setAccessible(true); // Make private method accessible

        Key key = (Key) getKeyMethod.invoke(jwtService);
        assertNotNull(key, "Key should not be null");
    }

    private Key getKeyUsingReflection() {
        try {
            Method getKeyMethod = JwtService.class.getDeclaredMethod("getKey");
            getKeyMethod.setAccessible(true);
            return (Key) getKeyMethod.invoke(jwtService);
        } catch (Exception e) {
            throw new RuntimeException("Failed to access getKey method via reflection", e);
        }
    }
}