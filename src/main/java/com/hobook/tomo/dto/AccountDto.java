package com.hobook.tomo.dto;

import com.hobook.tomo.model.Account;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class AccountDto {
    private Long id;
    private String nickname;
    private String email;
    private String pwd;
    private String profileImageUrl;
    private LocalDateTime dateOfCreate;
    private LocalDateTime dateOfUpdate;

    public Account toEntitiy(){
        return Account.builder()
                .id(id)
                .email(email)
                .password(pwd)
                .build();
    }

    @Builder
    public AccountDto(Long id, String name, String email, String password, String profileImageUrl)
    {
        this.id = id;
        this.nickname = name;
        this.email = email;
        this.pwd = password;
        this.profileImageUrl = profileImageUrl;
    }

}
