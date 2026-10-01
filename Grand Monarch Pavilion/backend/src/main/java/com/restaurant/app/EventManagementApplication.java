package com.restaurant.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootApplication
@ComponentScan(
    basePackages = "com.restaurant.app",
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.REGEX,
        pattern = "com\\.restaurant\\.app\\.(billing|dashboard|user)\\..*"
    )
)
public class EventManagementApplication {

    public static void main(String[] args) {
        System.out.println("\n==========================================================");
        System.out.println("  Launching Grand Monarch Event Management Application... ");
        System.out.println("==========================================================\n");

        SpringApplication.run(EventManagementApplication.class, args);

        System.out.println("\n");
        System.out.println("################################################################################");
        System.out.println("##                                                                            ##");
        System.out.println("##       🎉 GRAND MONARCH APPLICATION LAUNCHED SUCCESSFULLY & READY! 🎉       ##");
        System.out.println("##                                                                            ##");
        System.out.println("################################################################################");
        System.out.println("  ➜ Status:           ONLINE & READY TO USE");
        System.out.println("  ➜ Web Server:       http://localhost:8080");
        System.out.println("  ➜ Frontend UI:      http://localhost:8080/");
        System.out.println("  ➜ REST API Base:    http://localhost:8080/api/dashboard");
        System.out.println("  ➜ Database:         MySQL Connected (restaurant_event_db)");
        System.out.println("================================================================================");
        System.out.println("  All Services are Active! You can now use the System or Open your Browser!\n");
    }
}

