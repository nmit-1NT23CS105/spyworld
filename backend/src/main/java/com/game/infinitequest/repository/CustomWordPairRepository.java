package com.game.infinitequest.repository;

import com.game.infinitequest.model.CustomWordPairEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomWordPairRepository extends JpaRepository<CustomWordPairEntity, Long> {
    List<CustomWordPairEntity> findByCategoryIgnoreCase(String category);
}
