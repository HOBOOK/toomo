package com.hobook.tomo.repository;

import com.hobook.tomo.model.Memo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface MemoRepository extends JpaRepository<Memo, Long> {
}
