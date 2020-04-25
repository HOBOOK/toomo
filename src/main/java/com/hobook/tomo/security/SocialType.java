package com.hobook.tomo.security;

public enum SocialType {
    KAKAO("kakao"),
    NAVER("naver"),
    GOOGLE("google"),
    FACEBOOK("facebook");

    private final String ROLE_PREFIX = "ROLE_";
    private String name;

    SocialType(String name){ this.name = name;}

    public String getRoleType() {
        return ROLE_PREFIX + "BASIC";
    }

    public String getValue(){
        return name;
    }

    public boolean isEquals(String authority){
        return this.getRoleType().equals(authority);
    }
}
