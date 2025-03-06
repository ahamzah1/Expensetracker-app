package com.example.SpringBootBackend.Expense;

import com.example.SpringBootBackend.Exceptions.ExpenseViolationException;
import com.example.SpringBootBackend.Exceptions.RecordNotFoundException;
import com.example.SpringBootBackend.User.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private ExpenseRepository expenseRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public ExpenseRequest handleAdd(ExpenseRequest expenseRequest, Users user){

        Expense expense = new Expense(
                user,
                expenseRequest.getAmount(),
                expenseRequest.getCategoryId(),
                expenseRequest.getNotificationPeriod(),
                expenseRequest.getDate(),
                expenseRequest.getDescription()
        );

        try{
            Expense res = expenseRepository.save(expense);
            return new ExpenseRequest(res);
        } catch (DataIntegrityViolationException e) {
            throw new ExpenseViolationException("Expense is in wrong format! ");
        }
    }

    public List<ExpenseRequest> handleGet(Users user) {

        return expenseRepository.findByUser(user).stream().map(expense -> new ExpenseRequest(
                expense.getId(), expense.getDescription(), expense.getAmount(), expense.getDate(), expense.getCategory(), expense.getNotificationPeriod()
        )).collect(Collectors.toList());
    }

    public void handleDelete(Users user, Long id) {
        Expense expense = expenseRepository.findByIdAndUser(id,user).orElseThrow(() -> new RecordNotFoundException("Record not found for ID: " + id));
        expenseRepository.delete(expense);
    }

    public ExpenseRequest handleEdit(Users user, long id, ExpenseRequest expenseRequest) {
        Expense existingExpense = expenseRepository.findByIdAndUser(id,user).orElseThrow(() -> new RecordNotFoundException("Record not found for ID: " + id));
        // Update the fields
        existingExpense.setAmount(expenseRequest.getAmount());
        existingExpense.setCategory_id(expenseRequest.getCategoryId());
        existingExpense.setNotificationPeriod(expenseRequest.getNotificationPeriod());
        existingExpense.setDate(expenseRequest.getDate());
        existingExpense.setDescription(expenseRequest.getDescription());
        expenseRepository.save(existingExpense);
        return expenseRequest;

    }
}

