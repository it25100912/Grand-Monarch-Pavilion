package com.restaurant.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String frontendPath = findFrontendDirectory();
        String uri = new File(frontendPath).toURI().toString();
        if (!uri.endsWith("/")) uri += "/";
        registry.addResourceHandler("/**")
                .addResourceLocations(uri, "classpath:/static/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
    }

    private String findFrontendDirectory() {
        File f1 = new File("../frontend");
        if (f1.exists()) return f1.getAbsolutePath();
        File f2 = new File("frontend");
        if (f2.exists()) return f2.getAbsolutePath();
        return new File("c:/Users/Chithu/Music/SE Original/SE/frontend").getAbsolutePath();
    }
}
