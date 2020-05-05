package com.hobook.tomo.model;

import lombok.*;

import javax.persistence.Entity;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class SearchItem {
    private Long id;
    private int type;
    private String title;
    private String creator;
    private String finder;
    private LocalDateTime date;

    @Builder
    public SearchItem(Long id, int type, String title, String crator, String finder, LocalDateTime date){
        this.id = id;
        this.type =type;
        this.title = title;
        this.creator = crator;
        this.finder = finder;
        this.date = date;
    }
}
