package com.example.SpringBootBackend.Expense;

import com.example.SpringBootBackend.User.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ExpenseService {

    private ExpenseRepository expenseRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public void handleAdd(ExpenseRequest expenseRequest, Users user){

        Expense expense = new Expense(
                user,
                expenseRequest.getAmount(),
                expenseRequest.getCategoryId(),
                expenseRequest.getNotificationPeriod(),
                expenseRequest.getDate(),
                expenseRequest.getDescription()
        );

        expenseRepository.save(expense);
    }
}

