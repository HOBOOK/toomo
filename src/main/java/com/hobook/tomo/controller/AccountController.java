package com.hobook.tomo.controller;

import com.hobook.tomo.dto.AccountDto;
import com.hobook.tomo.service.AccountService;
import com.hobook.tomo.util.Common;
import lombok.AllArgsConstructor;
import net.minidev.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@AllArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @RequestMapping(value = "/updateProfileInfo", method = {RequestMethod.POST,RequestMethod.PUT})
    public @ResponseBody
    ResponseEntity<AccountDto> updateProfileInfo(@RequestBody AccountDto accountDto, Principal principal) {
        try {
            AccountDto account = accountService.getAccountDto(principal.getName());
            account.setProfile_image_url(accountDto.getProfile_image_url());
            account.setNickname(accountDto.getNickname());
            accountService.updateAccount(account);
            return new ResponseEntity(account, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity("Error", HttpStatus.BAD_REQUEST);
        }
    }


    @RequestMapping(value ="/getProfileInfo", method = RequestMethod.GET)
    public ResponseEntity<Object> getProfileInfo(Principal principal)
    {
        List<JSONObject> entities = new ArrayList<JSONObject>();
        JSONObject entity = new JSONObject();
        AccountDto accountDto = accountService.getAccountDto(principal.getName());
        entity.put("email", accountDto.getEmail());
        entity.put("nickname", accountDto.getNickname());
        entity.put("profile_image_url", accountDto.getProfile_image_url());
        return new ResponseEntity<Object>(entity, HttpStatus.OK);
    }


    @PostMapping(value = "/signup")
    public String create(@Valid AccountDto accountDto, Errors errors, Model model){
        if(errors.hasErrors()){
            model.addAttribute("accountDto", accountDto);

            Map<String, String> validatorResult = accountService.validateHandling(errors);
            for(String key : validatorResult.keySet()){
                model.addAttribute(key, validatorResult.get(key));
            }
            return "/signup";
        }else if(accountService.loadUserByUsername(accountDto.getEmail())!=null){
            model.addAttribute("valid_email", "! 중복된 이메일의 회원이 이미 있습니다.");
            return "/signup";
        }
        accountService.joinUser(accountDto);
        return "redirect:/login";
    }



}
