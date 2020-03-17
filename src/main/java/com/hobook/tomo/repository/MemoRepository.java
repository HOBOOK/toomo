package com.hobook.tomo.repository;

import com.hobook.tomo.model.Account;
import com.hobook.tomo.model.Memo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

@CrossOrigin
public interface MemoRepository extends JpaRepository<Memo, Long> {
    List<Memo> findMemosByCreator(String userEmail);

}
