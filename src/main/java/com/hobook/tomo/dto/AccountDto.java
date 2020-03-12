package com.hobook.tomo.dto;

import com.hobook.tomo.model.Account;
import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class AccountDto {
    private Long id;

    @NotBlank(message = "! 닉네임을 입력해주세요.")
    private String nickname;

    @NotBlank(message = "! 이메일일을 입해주세요.")
    @Email(message = "이메일 형식에 맞지 않습니다.")
    private String email;

    @NotBlank(message = "! 비밀번호를 입력해주세요.")
    @Pattern(regexp="(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,20}",
            message = "! 비밀번호는 영문 대,소문자와 숫자, 특수기호가 적어도 1개 이상씩 포함된 8자 ~ 20자의 비밀번호여야 합니다.")
    private String pwd;

    private String profile_image_url;

    private LocalDateTime date_Create;

    private LocalDateTime date_Update;

    public Account toEntitiy(){
        return Account.builder()
                .id(id)
                .nickname(nickname)
                .email(email)
                .password(pwd)
                .profile_image_url(profile_image_url)
                .build();
    }

    @Builder
    public AccountDto(Long id, String name, String email, String password, String profile_image_url)
    {
        this.id = id;
        this.nickname = name;
        this.email = email;
        this.pwd = password;
        this.profile_image_url = profile_image_url;
    }

    public AccountDto(Account account){
        this.id = account.getId();
        this.nickname = account.getNickname();
        this.email = account.getEmail();
        this.profile_image_url = account.getProfile_image_url();
    }

}