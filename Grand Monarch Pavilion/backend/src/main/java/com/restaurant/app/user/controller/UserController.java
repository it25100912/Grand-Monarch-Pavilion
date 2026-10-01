package com.restaurant.app.user.controller;

import com.restaurant.app.user.entity.User;
import com.restaurant.app.user.service.UserFactory;
import com.restaurant.app.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        List<User> list = userService.getAllUsers();
        list.forEach(u -> u.setPassword(null));
        return list;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        User u = userService.getUserById(id);
        if (u != null) { u.setPassword(null); return ResponseEntity.ok(u); }
        Map<String, Object> err = new HashMap<>();
        err.put("error", "User not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody Map<String, Object> data) {
        String role     = data.containsKey("role")        ? (String) data.get("role")        : "CUSTOMER";
        String username = (String) data.get("username");
        String password = (String) data.get("password");
        String fullName = (String) data.get("fullName");
        String email    = (String) data.get("email");
        String phone    = data.containsKey("phone")       ? (String) data.get("phone")       : "";
        String address  = data.containsKey("address")     ? (String) data.get("address")     : "";
        String jobPos   = data.containsKey("jobPosition") ? (String) data.get("jobPosition") : "";
        String dept     = data.containsKey("department")  ? (String) data.get("department")  : "";

        User user = UserFactory.createUser(role, username, password, fullName, email, phone);
        user.setAddress(address);
        user.setJobPosition(jobPos);
        user.setDepartment(dept);

        Map<String, Object> res = new HashMap<>();
        if (userService.createUser(user)) {
            user.setPassword(null);
            res.put("success", true);
            res.put("message", "User/Staff registered successfully!");
            res.put("user", user);
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        }
        res.put("success", false);
        res.put("message", "Failed to create user. Username or email may already exist.");
        return ResponseEntity.badRequest().body(res);
    }

    @PutMapping({"", "/{id}"})
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable(value = "id", required = false) Integer id,
            @RequestBody(required = false) Map<String, Object> data) {
        int userId = id != null ? id : (data != null && data.containsKey("id") ? Integer.parseInt(data.get("id").toString()) : -1);

        User u = new User();
        u.setId(userId);
        if (data != null) {
            if (data.containsKey("fullName"))    u.setFullName((String) data.get("fullName"));
            if (data.containsKey("email"))       u.setEmail((String) data.get("email"));
            if (data.containsKey("phone"))       u.setPhone((String) data.get("phone"));
            if (data.containsKey("role"))        u.setRole((String) data.get("role"));
            if (data.containsKey("status"))      u.setStatus((String) data.get("status")); else u.setStatus("ACTIVE");
            if (data.containsKey("address"))     u.setAddress((String) data.get("address"));
            if (data.containsKey("jobPosition")) u.setJobPosition((String) data.get("jobPosition"));
            if (data.containsKey("department"))  u.setDepartment((String) data.get("department"));
        }

        Map<String, Object> res = new HashMap<>();
        if (userId > 0 && userService.updateUser(u)) {
            res.put("success", true);
            res.put("message", "User updated successfully!");
            return ResponseEntity.ok(res);
        }
        res.put("success", false);
        res.put("message", "Failed to update user.");
        return ResponseEntity.badRequest().body(res);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable int id, @RequestBody Map<String, Object> data) {
        String status = data.containsKey("status") ? data.get("status").toString() : "ACTIVE";
        Map<String, Object> res = new HashMap<>();
        if (userService.updateStatus(id, status)) {
            res.put("success", true);
            res.put("message", "Account status updated to " + status);
            return ResponseEntity.ok(res);
        }
        res.put("success", false);
        res.put("message", "Failed to update account status.");
        return ResponseEntity.badRequest().body(res);
    }

    @PostMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody Map<String, Object> data) {
        int userId  = data.containsKey("id")      ? Integer.parseInt(data.get("id").toString()) : -1;
        String full = (String) data.get("fullName");
        String email = (String) data.get("email");
        String phone = data.containsKey("phone")   ? (String) data.get("phone")   : "";
        String addr  = data.containsKey("address") ? (String) data.get("address") : "";

        Map<String, Object> res = new HashMap<>();
        if (userId > 0 && userService.updateProfile(userId, full, email, phone, addr)) {
            res.put("success", true);
            res.put("message", "Profile updated successfully!");
            return ResponseEntity.ok(res);
        }
        res.put("success", false);
        res.put("message", "Failed to update profile.");
        return ResponseEntity.badRequest().body(res);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, Object> data) {
        int userId  = data.containsKey("id") ? Integer.parseInt(data.get("id").toString()) : -1;
        String curr = (String) data.get("currentPassword");
        String newP = (String) data.get("newPassword");

        Map<String, Object> res = new HashMap<>();
        if (userId > 0 && userService.changePassword(userId, curr, newP)) {
            res.put("success", true);
            res.put("message", "Password changed successfully!");
            return ResponseEntity.ok(res);
        }
        res.put("success", false);
        res.put("message", "Incorrect current password or invalid new password.");
        return ResponseEntity.badRequest().body(res);
    }

    @DeleteMapping({"", "/{id}"})
    public ResponseEntity<Map<String, Object>> deleteUser(
            @PathVariable(value = "id", required = false) Integer pathId,
            @RequestParam(value = "id", required = false) Integer queryId,
            @RequestBody(required = false) Map<String, Object> body) {
        int userId = pathId != null ? pathId : queryId != null ? queryId
                : (body != null && body.containsKey("id") ? Integer.parseInt(body.get("id").toString()) : -1);
        Map<String, Object> res = new HashMap<>();
        if (userId > 0 && userService.deleteUser(userId)) {
            res.put("success", true);
            res.put("message", "User deleted successfully!");
            return ResponseEntity.ok(res);
        }
        res.put("success", false);
        res.put("message", "Failed to delete user.");
        return ResponseEntity.badRequest().body(res);
    }
}
