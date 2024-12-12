package tec.proyecto.guessdastuff;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.security.Key;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
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
    public void testGetToken() {
    // Given: Un mock de UserDetails
    UserDetails userDetails = mock(UserDetails.class);
    when(userDetails.getUsername()).thenReturn("testuser");

    // When: Llamar al método getToken
    String token = jwtService.getToken(userDetails);

    // Then: Verificar que el token no sea nulo
    assertNotNull(token);

    // Verificar que el token contiene el nombre de usuario
    String usernameFromToken = jwtService.getUsernameFromToken(token);
    assertEquals("testuser", usernameFromToken);
    }

    @Test
    public void testGenerateTokenWithClaims() {
    // Given: Un mock de UserDetails y claims adicionales
    UserDetails userDetails = mock(UserDetails.class);
    when(userDetails.getUsername()).thenReturn("testuser");

    Map<String, Object> extraClaims = new HashMap<>();
    extraClaims.put("role", "ROLE_USER");

    // When: Generar el token con claims
    String token = jwtService.generateTokenWithClaims(extraClaims, userDetails);

    // Then: Verificar que el token no sea nulo
    assertNotNull(token);

    // Verificar que los claims adicionales están presentes
    String role = jwtService.getClaim(token, claims -> claims.get("role", String.class));
    assertEquals("ROLE_USER", role);
    }


    @Test
    public void testGetKey() throws Exception {
        // Given: Una instancia del servicio
        JwtService jwtService = new JwtService();

        // Acceder al método privado usando reflexión
        Method getKeyMethod = JwtService.class.getDeclaredMethod("getKey");
        getKeyMethod.setAccessible(true); // Permitir acceso al método privado

        // When: Llamar al método
        Key key = (Key) getKeyMethod.invoke(jwtService);

        // Then: Verificar que la clave no sea nula y tenga el tipo esperado
        assertNotNull(key);
        assertEquals("HmacSHA384", key.getAlgorithm()); // El algoritmo debería ser HmacSHA384
    }


    @Test
    public void testGetUsernameFromToken() {
    // Given: Un token válido
    UserDetails userDetails = mock(UserDetails.class);
    when(userDetails.getUsername()).thenReturn("testuser");

    String token = jwtService.getToken(userDetails);

    // When: Obtener el nombre de usuario del token
    String username = jwtService.getUsernameFromToken(token);

    // Then: Verificar que el nombre de usuario sea el esperado
    assertEquals("testuser", username);
    }

    //Token exito
    @Test
    public void testIsTokenValid() {
    // Given: Un token válido y un mock de UserDetails
    UserDetails userDetails = mock(UserDetails.class);
    when(userDetails.getUsername()).thenReturn("testuser");

    String token = jwtService.getToken(userDetails);

    // When: Validar el token
    boolean isValid = jwtService.isTokenValid(token, userDetails);

    // Then: Verificar que el token sea válido
    assertTrue(isValid);
    }

    //Token expirado
    @Test
    public void testIsTokenValid_Expired() throws InterruptedException {
    // Given: Un token con un tiempo de expiración corto
    JwtService jwtService = new JwtService();

    Map<String, Object> extraClaims = new HashMap<>();
    extraClaims.put("customClaim", "testValue");

    UserDetails userDetails = mock(UserDetails.class);
    when(userDetails.getUsername()).thenReturn("testuser");

    // Crear un token con expiración de 1 segundo
    String token = Jwts.builder()
            .setClaims(extraClaims)
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000)) // 1 segundo
            .signWith(ReflectionTestUtils.invokeMethod(jwtService, "getKey"), SignatureAlgorithm.HS256)
            .compact();

    // Esperar para que el token expire
    Thread.sleep(1500);

    // When & Then: Validar que se lanza la excepción al analizar el token expirado
    assertThrows(io.jsonwebtoken.ExpiredJwtException.class, () -> {
        jwtService.isTokenValid(token, userDetails);
    });
    }


    @Test
    public void testGetAllClaims() throws Exception {
    // Given: Instancia de JwtService y un token válido
    JwtService jwtService = new JwtService();

    Map<String, Object> extraClaims = new HashMap<>();
    extraClaims.put("customClaim", "testValue");

    String token = Jwts.builder()
            .setClaims(extraClaims)
            .setSubject("testuser")
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hora
            .signWith(ReflectionTestUtils.invokeMethod(jwtService, "getKey"), SignatureAlgorithm.HS256)
            .compact();

    // When: Invocamos el método privado `getAllClaims` usando Reflection
    Claims claims = ReflectionTestUtils.invokeMethod(jwtService, "getAllClaims", token);

    // Then: Verificamos que los claims sean correctos
    assertNotNull(claims);
    assertEquals("testValue", claims.get("customClaim"));
    assertEquals("testuser", claims.getSubject());
    }


    @Test
    public void testGetClaim() {
    // Given: Instancia de JwtService y un token con claims específicos
    JwtService jwtService = new JwtService();

    Map<String, Object> extraClaims = new HashMap<>();
    extraClaims.put("customClaim", "customValue");

    String token = Jwts.builder()
            .setClaims(extraClaims)
            .setSubject("testuser")
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hora
            .signWith(ReflectionTestUtils.invokeMethod(jwtService, "getKey"), SignatureAlgorithm.HS256)
            .compact();

    // When: Obtener diferentes valores usando el método getClaim
    String customClaimValue = jwtService.getClaim(token, claims -> claims.get("customClaim", String.class));
    String subject = jwtService.getClaim(token, Claims::getSubject);

    // Then: Verificar los valores extraídos
    assertEquals("customValue", customClaimValue);
    assertEquals("testuser", subject);
    }


    @Test
    public void testGetExpiration() {
    // Given: Instancia de JwtService y un token con una fecha de expiración específica
    JwtService jwtService = new JwtService();

    Date expirationDate = new Date(System.currentTimeMillis() + 1000 * 60 * 60); // 1 hora desde ahora

    String token = Jwts.builder()
            .setSubject("testuser")
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(expirationDate)
            .signWith(ReflectionTestUtils.invokeMethod(jwtService, "getKey"), SignatureAlgorithm.HS256)
            .compact();

    // When: Obtener la fecha de expiración usando getExpiration
    Date extractedExpirationDate = ReflectionTestUtils.invokeMethod(jwtService, "getExpiration", token);

     // Then: Verificar que la fecha extraída esté cerca de la esperada (permitir una pequeña diferencia en milisegundos)
     assertNotNull(extractedExpirationDate);
     long differenceInMillis = Math.abs(expirationDate.getTime() - extractedExpirationDate.getTime());

     // Asegurarse de que la diferencia en milisegundos es aceptable 
     assertTrue(differenceInMillis < 1000, "La diferencia en milisegundos es demasiado grande: " + differenceInMillis);   

    }
    //Token Expirado
    @Test
    public void testIsTokenExpired_ExpiredToken() throws Exception {
    // Given: Un token con un tiempo de expiración en el pasado
    Date expirationDate = new Date(System.currentTimeMillis() - 1000); // Expirado hace 1 segundo
    String expiredToken = Jwts.builder()
        .setSubject("testuser")
        .setIssuedAt(new Date(System.currentTimeMillis() - 2000)) // Emitido hace 2 segundos
        .setExpiration(expirationDate) // Expirado hace 1 segundo
        .signWith(ReflectionTestUtils.invokeMethod(jwtService, "getKey"), SignatureAlgorithm.HS256)
        .compact();

    
    // Acceder al método isTokenExpired usando reflexión
    Method method = JwtService.class.getDeclaredMethod("isTokenExpired", String.class);
    method.setAccessible(true); // Hacer accesible el método private

     boolean isExpired = false;
    try {
        isExpired = (boolean) method.invoke(jwtService, expiredToken);
    } catch (InvocationTargetException e) {
        if (e.getCause() instanceof ExpiredJwtException) {
            isExpired = true; // La excepción confirma que el token está expirado
        } else {
            throw e; // Re-lanzar otras excepciones
        }
    }

    // Then: El token debería estar expirado
    assertTrue(isExpired);
    }
    
    //Token aun Valido
    @Test
    public void testIsTokenExpired_ValidToken() throws Exception {
    // Given: Un token con un tiempo de expiración en el futuro
    Date expirationDate = new Date(System.currentTimeMillis() + 10000); // Expira en 10 segundos
    String validToken = Jwts.builder()
        .setSubject("testuser")
        .setIssuedAt(new Date(System.currentTimeMillis())) // Emitido ahora
        .setExpiration(expirationDate) // Expira en 10 segundos
        .signWith(ReflectionTestUtils.invokeMethod(jwtService, "getKey"), SignatureAlgorithm.HS256)
        .compact();

    // Acceder al método isTokenExpired usando reflexión
    Method method = JwtService.class.getDeclaredMethod("isTokenExpired", String.class);
    method.setAccessible(true); // Hacer accesible el método private

    // When: Verificar si el token está expirado
    boolean isExpired = (boolean) method.invoke(jwtService, validToken);

    // Then: El token no debería estar expirado
    assertFalse(isExpired);
    }
}