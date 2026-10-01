package com.restaurant.app.menu.service;

import com.restaurant.app.common.exception.BadRequestException;
import com.restaurant.app.common.exception.ResourceNotFoundException;
import com.restaurant.app.menu.entity.MenuCategoryEntity;
import com.restaurant.app.menu.entity.MenuItem;
import com.restaurant.app.menu.repository.MenuCategoryRepository;
import com.restaurant.app.menu.repository.MenuRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for Culinary Menu Categories and Dishes Management.
 */
@Service
public class MenuService {

    private final MenuRepository menuRepository;
    private final MenuCategoryRepository categoryRepository;

    public MenuService(MenuRepository menuRepository, MenuCategoryRepository categoryRepository) {
        this.menuRepository = menuRepository;
        this.categoryRepository = categoryRepository;
    }

    @PostConstruct
    public void initDefaultCategoriesAndItems() {
        if (categoryRepository.count() == 0) {
            MenuCategoryEntity starters = categoryRepository.save(new MenuCategoryEntity(
                    "Starters", "Crispy appetizers, savory rolls, and warm velvety soups to begin your dining experience.",
                    "fa-bowl-food", "https://images.unsplash.com/photo-1623253083987-26681ce4a992?auto=format&fit=crop&w=800&q=80", 1, "ACTIVE"
            ));
            MenuCategoryEntity mainCourse = categoryRepository.save(new MenuCategoryEntity(
                    "Main Course", "Prime steaks, artisan burgers, gourmet pastas, and wood-fired pizzas.",
                    "fa-drumstick-bite", "https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=800&auto=format&fit=crop", 2, "ACTIVE"
            ));
            MenuCategoryEntity riceNoodles = categoryRepository.save(new MenuCategoryEntity(
                    "Rice & Noodles", "Wok-tossed Sri Lankan specialties, fragrant fried rice, and savory noodles.",
                    "fa-bowl-food", "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800&auto=format&fit=crop", 3, "ACTIVE"
            ));
            MenuCategoryEntity desserts = categoryRepository.save(new MenuCategoryEntity(
                    "Desserts", "Decadent sweet treats, warm brownies, artisan cheesecakes, and golden waffles.",
                    "fa-cake-candles", "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop", 4, "ACTIVE"
            ));
            MenuCategoryEntity beverages = categoryRepository.save(new MenuCategoryEntity(
                    "Beverages", "Chilled Ceylon iced teas, fresh tropical smoothies, and artisan coolers.",
                    "fa-martini-glass-citrus", "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop", 5, "ACTIVE"
            ));

            if (menuRepository.getAllMenuItems().isEmpty()) {
                // Starters
                menuRepository.createMenuItem(new MenuItem(0, "Crispy Vegetable Spring Rolls", "Starters", starters.getId(),
                        "Golden fried crispy rolls filled with fresh garden vegetables and glass noodles, served with sweet chili sauce.",
                        1200.00, "https://images.unsplash.com/photo-1623253083987-26681ce4a992?auto=format&fit=crop&w=800&q=80",
                        true, false, 0, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Spicy Chicken Wings", "Starters", starters.getId(),
                        "Tender chicken wings glazed in a fiery buffalo sauce, served with a cool ranch dipping sauce.",
                        1600.00, "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=800&auto=format&fit=crop",
                        false, true, 2, false, true));
                menuRepository.createMenuItem(new MenuItem(0, "Creamy Mushroom Soup", "Starters", starters.getId(),
                        "Rich and velvety soup made from fresh button mushrooms, herbs, and a touch of heavy cream.",
                        1100.00, "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, false, true));
                menuRepository.createMenuItem(new MenuItem(0, "Gourmet Caesar Salad with Garlic Croutons", "Starters", starters.getId(),
                        "Crisp romaine lettuce hearts, shaved aged parmesan, crunchy garlic herb croutons, tossed in house-made creamy caesar dressing.",
                        1350.00, "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Golden Calamari Fritti", "Starters", starters.getId(),
                        "Tender calamari rings flash-fried in a seasoned sea-salt batter, accompanied by zesty garlic lemon aioli and fresh lime wedges.",
                        1850.00, "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop",
                        false, true, 1, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Truffle Infused Garlic Bruschetta", "Starters", starters.getId(),
                        "Grilled artisan sourdough brushed with extra virgin olive oil, topped with ripe diced vine tomatoes, basil, and white truffle glaze.",
                        1250.00, "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, false, true));
                menuRepository.createMenuItem(new MenuItem(0, "Spicy Tiger Prawn Tom Yum Soup", "Starters", starters.getId(),
                        "Aromatic and spicy lemongrass broth infused with wild tiger prawns, straw mushrooms, galangal, kaffir lime, and bird's eye chili.",
                        1950.00, "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?q=80&w=800&auto=format&fit=crop",
                        false, true, 3, true, true));

                // Main Course
                menuRepository.createMenuItem(new MenuItem(0, "Grilled Chicken Steak with Herbs", "Main Course", mainCourse.getId(),
                        "Juicy grilled chicken breast marinated in aromatic herbs, served with roasted vegetables and pepper sauce.",
                        2400.00, "https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=800&auto=format&fit=crop",
                        false, false, 1, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Classic Beef Burger with Fries", "Main Course", mainCourse.getId(),
                        "Premium beef patty with melted cheese, fresh lettuce, and tomatoes in a brioche bun, served with crispy fries.",
                        2200.00, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
                        false, false, 0, false, true));
                menuRepository.createMenuItem(new MenuItem(0, "Creamy White Sauce Pasta", "Main Course", mainCourse.getId(),
                        "Al dente penne pasta tossed in a rich, creamy garlic parmesan sauce with mushrooms and herbs.",
                        1900.00, "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, false, true));
                menuRepository.createMenuItem(new MenuItem(0, "Wood-Fired Margherita Pizza", "Main Course", mainCourse.getId(),
                        "Traditional thin-crust pizza topped with fresh mozzarella, ripe tomatoes, and fragrant basil leaves.",
                        2500.00, "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Slow-Braised Australian Lamb Shank", "Main Course", mainCourse.getId(),
                        "Fall-off-the-bone tender lamb shank slow-braised in a rich rosemary red-wine jus, served with buttery garlic mash and roasted carrots.",
                        4200.00, "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
                        false, true, 1, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Pan-Seared Atlantic Salmon Fillet", "Main Course", mainCourse.getId(),
                        "Crispy skin Norwegian salmon steak served with creamy dill velouté, butter-glazed asparagus, and saffron parmentier potatoes.",
                        3850.00, "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop",
                        false, false, 0, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Wild Forest Mushroom & Truffle Risotto", "Main Course", mainCourse.getId(),
                        "Slow-stirred arborio rice with porcini and cremini mushrooms, white wine reduction, parmesan reggiano, and black truffle oil.",
                        2650.00, "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, false, true));
                menuRepository.createMenuItem(new MenuItem(0, "Smoked BBQ Bacon & Angus Cheddar Burger", "Main Course", mainCourse.getId(),
                        "Flame-grilled Angus patty with melted sharp cheddar, crispy smoked bacon, caramelized onion jam, and bourbon BBQ sauce with curly fries.",
                        2750.00, "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=800&auto=format&fit=crop",
                        false, true, 1, false, true));

                // Rice & Noodles
                menuRepository.createMenuItem(new MenuItem(0, "Sri Lankan Style Chicken Fried Rice", "Rice & Noodles", riceNoodles.getId(),
                        "Fragrant basmati rice wok-tossed with tender chicken pieces, eggs, and authentic spices, served with chili paste.",
                        1800.00, "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800&auto=format&fit=crop",
                        false, true, 2, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Spicy Seafood Nasi Goreng", "Rice & Noodles", riceNoodles.getId(),
                        "Indonesian style fried rice loaded with prawns, fish, calamari, topped with a fried egg and satay skewers.",
                        2600.00, "https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=800&auto=format&fit=crop",
                        false, true, 3, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Hot Garlic Veg Noodles", "Rice & Noodles", riceNoodles.getId(),
                        "Stir-fried noodles tossed with fresh julienned vegetables in a spicy garlic and soy reduction.",
                        1500.00, "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
                        true, true, 2, false, true));
                menuRepository.createMenuItem(new MenuItem(0, "Royal Mutton Dum Biryani", "Rice & Noodles", riceNoodles.getId(),
                        "Slow-steamed fragrant basmati rice with succulent spice-marinated mutton, saffron, caramelized onions, boiled egg, raita, and gravy.",
                        3100.00, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop",
                        false, true, 2, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Singapore Chili Crab Egg Noodles", "Rice & Noodles", riceNoodles.getId(),
                        "Wok-fried egg noodles coated in authentic sweet-and-spicy Singapore chili crab glaze with sweet swimmer crab meat and scallions.",
                        2850.00, "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop",
                        false, true, 3, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Signature Bangkok Wok Pad Thai", "Rice & Noodles", riceNoodles.getId(),
                        "Classic stir-fried flat rice noodles with tiger prawns, chicken, farm egg, crunchy bean sprouts, crushed peanuts, and tangy tamarind.",
                        2400.00, "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=800&auto=format&fit=crop",
                        false, true, 1, false, true));
                menuRepository.createMenuItem(new MenuItem(0, "Steamed Vegetable & Tofu Claypot Rice", "Rice & Noodles", riceNoodles.getId(),
                        "Fragrant jasmine rice sizzled in a traditional claypot with braised shiitake mushrooms, crisp bok choy, golden tofu, and sesame soy.",
                        1650.00, "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, false, true));

                // Desserts
                menuRepository.createMenuItem(new MenuItem(0, "Rich Chocolate Brownie with Ice Cream", "Desserts", desserts.getId(),
                        "Decadent warm chocolate fudge brownie served with a scoop of vanilla bean ice cream and chocolate drizzle.",
                        1200.00, "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Classic New York Cheesecake", "Desserts", desserts.getId(),
                        "Smooth, rich, and creamy baked cheesecake on a graham cracker crust with strawberry compote.",
                        1400.00, "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Caramel Waffles", "Desserts", desserts.getId(),
                        "Freshly baked golden waffles drizzled with rich butterscotch caramel sauce and powdered sugar.",
                        1100.00, "https://images.unsplash.com/photo-1562376552-0d160a2f238d?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, false, true));
                menuRepository.createMenuItem(new MenuItem(0, "Traditional Italian Espresso Tiramisu", "Desserts", desserts.getId(),
                        "Delicate espresso and amaretto soaked savoiardi biscuits layered with silky sweet mascarpone cheese and dusted with premium Valrhona cocoa.",
                        1450.00, "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Belgian Warm Molten Lava Cake", "Desserts", desserts.getId(),
                        "Decadent dark chocolate soufflé cake with a warm flowing liquid fudge center, served with raspberry coulis and vanilla bean gelato.",
                        1550.00, "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Tropical Mango & Passionfruit Panna Cotta", "Desserts", desserts.getId(),
                        "Velvety smooth Madagascar vanilla panna cotta topped with a glistening layer of golden Alphonso mango and passionfruit jelly.",
                        1300.00, "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, false, true));
                menuRepository.createMenuItem(new MenuItem(0, "Artisan Cinnamon Churros with Dulce de Leche", "Desserts", desserts.getId(),
                        "Crispy Spanish churro loops dusted in fragrant cinnamon sugar, paired with warm salted caramel dulce de leche and chocolate dipping pots.",
                        1250.00, "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, false, true));

                // Beverages
                menuRepository.createMenuItem(new MenuItem(0, "Fresh Iced Lemon Mint Tea", "Beverages", beverages.getId(),
                        "Refreshing brewed Ceylon black tea infused with fresh lemon juice, mint leaves, and ice.",
                        700.00, "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, false, true));
                menuRepository.createMenuItem(new MenuItem(0, "Tropical Fruit Smoothie / Mojito", "Beverages", beverages.getId(),
                        "A cooling blend of seasonal tropical fruits, mint, lime, and crushed ice.",
                        950.00, "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Passionfruit & Garden Basil Sparkler", "Beverages", beverages.getId(),
                        "Refreshing fizzy mocktail made with fresh crushed passionfruit pulp, fragrant garden basil, freshly squeezed lime, and sparkling soda.",
                        850.00, "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Iced Salted Caramel Macchiato", "Beverages", beverages.getId(),
                        "Freshly extracted double shot of dark-roast Arabica espresso layered over cold vanilla milk, topped with a velvety caramel drizzle.",
                        950.00, "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, true, true));
                menuRepository.createMenuItem(new MenuItem(0, "Royal Ceylon Spiced Chai Frappe", "Beverages", beverages.getId(),
                        "Blended creamy iced frappe brewed from premium Ceylon black tea with green cardamom, Ceylon cinnamon, honey, and whipped cream.",
                        900.00, "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, false, true));
                menuRepository.createMenuItem(new MenuItem(0, "Wild Blueberry Lavender Fizz", "Beverages", beverages.getId(),
                        "Botanical handcrafted refresher with muddled forest blueberries, French lavender syrup, lemon zest, and ice-cold club soda.",
                        850.00, "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, false, true));
                menuRepository.createMenuItem(new MenuItem(0, "Fresh Tropical Virgin Piña Colada", "Beverages", beverages.getId(),
                        "Island-inspired creamy blend of golden pineapple juice, fresh rich coconut cream, and crushed ice with a toasted coconut garnish.",
                        950.00, "https://images.unsplash.com/photo-1546171753-97d7676e4602?q=80&w=800&auto=format&fit=crop",
                        true, false, 0, true, true));
            }
        }
    }

    // --- Category Management ---

    public List<MenuCategoryEntity> getAllCategories(boolean activeOnly) {
        List<MenuCategoryEntity> list = activeOnly
                ? categoryRepository.findByStatusOrderByDisplayOrderAscNameAsc("ACTIVE")
                : categoryRepository.findAllByOrderByDisplayOrderAscNameAsc();

        for (MenuCategoryEntity cat : list) {
            long count = cat.getId() != null ? menuRepository.countByCategoryId(cat.getId()) : 0;
            if (count == 0 && cat.getName() != null) {
                count = menuRepository.countByCategoryName(cat.getName());
            }
            cat.setItemCount(count);
        }
        return list;
    }

    public MenuCategoryEntity getCategoryById(int id) {
        MenuCategoryEntity cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        cat.setItemCount(menuRepository.countByCategoryId(cat.getId()));
        return cat;
    }

    public MenuCategoryEntity createCategory(MenuCategoryEntity category) {
        if (category.getName() == null || category.getName().trim().length() < 2) {
            throw new BadRequestException("Category name must be at least 2 characters.");
        }
        if (category.getName().trim().matches("^\\d+$")) {
            throw new BadRequestException("Category name cannot be numbers only (e.g. 123). Please use letters.");
        }
        if (categoryRepository.existsByNameIgnoreCase(category.getName().trim())) {
            throw new BadRequestException("A category with this name already exists: " + category.getName());
        }
        category.setName(category.getName().trim());
        if (category.getDisplayOrder() == null || category.getDisplayOrder() <= 0) {
            category.setDisplayOrder((int) categoryRepository.count() + 1);
        }
        if (category.getStatus() == null) category.setStatus("ACTIVE");
        return categoryRepository.save(category);
    }

    public MenuCategoryEntity updateCategory(int id, MenuCategoryEntity updated) {
        MenuCategoryEntity existing = getCategoryById(id);
        if (updated.getName() != null && !updated.getName().trim().equalsIgnoreCase(existing.getName())) {
            if (categoryRepository.existsByNameIgnoreCase(updated.getName().trim())) {
                throw new BadRequestException("Another category with this name already exists.");
            }
            existing.setName(updated.getName().trim());
        }
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription().trim());
        if (updated.getIcon() != null) existing.setIcon(updated.getIcon().trim());
        if (updated.getImageUrl() != null) existing.setImageUrl(updated.getImageUrl().trim());
        if (updated.getDisplayOrder() != null) existing.setDisplayOrder(updated.getDisplayOrder());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus().trim().toUpperCase());
        return categoryRepository.save(existing);
    }

    public void deleteCategory(int id) {
        MenuCategoryEntity category = getCategoryById(id);
        long itemsLinked = menuRepository.countByCategoryId(id);
        if (itemsLinked == 0 && category.getName() != null) {
            itemsLinked = menuRepository.countByCategoryName(category.getName());
        }
        if (itemsLinked > 0) {
            throw new BadRequestException("Cannot delete category '" + category.getName() + "' because " + itemsLinked + " active menu dish(es) are assigned to it. Please reassign or remove dishes first.");
        }
        categoryRepository.delete(category);
    }

    // --- Menu Items Management ---

    public List<MenuItem> getAllMenuItems() {
        return menuRepository.getAllMenuItems();
    }

    public MenuItem getMenuItemById(int id) {
        MenuItem item = menuRepository.getMenuItemById(id);
        if (item == null) {
            throw new ResourceNotFoundException("Menu item not found with ID: " + id);
        }
        return item;
    }

    public boolean createMenuItem(MenuItem item) {
        if (item.getName() == null || item.getName().trim().length() < 2) {
            throw new BadRequestException("Item name must be at least 2 characters.");
        }
        if (item.getName().trim().matches("^\\d+$")) {
            throw new BadRequestException("Dish name cannot be numbers only (e.g. 123). Please use letters.");
        }
        if (item.getPrice() <= 0) {
            throw new BadRequestException("Item price must be greater than zero.");
        }
        if (item.getCategory() == null || item.getCategory().isBlank()) {
            item.setCategory("Main Courses & Steaks");
        }
        return menuRepository.createMenuItem(item);
    }

    public boolean updateMenuItem(MenuItem item) {
        if (item.getId() <= 0) {
            throw new BadRequestException("Invalid item ID for update.");
        }
        if (item.getName() == null || item.getName().trim().length() < 2) {
            throw new BadRequestException("Item name must be at least 2 characters.");
        }
        if (item.getName().trim().matches("^\\d+$")) {
            throw new BadRequestException("Dish name cannot be numbers only (e.g. 123). Please use letters.");
        }
        if (item.getPrice() <= 0) {
            throw new BadRequestException("Item price must be greater than zero.");
        }
        return menuRepository.updateMenuItem(item);
    }

    public boolean toggleMenuItemAvailability(int id, Boolean isAvailable) {
        MenuItem item = getMenuItemById(id);
        boolean newStatus = isAvailable != null ? isAvailable : !item.isAvailable();
        return menuRepository.toggleAvailability(id, newStatus);
    }

    public boolean deleteMenuItem(int id) {
        getMenuItemById(id); // validates existence
        return menuRepository.deleteMenuItem(id);
    }
}
