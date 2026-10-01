package com.restaurant.app.common.exception;

public class AppException extends RuntimeException {
    private int status = 400;

    public AppException(String message) {
        super(message);
    }

    public AppException(String message, int status) {
        super(message);
        this.status = status;
    }

    public int getStatus() { return status; }
}
