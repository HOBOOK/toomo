package com.hobook.tomo.controller;

import com.hobook.tomo.dto.AccountDto;
import com.hobook.tomo.dto.MemoDto;
import com.hobook.tomo.model.Account;
import com.hobook.tomo.service.AccountService;
import com.hobook.tomo.util.Common;
import lombok.AllArgsConstructor;
import net.minidev.json.JSONObject;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.PrintWriter;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
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
    @RequestMapping(value = "/login-error", method = RequestMethod.GET)
    public void goLoginError(HttpServletResponse response) throws Exception
    {
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter out = response.getWriter();
        out.println("<script>alert('이메일이나 비밀번호를 다시 확인해주세요.');window.location.replace(\"/login\");</script>");
        out.flush();
    }

    @RequestMapping(value = "/signup", method = RequestMethod.GET)
    public String goSignup()
    {
        return "signup";
    }

    @RequestMapping(value ="/denied", method = RequestMethod.GET)
    public String goDenied(@ModelAttribute("AccountDto") AccountDto accountDto, Principal principal, Model model){
        if(accountDto.getEmail()!=null){
            if(accountService.getAccountDto(accountDto.getEmail()).getAccount_auth_key().equals("Y"))
                return "index";
            model.addAttribute("deniedAccount", accountService.getAccountDto(accountDto.getEmail()));
            return "denied";
        }else if(principal!=null){
            if(accountService.getAccountDto(principal.getName()).getAccount_auth_key().equals("Y"))
                return "index";
            model.addAttribute("deniedAccount", accountService.getAccountDto(principal.getName()));
            return "denied";
        }else{
            return "index";
        }
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
        else{
            if(accountService.getAccountDto(principal.getName()).getAccount_auth_key().equals("Y"))
                return goMemo(principal, model);
            else
                return "index";
        }
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

    @RequestMapping(value = "/modal/modal_event", method = RequestMethod.GET)
    public String goEventModal()
    {
        return "modal/modal_event";
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
