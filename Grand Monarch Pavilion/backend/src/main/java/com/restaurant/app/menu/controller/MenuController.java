package com.restaurant.app.menu.controller;

import com.restaurant.app.common.response.ApiResponse;
import com.restaurant.app.menu.entity.MenuCategoryEntity;
import com.restaurant.app.menu.entity.MenuItem;
import com.restaurant.app.menu.service.MenuService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    // --- Menu Categories Endpoints ---

    @GetMapping("/categories")
    public ResponseEntity<List<MenuCategoryEntity>> getAllCategories(
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        return ResponseEntity.ok(menuService.getAllCategories(activeOnly));
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<MenuCategoryEntity> getCategoryById(@PathVariable int id) {
        return ResponseEntity.ok(menuService.getCategoryById(id));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<MenuCategoryEntity>> createCategory(@RequestBody MenuCategoryEntity category) {
        MenuCategoryEntity created = menuService.createCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Menu category created successfully", created));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<MenuCategoryEntity>> updateCategory(
            @PathVariable int id, @RequestBody MenuCategoryEntity category) {
        MenuCategoryEntity updated = menuService.updateCategory(id, category);
        return ResponseEntity.ok(ApiResponse.ok("Menu category updated successfully", updated));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable int id) {
        menuService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.ok("Menu category deleted successfully", null));
    }

    // --- Menu Items Endpoints ---

    @GetMapping({"", "/items"})
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        return ResponseEntity.ok(menuService.getAllMenuItems());
    }

    @GetMapping({"/items/{id}", "/{id}"})
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable int id) {
        return ResponseEntity.ok(menuService.getMenuItemById(id));
    }

    @PostMapping({"", "/items"})
    public ResponseEntity<ApiResponse<MenuItem>> createMenuItem(@RequestBody MenuItem item) {
        if (menuService.createMenuItem(item)) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok("Menu item created successfully", item));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Failed to create menu item"));
    }

    @PutMapping({"/items/{id}", "/{id}"})
    public ResponseEntity<ApiResponse<MenuItem>> updateMenuItem(
            @PathVariable int id, @RequestBody MenuItem item) {
        item.setId(id);
        if (menuService.updateMenuItem(item)) {
            return ResponseEntity.ok(ApiResponse.ok("Menu item updated successfully", item));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Failed to update menu item"));
    }

    @PatchMapping({"/items/{id}/availability", "/{id}/availability"})
    public ResponseEntity<ApiResponse<Void>> toggleAvailability(
            @PathVariable int id, @RequestBody(required = false) Map<String, Object> body) {
        Boolean isAvailable = null;
        if (body != null && body.containsKey("isAvailable")) {
            isAvailable = Boolean.parseBoolean(body.get("isAvailable").toString());
        } else if (body != null && body.containsKey("available")) {
            isAvailable = Boolean.parseBoolean(body.get("available").toString());
        }
        menuService.toggleMenuItemAvailability(id, isAvailable);
        return ResponseEntity.ok(ApiResponse.ok("Menu item availability updated", null));
    }

    @DeleteMapping({"/items/{id}", "/{id}"})
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable int id) {
        if (menuService.deleteMenuItem(id)) {
            return ResponseEntity.ok(ApiResponse.ok("Menu item deleted successfully", null));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Failed to delete menu item"));
    }
}
