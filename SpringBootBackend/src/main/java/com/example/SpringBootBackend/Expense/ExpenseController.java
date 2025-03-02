package com.example.SpringBootBackend.Expense;

import com.example.SpringBootBackend.User.MyUserDetails;
import com.example.SpringBootBackend.User.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/expenses")
public class ExpenseController {

    private ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public String hello(){
        return "Hello";
    }

    @PostMapping
    public void addExpense(@RequestBody ExpenseRequest expenseRequest) {
        MyUserDetails userDetails = (MyUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        expenseService.handleAdd(expenseRequest,userDetails.getUser());
    }

}
