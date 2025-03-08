package com.example.SpringBootBackend.Expense;

import com.example.SpringBootBackend.User.Users;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ExpenseServiceTest {

    @InjectMocks
    private ExpenseService expenseService;

    @Mock
    private ExpenseRepository expenseRepository;

    private Users user;

    @BeforeEach
    void setUser(){
        MockitoAnnotations.openMocks(this);
        user = new Users("test","test1234","test@gmail.com");
    }

    @Test
    public void testEmpty(){
        Mockito.when(expenseRepository.findByUser(Mockito.any(Users.class))).thenReturn(Collections.emptyList());
        List<ExpenseRequest> test = expenseService.handleGet(user);

        assertTrue(test.isEmpty());
    }

    @Test
    public void testOneEntry(){
        ExpenseRequest expenseRequest = new ExpenseRequest(1L,"Groceries", 21, LocalDate.of(2023, 10, 15), 3,5);
        Expense expense = new Expense(1L, user, 21, 3, 3, LocalDate.of(2023, 10, 15), "Groceries");
        List<Expense> res = new ArrayList<>();
        res.add(expense);

        Mockito.when(expenseRepository.save(Mockito.any(Expense.class))).thenReturn(expense);
        Mockito.when(expenseRepository.findByUser(Mockito.any(Users.class))).thenReturn(res);

        expenseService.handleAdd(expenseRequest, user);
        List<ExpenseRequest> test = expenseService.handleGet(user);
        assertEquals(1,test.size());

        assertEquals("Groceries", test.getFirst().getDescription());

        Mockito.verify(expenseRepository, Mockito.times(1)).save(Mockito.any(Expense.class));

    }
}