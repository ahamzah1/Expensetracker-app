package com.example.SpringBootBackend.Expense;

import com.example.SpringBootBackend.User.MyUserDetails;
import com.example.SpringBootBackend.User.Users;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping(path = "/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<ExpenseRequest> getExpenses(MyUserDetails userDetails){
        return expenseService.handleGet(userDetails.getUser());
    }

    @PostMapping
    public ResponseEntity<ExpenseRequest> addExpense(@Valid @RequestBody ExpenseRequest expenseRequest, MyUserDetails userDetails) {
        return ResponseEntity.ok(expenseService.handleAdd(expenseRequest, userDetails.getUser()));
    }

    @PutMapping("/{id}")
    public ExpenseRequest editExpense(@PathVariable long id, @RequestBody ExpenseRequest expenseRequest,MyUserDetails userDetails ){
        return expenseService.handleEdit(userDetails.getUser(),id,expenseRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id, MyUserDetails userDetails){
        this.expenseService.handleDelete(userDetails.getUser(),id);
    }


}
