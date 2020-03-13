package com.hobook.tomo.service;


import com.hobook.tomo.model.Role;
import com.hobook.tomo.dto.AccountDto;
import com.hobook.tomo.model.Account;
import com.hobook.tomo.repository.AccountRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.rememberme.PersistentRememberMeToken;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;

import java.util.*;

@Service
@AllArgsConstructor
public class AccountService implements UserDetailsService {
    private AccountRepository accountRepository;

    public Map<String, String> validateHandling(Errors errors){
        Map<String, String> validatorResult = new HashMap<>();

        for(FieldError error : errors.getFieldErrors()){
            String validKeyName = String.format("valid_%s", error.getField());
            validatorResult.put(validKeyName, error.getDefaultMessage());
        }
        return validatorResult;
    }
    @Transactional
    public Long joinUser(AccountDto accountDto){
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        accountDto.setPwd(passwordEncoder.encode(accountDto.getPwd()));
        return accountRepository.save(accountDto.toEntitiy()).getId();
    }

    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException{
        Optional<Account> accountWrapper = accountRepository.findByEmail(userEmail);
        if(!accountWrapper.isPresent())
            return null;
        Account account = accountWrapper.get();

        List<GrantedAuthority> authorities = new ArrayList<>();
        if(("admin@tomo.com").equals(userEmail)){
            authorities.add(new SimpleGrantedAuthority(Role.ADMIN.getValue()));
        } else{
            authorities.add(new SimpleGrantedAuthority(Role.BASIC.getValue()));
        }
        return new User(account.getEmail(), account.getPwd(), authorities);
    }

    public AccountDto getAccountDto(String userEmail){
        Optional<Account> accountWrapper = accountRepository.findByEmail(userEmail);
        if(!accountWrapper.isPresent())
            return null;
        Account account = accountWrapper.get();
        AccountDto accountDto = new AccountDto(account);
        return accountDto;
    }
}
