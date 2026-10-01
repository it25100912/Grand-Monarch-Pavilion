package com.restaurant.app.auth.service;

import com.restaurant.app.auth.dto.AuthResponse;
import com.restaurant.app.auth.dto.LoginRequest;
import com.restaurant.app.auth.dto.RegisterRequest;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    AuthResponse refreshToken(String refreshToken);

    void logout(String username);
}
