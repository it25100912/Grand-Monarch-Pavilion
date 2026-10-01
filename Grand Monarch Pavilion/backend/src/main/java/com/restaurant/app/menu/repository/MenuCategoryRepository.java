package com.restaurant.app.menu.repository;

import com.restaurant.app.menu.entity.MenuCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategoryEntity, Integer> {

    List<MenuCategoryEntity> findAllByOrderByDisplayOrderAscNameAsc();

    List<MenuCategoryEntity> findByStatusOrderByDisplayOrderAscNameAsc(String status);

    Optional<MenuCategoryEntity> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}
