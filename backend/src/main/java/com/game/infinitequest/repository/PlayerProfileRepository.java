package com.game.infinitequest.repository;

import com.game.infinitequest.model.PlayerProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerProfileRepository extends JpaRepository<PlayerProfileEntity, String> {
    List<PlayerProfileEntity> findTop20ByOrderByTotalScoreDesc();
}
