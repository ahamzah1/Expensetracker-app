package com.example.SpringBootBackend.Exceptions;


public class RecordNotFoundException extends RuntimeException{

    public RecordNotFoundException(String message) {
        super(message);
    }
}
