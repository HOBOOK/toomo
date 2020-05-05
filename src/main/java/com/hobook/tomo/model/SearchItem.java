package com.hobook.tomo.model;

import lombok.*;

import javax.persistence.Entity;

@Getter
@Setter
@NoArgsConstructor
public class SearchItem {
    private Long id;
    private int type;
    private String title;
    private String creator;
    private String finder;

    @Builder
    public SearchItem(Long id, int type, String title, String crator, String finder){
        this.id = id;
        this.type =type;
        this.title = title;
        this.creator = crator;
        this.finder = finder;
    }
}
