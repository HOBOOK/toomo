package com.hobook.tomo.model;

public class User {
    private String id;
    private String name;
    private String email;
    private String password;
    private String profileImageUrl;
    private String dateOfLastLogin;
    private String dateOfSign;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public String getDateOfLastLogin() {
        return dateOfLastLogin;
    }

    public void setDateOfLastLogin(String dateOfLastLogin) {
        this.dateOfLastLogin = dateOfLastLogin;
    }

    public String getDateOfSign() {
        return dateOfSign;
    }

    public void setDateOfSign(String dateOfSign) {
        this.dateOfSign = dateOfSign;
    }
}
