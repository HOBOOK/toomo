package com.hobook.tomo.repository;

import com.hobook.tomo.model.Account;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface AccountRepository extends CrudRepository<Account, Long> {
    Optional<Account> findByEmail(String userEmail);
}
