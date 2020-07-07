package com.hobook.tomo.service;

import com.hobook.tomo.dto.AccountDto;
import lombok.AllArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

@Service
@AllArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    private SpringTemplateEngine templateEngine;

    public void sendMail(String to, String subject, String text){
        SimpleMailMessage message = createMessage(to, subject, text);
        try{
            mailSender.send(message);
        }catch (MailException ex){
            throw new IllegalArgumentException();
        }
    }
    public void sendAuthMail(AccountDto accountDto) throws MessagingException{
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setSubject("[TOMO - 메모, 일정관리 서비스] 회원가입 인증확인 메일입니다.");
        helper.setTo(accountDto.getEmail());

        Context context = new Context();
        String mail_data = new StringBuffer().append("http://www.toomo.site/confirm?")
                .append("email=")
                .append(accountDto.getEmail())
                .append("&account_auth_key=")
                .append(accountDto.getAccount_auth_key()).toString();
        context.setVariable("mail_data",mail_data);
        String html = templateEngine.process("mail-template",context);
        helper.setText(html, true);
        mailSender.send(message);
    }
    public void sendResetPasswordMail(AccountDto accountDto) throws MessagingException{
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setSubject("[TOMO - 메모, 일정관리 서비스] 비밀번호 재설정 관련");
        helper.setTo(accountDto.getEmail());

        Context context = new Context();
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String mail_data = new StringBuffer().append("http://www.toomo.site/resetpassword?")
                .append("email=")
                .append(accountDto.getEmail())
                .append("&account_auth_key=")
                .append(passwordEncoder.encode(accountDto.getEmail())).toString();
        context.setVariable("mail_data",mail_data);
        String html = templateEngine.process("mail-reset-template",context);
        helper.setText(html, true);
        mailSender.send(message);
    }


    private SimpleMailMessage createMessage(String to, String subject, String text){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        return message;
    }
}
