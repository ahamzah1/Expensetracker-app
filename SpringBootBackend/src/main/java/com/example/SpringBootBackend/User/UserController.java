package com.example.SpringBootBackend.User;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api")
public class UserController {

    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public void handleRegister(@Valid @RequestBody Users user){
        this.userService.handleRegister(user);
    }

    @PostMapping("/login")
    public String handleLogin(@Valid @RequestBody Users user){
        return userService.handleLogin(user);
    }

}
