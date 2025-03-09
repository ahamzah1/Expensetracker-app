package com.example.SpringBootBackend;

import com.example.SpringBootBackend.Role.Role;
import com.example.SpringBootBackend.Role.RoleRepository;
import com.example.SpringBootBackend.User.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


@Component
public class RoleInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;


    @Override
    public void run(String... args) throws Exception {
        String[] roles = {"ROLE_USER", "ROLE_ADMIN"};

        for(String roleName : roles){
            if(!(roleRepository.existsByName(roleName))){
                Role role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
            }
        }
    }
}
