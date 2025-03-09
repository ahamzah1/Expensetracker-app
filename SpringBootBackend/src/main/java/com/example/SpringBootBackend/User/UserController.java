package com.example.SpringBootBackend.User;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api")
public class UserController {

    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public UserDTO handleRegister(@Valid @RequestBody UserDTO user){
       return this.userService.handleRegister(user);
    }

    @PostMapping("/login")
    public String handleLogin(@Valid @RequestBody UserDTO user){
        return userService.handleLogin(user);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(){
        return userService.getALlUsers();
    }

}
