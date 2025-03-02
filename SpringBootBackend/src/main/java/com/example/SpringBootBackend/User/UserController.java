package com.example.SpringBootBackend.User;

import org.springframework.beans.factory.annotation.Autowired;
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
    public void handleRegister(@RequestBody Users user){
        this.userService.handleRegister(user);
    }

    @PostMapping("/login")
    public String handleLogin(@RequestBody Users user){
        return userService.handleLogin(user);
    }

}
