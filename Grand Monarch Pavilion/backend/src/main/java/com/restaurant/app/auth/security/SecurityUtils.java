package com.restaurant.app.auth.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Security helper for role checking and password hashing.
 */
public class SecurityUtils {

    public static String hashPassword(String password) {
        if (password == null) return null;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            return password;
        }
    }

    public static boolean checkRole(String currentRole, String... allowedRoles) {
        if (currentRole == null) return false;
        for (String role : allowedRoles) {
            if (currentRole.equalsIgnoreCase(role)) return true;
        }
        return false;
    }
}
