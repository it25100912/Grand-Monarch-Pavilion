package com.restaurant.app.event.decorator;

/**
 * Concrete Component: Base Event Banquet Package
 * Represents the fundamental package before adding any optional customizations.
 */
public class StandardEventPackage implements EventPackageComponent {

    private final String packageName;
    private final double baseCost;

    public StandardEventPackage(String packageName, double baseCost) {
        this.packageName = (packageName != null && !packageName.isBlank()) ? packageName : "Grand Ballroom Royal Package";
        this.baseCost = (baseCost > 0) ? baseCost : 500000.0;
    }

    public StandardEventPackage() {
        this("Grand Ballroom Royal Package", 500000.0);
    }

    @Override
    public String getPackageName() {
        return packageName;
    }

    @Override
    public String getPackageDescription() {
        return packageName + " (Includes luxury hall seating, standard lighting, multi-course buffet buffet catering)";
    }

    @Override
    public double getPackageCost() {
        return baseCost;
    }
}
