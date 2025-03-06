package com.example.SpringBootBackend.Exceptions;

public class ExpenseViolationException extends RuntimeException {
    public ExpenseViolationException(String message) {
        super(message);
    }
}
