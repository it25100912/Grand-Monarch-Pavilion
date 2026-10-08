package com.restaurant.app.event.decorator;

/**
 * Abstract Decorator: PackageAddonDecorator
 * Wraps an EventPackageComponent to dynamically attach additional services and calculate total pricing.
 */
public abstract class PackageAddonDecorator implements EventPackageComponent {

    protected final EventPackageComponent decoratedPackage;

    public PackageAddonDecorator(EventPackageComponent decoratedPackage) {
        this.decoratedPackage = decoratedPackage;
    }

    @Override
    public String getPackageName() {
        return decoratedPackage.getPackageName();
    }

    @Override
    public String getPackageDescription() {
        return decoratedPackage.getPackageDescription();
    }

    @Override
    public double getPackageCost() {
        return decoratedPackage.getPackageCost();
    }
}
