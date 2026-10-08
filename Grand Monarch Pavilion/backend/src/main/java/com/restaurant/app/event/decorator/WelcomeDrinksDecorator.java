package com.restaurant.app.event.decorator;

/**
 * Concrete Decorator: Adds welcoming mocktail station and pre-event finger foods.
 */
public class WelcomeDrinksDecorator extends PackageAddonDecorator {

    private final double addonCost;

    public WelcomeDrinksDecorator(EventPackageComponent decoratedPackage, double addonCost) {
        super(decoratedPackage);
        this.addonCost = addonCost > 0 ? addonCost : 45000.0;
    }

    public WelcomeDrinksDecorator(EventPackageComponent decoratedPackage) {
        this(decoratedPackage, 45000.0);
    }

    @Override
    public String getPackageDescription() {
        return super.getPackageDescription() + " + [Addon: Welcome Mocktail & Canapés Station]";
    }

    @Override
    public double getPackageCost() {
        return super.getPackageCost() + addonCost;
    }
}
