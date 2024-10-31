package tec.proyecto.guessdastuff.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DemoController {
    
    @GetMapping("/welcome")
    public String welcome()
    {
        return "Welcome you are logged in!";
    }

    @GetMapping("/user")
    public String welcomeUser()
    {
        return "Welcome USER!";
    }

    @GetMapping("/admin")
    public String welcomeAdmin()
    {
        return "Welcome ADMIN!";
    }
}