package com.hobook.tomo.controller;

import com.hobook.tomo.dto.AccountDto;
import com.hobook.tomo.service.EmailService;
import com.hobook.tomo.service.AccountService;
import com.hobook.tomo.util.Common;
import com.hobook.tomo.util.TempAuthKey;
import lombok.AllArgsConstructor;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@AllArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final EmailService emailService;
    @Autowired private final Common common;

    @RequestMapping(value = "/updateProfileInfo", method = {RequestMethod.POST,RequestMethod.PUT})
    public @ResponseBody
    ResponseEntity<AccountDto> updateProfileInfo(@RequestBody AccountDto accountDto, Principal principal) {
        try {
            AccountDto account = accountService.getAccountDto(principal.getName());
            account.setProfile_image_url(accountDto.getProfile_image_url());
            account.setNickname(accountDto.getNickname());
            common.print(account.toString());
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
        }else if(accountService.loadUserByUsername(accountDto.getEmail())!=null) {
            model.addAttribute("valid_email", "! 중복된 이메일의 회원이 이미 있습니다.");
            return "/signup";
        }
        accountDto.setProfile_image_url("img/anonymous.png");
        accountDto.setAccount_auth_key(new TempAuthKey().getKey(25, false));
        accountService.joinUser(accountDto);
        try{
            emailService.sendAuthMail(accountDto);
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return "redirect:/denied?email="+accountDto.getEmail();
    }

    @PostMapping(value = "/resetemail")
    public void resetemail(AccountDto accountDto, HttpServletResponse response) throws Exception{
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter out = response.getWriter();

        AccountDto resetAccount = accountService.getAccountDto(accountDto.getEmail());
        if(resetAccount!=null && resetAccount.getAccount_auth_key().equals("Y")){
            try{
                emailService.sendResetPasswordMail(accountDto);
            }catch (Exception ex){
                ex.printStackTrace();
            }
            out.println("<script>alert('입력한 이메일 주소로 비밀번호 재설정 메일을 전송하였습니다. 확인해주세요.');window.location.replace(\"/login\");</script>");
        }else{
            out.println("<script>alert('가입되지 않거나 인증되지 않은 사용자입니다.');window.location.replace(\"/forgot\");</script>");
        }
        out.flush();
    }
    @RequestMapping(value = "/resetpassword", method = RequestMethod.GET)
    public String resetpassword(@ModelAttribute("AccountDto") AccountDto accountDto, Model model) throws Exception{
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if(passwordEncoder.matches(accountDto.getEmail(), accountDto.getAccount_auth_key())){
            AccountDto resetAccount = accountService.getAccountDto(accountDto.getEmail());
            if(resetAccount!=null && resetAccount.getAccount_auth_key().equals("Y")){
                model.addAttribute("resetAccount", resetAccount);
                return "reset_password";
            }else{
                return "index";
            }
        }else{
            return "index";
        }

    }
    @PostMapping(value = "/resetpassword")
    public String resetpassword(@Valid AccountDto accountDto, Errors errors, Model model, HttpServletResponse response){

        if(errors.hasErrors()) {

            model.addAttribute("resetAccount", accountDto);
            Map<String, String> validatorResult = accountService.validateHandling(errors);
            for (String key : validatorResult.keySet()) {
                model.addAttribute(key, validatorResult.get(key));
            }
            return "reset_password";
        }
        AccountDto resetAccount = accountService.getAccountDto(accountDto.getEmail());
        if(resetAccount!=null && resetAccount.getAccount_auth_key().equals("Y")){
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            resetAccount.setPwd(passwordEncoder.encode(accountDto.getPwd()));
            accountService.updateAccount(resetAccount);
            try{
                response.setContentType("text/html; charset=UTF-8");
                PrintWriter out = response.getWriter();
                out.println("<script>alert('비밀번호가 성공적으로 재설정되었습니다.');window.location.replace(\"/login\");</script>");
                out.flush();
            }catch (Exception ex){
                ex.printStackTrace();
            }
        }
        return "redirect:/login";
    }

    @RequestMapping(value = "/reauth", method = RequestMethod.GET)
    public void reauth(Principal principal, HttpServletResponse response) throws Exception{
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter out = response.getWriter();

        AccountDto accountDto = accountService.getAccountDto(principal.getName());
        if(accountDto.getAccount_auth_key().equals("Y")){
            out.println("<script>alert('이미 인증된 사용자입니다.');window.location.replace(\"/login\");</script>");
            out.flush();
            return;
        }
        accountDto.setAccount_auth_key(new TempAuthKey().getKey(25, false));
        accountService.updateAccount(accountDto);
        try{
            emailService.sendAuthMail(accountDto);
        }catch (Exception ex){
            ex.printStackTrace();
        }
        out.println("<script>alert('인증메일을 다시 전송하였습니다.');window.location.replace(\"/denied\");</script>");
        out.flush();
    }

    @RequestMapping(value="/confirm", method=RequestMethod.GET)
    public void emailConfirm(@ModelAttribute("AccountDto") AccountDto accountDto, HttpServletResponse response) throws Exception {
        AccountDto setAccountDto = accountService.getAccountDto(accountDto.getEmail());
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter out = response.getWriter();
        if(setAccountDto.getAccount_auth_key().equals("Y")){
            out.println("<script>alert('이미 인증이된 계정입니다.');window.location.replace(\"/login\");</script>");
            out.flush();
        }else{
            if(setAccountDto.getAccount_auth_key().equals(accountDto.getAccount_auth_key())){
                setAccountDto.setAccount_auth_key("Y");
                accountService.updateAccount(setAccountDto);
                out.println("<script>alert('성공적으로 이메일 인증이 완료되었습니다!');window.location.replace(\"/login\");</script>");
                out.flush();
            }else{
                out.println("<script>alert('만료된 인증정보 입니다. 이메일을 다시 확인하거나 인증메일을 다시 요청해주세요.');window.location.replace(\"/login\");</script>");
                out.flush();
            }
        }
    }

}
