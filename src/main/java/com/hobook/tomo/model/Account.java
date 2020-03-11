package com.hobook.tomo.model;

import lombok.*;
import javax.persistence.*;
import java.util.List;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@Table(name ="accounts")
public class Account {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    @Column(name="nickname", nullable = false, length=20)
    private String nickname;
    @Column(name="email",nullable = false, unique = true, length = 50)
    private String email;
    @Column(name="pwd",nullable = false, length = 100)
    private String pwd;
    @Column(name="profileImageUrl",nullable = false)
    private String profileImageUrl;

    @Builder
    public Account(Long id, String nickname, String email, String password, String profileImageUrl)
    {
        this.id = id;
        this.nickname = nickname;
        this.email = email;
        this.pwd = password;
        this.profileImageUrl = profileImageUrl;
    }
}
