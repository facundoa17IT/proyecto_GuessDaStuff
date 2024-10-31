package tec.proyecto.guessdastuff.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationProvider;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import tec.proyecto.guessdastuff.auth.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http

                .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless APIs
                .cors(cors -> cors // Enable CORS with custom configuration
                        .configurationSource(request -> {
                            CorsConfiguration config = new CorsConfiguration();
                            config.setAllowedOrigins(List.of("http://localhost:5173","proyectoguessdastuff-production.up.railway.app:2024")); // Set allowed origins
                            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE")); // Set allowed methods
                            config.setAllowedHeaders(List.of("Authorization", "Content-Type")); // Set allowed headers
                            config.setAllowCredentials(true); // Allow cookies to be included in requests
                            return config;
                        }))
                .authorizeHttpRequests(authRequest -> authRequest
                        .requestMatchers("/auth/**").permitAll() // Allow endpoints for Register and Login
                        .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN") // Allow endpoints only for ROLE_USER AND ROLE_ADMIN
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // Allow endpoints only for ROLE_ADMIN
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**" ).permitAll()  
                        .anyRequest().authenticated() // Protect all other endpoints
                )
                .sessionManagement(
                        sessionManager -> sessionManager.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // No sessions
                )
                .authenticationProvider(authProvider) // Custom authentication provider
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // Add JWT filter
                .build();
    }
}