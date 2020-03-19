package com.hobook.tomo.controller;

import com.hobook.tomo.dto.AccountDto;
import com.hobook.tomo.model.Account;
import com.hobook.tomo.service.AccountService;
import lombok.AllArgsConstructor;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.security.Principal;
import java.util.Date;
import java.util.Map;

@Controller
@AllArgsConstructor
public class PageController implements ErrorController {
    private AccountService accountService;

    @Override
    public String getErrorPath(){
        return "/error/error";
    }

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request, Model model) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        HttpStatus httpStatus = HttpStatus.valueOf(Integer.valueOf(status.toString()));
        model.addAttribute("code", status.toString());
        model.addAttribute("msg", httpStatus.getReasonPhrase());
        model.addAttribute("timestamp", new Date());
        return "error/error";
    }
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String goLogin()
    {
        return "login";
    }

    @RequestMapping(value = "/signup", method = RequestMethod.GET)
    public String goSignup()
    {
        return "signup";
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
    @RequestMapping(value ="/denied", method = RequestMethod.GET)
    public String goDenied(){
        return "denied";
    }

    @RequestMapping(value = "/memo", method = {RequestMethod.GET,RequestMethod.POST})
    public String goMemo(Principal principal, Model model)
    {
        if(model.containsAttribute("account")){
            model.getAttribute("account");
        }else if(principal!=null){
            model.addAttribute("account", accountService.getAccountDto(principal.getName()));
        }
        return "memo";
    }
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String goHome(Principal principal, Model model)
    {
        if(model.containsAttribute("account")){
            model.getAttribute("account");
        }else if(principal!=null){
            model.addAttribute("account", accountService.getAccountDto(principal.getName()));
        }
        if(principal==null)
            return "index";
        else
            return "memo";
    }

    @RequestMapping(value = "/schedule", method = RequestMethod.GET)
    public String goSchedule(Principal principal, Model model)
    {
        if(model.containsAttribute("account")){
            model.getAttribute("account");
        }else if(principal!=null){
            model.addAttribute("account", accountService.getAccountDto(principal.getName()));
        }
        return "schedule";
    }

    @RequestMapping(value = "/calendar", method = RequestMethod.GET)
    public String goCalendar()
    {
        return "calendar";
    }

    @RequestMapping(value = "/modal/modal_calendar", method = RequestMethod.GET)
    public String goCalendarModal()
    {
        return "modal/modal_calendar";
    }

    @RequestMapping(value = "/manage", method = RequestMethod.GET)
    public String goManage(Principal principal, Model model)
    {
        if(model.containsAttribute("account")){
            model.getAttribute("account");
        }else if(principal!=null){
            model.addAttribute("account", accountService.getAccountDto(principal.getName()));
        }
        return "manage";
    }
}
