package com.example.SpringBootBackend.Expense;

import com.example.SpringBootBackend.User.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense,Long> {
    List<Expense> findByUser(Users user);
    Optional<Expense> findByIdAndUser(Long id, Users user);
}
