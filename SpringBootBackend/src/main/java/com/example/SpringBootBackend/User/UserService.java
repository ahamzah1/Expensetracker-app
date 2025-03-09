package com.example.SpringBootBackend.User;

import com.example.SpringBootBackend.Exceptions.DuplicateUserException;
import com.example.SpringBootBackend.JWT.JWTService;
import com.example.SpringBootBackend.Role.Role;
import com.example.SpringBootBackend.Role.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
public class UserService {

    private final UserRepository usersRepository;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final RoleRepository roleRepository;
    private final Logger logger = LoggerFactory.getLogger(UserService.class);


    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Autowired
    public UserService(UserRepository usersRepository, AuthenticationManager authenticationManager, JWTService jwtService, RoleRepository roleRepository) {
        this.usersRepository = usersRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.roleRepository = roleRepository;
    }

    public UserDTO handleRegister(UserDTO user) throws DataIntegrityViolationException{
        Role role = roleRepository.findByName("ROLE_USER").orElseThrow(()-> new RuntimeException("Role not found"));
        Users userToAdd = new Users(user.getUsername(), user.getPassword(), user.getEmail(), null);
        userToAdd.setPassword(encoder.encode(user.getPassword()));
        userToAdd.setRoles(Collections.singleton(role));
        return new UserDTO(usersRepository.save(userToAdd));
    }

    public String handleLogin(UserDTO user) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(),user.getPassword()));
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return jwtService.generateToken(userDetails);
    }

    public ResponseEntity<?> getALlUsers() {
        return ResponseEntity.ok(usersRepository.findAll());
    }
}
