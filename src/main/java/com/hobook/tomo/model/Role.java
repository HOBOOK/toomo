package com.hobook.tomo.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Role {
    ADMIN("ROLE_ADMIN"),
    BASIC("ROLE_BASIC");

    private String value;
}
