package com.example.SpringBootBackend.Expense;

import com.example.SpringBootBackend.User.UserRepository;
import com.example.SpringBootBackend.User.Users;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@TestPropertySource(locations = "classpath:application.yml") // Explicitly specify the test configuration
public class ExpenseServiceH2Test {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    private Users user;

    @BeforeEach
    void setUp() {
        user = new Users("test","test1234","test@gmail.com");
        userRepository.save(user);
    }

    @Test
    public void testAddExpense() {
        ExpenseRequest request = new ExpenseRequest("Groceries", 50, LocalDate.of(2024, 3, 1), 7, 14);

        ExpenseRequest result = expenseService.handleAdd(request, user);

        List<Expense> expenses = expenseRepository.findByUser(user);
        assertFalse(expenses.isEmpty());
        assertEquals(1,expenses.size());
        assertEquals("Groceries", expenses.getFirst().getDescription());
    }
}