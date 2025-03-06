package com.example.SpringBootBackend.User;

import com.example.SpringBootBackend.Exceptions.DuplicateUserException;
import com.example.SpringBootBackend.JWT.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private UserRepository userRepository;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void handleRegister(Users user) throws DataIntegrityViolationException{

        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public String handleLogin(Users user) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(),user.getPassword()));
        return jwtService.generateToken(user.getUsername());
    }
}
