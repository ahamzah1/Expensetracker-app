package com.example.SpringBootBackend.Expense;

import java.io.Serializable;
import java.time.LocalDate;

public class ExpenseRequest implements Serializable {

    private Long id;

    private String description;
    private double amount;
    private LocalDate date;
    private int categoryId;
    private int notificationPeriod;

    public ExpenseRequest(String description, double amount, LocalDate date, int categoryId, int notificationPeriod) {
        this.description = description;
        this.amount = amount;
        this.date = date;
        this.categoryId = categoryId;
        this.notificationPeriod = notificationPeriod;
    }

    public ExpenseRequest(Long id, String description, double amount, LocalDate date, int categoryId, int notificationPeriod) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.date = date;
        this.categoryId = categoryId;
        this.notificationPeriod = notificationPeriod;
    }

    public ExpenseRequest(Expense expense) {
        this.id = expense.getId();
        this.description = expense.getDescription();
        this.amount = expense.getAmount();
        this.date = expense.getDate();
        this.categoryId = expense.getCategory();
        this.notificationPeriod = expense.getNotificationPeriod();
    }

    public ExpenseRequest() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getNotificationPeriod() {
        return notificationPeriod;
    }

    public void setNotificationPeriod(int notificationPeriod) {
        this.notificationPeriod = notificationPeriod;
    }

    public String getDescription() {
        return description;
    }
}
