package com.restaurant.app.operation.repository;

import com.restaurant.app.operation.entity.BranchEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BranchRepository extends JpaRepository<BranchEntity, Integer> {

    List<BranchEntity> findByRestaurantId(Integer restaurantId);

    List<BranchEntity> findByStatus(String status);

    List<BranchEntity> findByCityIgnoreCase(String city);

    long countByStatus(String status);

    long countByRestaurantId(Integer restaurantId);

    boolean existsByBranchCode(String branchCode);

    @Query("SELECT COALESCE(SUM(b.seatingCapacity), 0) FROM BranchEntity b")
    Integer sumTotalSeatingCapacity();
}
