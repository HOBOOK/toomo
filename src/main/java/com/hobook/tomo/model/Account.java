package com.hobook.tomo.model;

import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@Table(name ="accounts")
public class Account extends Time {
    @Id
    @GenericGenerator(name="account_seq",strategy="increment")
    @GeneratedValue(generator = "account_seq")
    @Column(name="id", nullable=false)
    private Long id;

    @Column(name="nickname", nullable=false, length=20)
    private String nickname;

    @Column(name="email",nullable=false, updatable = false,  unique=true, length = 50)
    private String email;

    @Column(name="pwd",nullable=false, length = 100)
    private String pwd;

    @Column(name="profile_image_url",nullable=false)
    private String profile_image_url;

    @Column(name="social_provider")
    private String social_provider;

    @Column(name="account_auth_key")
    private String account_auth_key;



    @Builder
    public Account(Long id, String nickname, String email, String password, String profile_image_url, String social_provider, String account_auth_key)
    {
        this.id = id;
        this.nickname = nickname;
        this.email = email;
        this.pwd = password;
        this.profile_image_url = profile_image_url;
        this.social_provider = social_provider;
        this.account_auth_key = account_auth_key;
    }
}
