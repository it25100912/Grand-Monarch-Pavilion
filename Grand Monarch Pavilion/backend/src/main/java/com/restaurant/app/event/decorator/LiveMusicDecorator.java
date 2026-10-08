package com.restaurant.app.event.decorator;

/**
 * Concrete Decorator: Adds live entertainment music and professional audio engineering.
 */
public class LiveMusicDecorator extends PackageAddonDecorator {

    private final double addonCost;

    public LiveMusicDecorator(EventPackageComponent decoratedPackage, double addonCost) {
        super(decoratedPackage);
        this.addonCost = addonCost > 0 ? addonCost : 90000.0;
    }

    public LiveMusicDecorator(EventPackageComponent decoratedPackage) {
        this(decoratedPackage, 90000.0);
    }

    @Override
    public String getPackageDescription() {
        return super.getPackageDescription() + " + [Addon: 4-Piece Acoustic Live Band & Sound Setup]";
    }

    @Override
    public double getPackageCost() {
        return super.getPackageCost() + addonCost;
    }
}
