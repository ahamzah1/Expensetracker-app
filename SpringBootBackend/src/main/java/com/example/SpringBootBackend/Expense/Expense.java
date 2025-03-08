package com.example.SpringBootBackend.Expense;

import com.example.SpringBootBackend.User.Users;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // Foreign key to users table
    private Users user;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private int category_id;

    @Column(name = "notification_period", nullable = false)
    private int notificationPeriod;

    public Expense() {
    }

    public Expense(Long id,Users user, double amount, int category, int notificationPeriod, LocalDate date, String description) {
        this.id = id;
        this.user = user;
        this.amount = amount;
        this.category_id = category;
        this.notificationPeriod = notificationPeriod;
        this.date = date;
        this.description = description;
    }

    public Expense(Users user, double amount, int categoryId, int notificationPeriod, LocalDate date, String description) {
        this.user = user;
        this.description = description;
        this.amount = amount;
        this.date = date;
        this.category_id = categoryId;
        this.notificationPeriod = notificationPeriod;
    }

    public Long getId() {
        return id;
    }

    @Override
    public String toString() {
        return "Expense{" +
                "id=" + id +
                ", user=" + user +
                ", description='" + description + '\'' +
                ", amount=" + amount +
                ", date=" + date +
                ", category_id=" + category_id +
                ", notificationPeriod=" + notificationPeriod +
                '}';
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public String getDescription() {
        return description;
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


    public void setCategory_id(int category_id) {
        this.category_id = category_id;
    }

    public int getCategory() {
        return this.category_id;
    }
}
