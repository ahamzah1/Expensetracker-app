package com.example.SpringBootBackend.Exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import org.springframework.security.core.AuthenticationException;
import java.util.*;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ExceptionsHandler {

    @ExceptionHandler(RecordNotFoundException.class)
    private ResponseEntity<?> handleRecordNotFound(RecordNotFoundException e){
        ErrorResponse res = new ErrorResponse(e.getLocalizedMessage(), Collections.singletonList(e.getMessage()));
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
    }

    @ExceptionHandler(ExpenseViolationException.class)
    private ResponseEntity<?> handleExpense(ExpenseViolationException e){
        ErrorResponse res = new ErrorResponse(e.getLocalizedMessage(), Collections.singletonList(e.getMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(DuplicateUserException.class)
    private ResponseEntity<?> handleDuplicateUser(DuplicateUserException e){
        ErrorResponse res = new ErrorResponse(e.getLocalizedMessage(), Collections.singletonList(e.getMessage()));
        return ResponseEntity.status(HttpStatus.CONFLICT).body(res);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> details = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());

        ErrorResponse errorResponse = new ErrorResponse("Validation failed", details);
        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "Invalid username or password",
                List.of("Check your credentials and try again")
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrity(DataIntegrityViolationException e){
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage(),List.of(e.getMessage()));
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

}
