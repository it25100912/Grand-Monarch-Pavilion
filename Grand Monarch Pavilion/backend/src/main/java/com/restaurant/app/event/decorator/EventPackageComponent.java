package com.restaurant.app.event.decorator;

/**
 * Decorator Design Pattern — Component Interface
 * SE2030 Structural Design Pattern: Decorator Pattern
 * Defines the contract for customizable event/banquet packages.
 */
public interface EventPackageComponent {

    String getPackageName();

    String getPackageDescription();

    double getPackageCost();
}
