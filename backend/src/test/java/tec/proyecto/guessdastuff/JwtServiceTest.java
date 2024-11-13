package tec.proyecto.guessdastuff;

import static org.junit.jupiter.api.Assertions.*;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import tec.proyecto.guessdastuff.services.JwtService;

import java.lang.reflect.Method;
import java.security.Key;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

class JwtServiceTest {

    @InjectMocks
    private JwtService jwtService;

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

    @Test
    void testIsTokenValid_ShouldReturnFalseForInvalidToken() {
        String invalidToken = "invalid.token.here";
        boolean isValid = jwtService.isTokenValid(invalidToken, testUser);

        assertFalse(isValid);
    }

    @Test
    void testIsTokenExpired_ShouldReturnTrueForExpiredToken() {
        String expiredToken = Jwts.builder()
                .setSubject(testUser.getUsername())
                .setExpiration(new Date(System.currentTimeMillis() - 1000)) // already expired
                .signWith(getKeyUsingReflection(), SignatureAlgorithm.HS256)
                .compact();

        boolean isExpired = jwtService.isTokenValid(expiredToken, testUser);

        assertFalse(isExpired);
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