package com.restaurant.app.event.decorator;

/**
 * Concrete Decorator: Adds premium floral centerpieces and luxury stage backdrop.
 */
public class FloralDecorationDecorator extends PackageAddonDecorator {

    private final double addonCost;

    public FloralDecorationDecorator(EventPackageComponent decoratedPackage, double addonCost) {
        super(decoratedPackage);
        this.addonCost = addonCost > 0 ? addonCost : 75000.0;
    }

    public FloralDecorationDecorator(EventPackageComponent decoratedPackage) {
        this(decoratedPackage, 75000.0);
    }

    @Override
    public String getPackageDescription() {
        return super.getPackageDescription() + " + [Addon: Premium Fresh Floral Theme & Stage Arch]";
    }

    @Override
    public double getPackageCost() {
        return super.getPackageCost() + addonCost;
    }
}
