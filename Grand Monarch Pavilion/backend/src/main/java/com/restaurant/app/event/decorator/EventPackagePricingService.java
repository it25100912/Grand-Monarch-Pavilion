package com.restaurant.app.event.decorator;

import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service applying Decorator Design Pattern to calculate dynamic event package pricing.
 * Allows client code to wrap addons flexibly at runtime without subclass explosion.
 */
@Service
public class EventPackagePricingService {

    public EventPackageComponent buildCustomPackage(String basePackageName, double baseCost, List<String> addons) {
        EventPackageComponent packageItem = new StandardEventPackage(basePackageName, baseCost);

        if (addons == null || addons.isEmpty()) {
            return packageItem;
        }

        for (String addon : addons) {
            if (addon == null) continue;
            String normalized = addon.trim().toLowerCase();
            if (normalized.contains("floral") || normalized.contains("flower") || normalized.contains("deco")) {
                packageItem = new FloralDecorationDecorator(packageItem);
            } else if (normalized.contains("music") || normalized.contains("band") || normalized.contains("sound")) {
                packageItem = new LiveMusicDecorator(packageItem);
            } else if (normalized.contains("drink") || normalized.contains("welcome") || normalized.contains("bar")) {
                packageItem = new WelcomeDrinksDecorator(packageItem);
            }
        }

        return packageItem;
    }
}
