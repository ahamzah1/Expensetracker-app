package com.example.SpringBootBackend.Exceptions;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ErrorResponse {

    private String message;
    private Boolean success;
    private LocalDateTime date;
    private List<String> details;

    public ErrorResponse(String message, List<String> details) {
        super();
        this.success = Boolean.FALSE;
        this.message = message;
        this.details = details;
        this.date = LocalDateTime.now();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public List<String> getDetails() {
        return details;
    }

    public void setDetails(List<String> details) {
        this.details = details;
    }
}
