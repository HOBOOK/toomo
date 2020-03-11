package com.hobook.tomo.controller;

import com.hobook.tomo.dto.AccountDto;
import com.hobook.tomo.service.AccountService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@AllArgsConstructor
public class AccountController {
    private AccountService accountService;

    @PostMapping("/signup")
    public String create(AccountDto accountDto){
        accountService.joinUser(accountDto);
        return "";
    }
    @GetMapping("/login/result")
    public String getLoginResult(){
        return "/loginSuccess";
    }
    @GetMapping("/logout/result")
    public String getLogoutResult(){
        return "/logout";
    }
}
