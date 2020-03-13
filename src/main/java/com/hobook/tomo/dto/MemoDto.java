package com.hobook.tomo.dto;

import com.hobook.tomo.model.Memo;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class MemoDto {
    private Long id;
    private String creator;
    private String context;
    private int state;
    private int fix;
    private LocalDateTime date_create;
    private LocalDateTime date_update;

    public Memo toEntity(){
        Memo memo = Memo.builder()
                .id(id)
                .creator(creator)
                .context(context)
                .state(state)
                .fix(fix)
                .build();
        return memo;
    }

    @Builder
    public MemoDto(Long id, String creator, String context, int state, int fix, LocalDateTime date_create, LocalDateTime date_update){
        this.id = id;
        this.creator = creator;
        this.context = context;
        this.state = state;
        this.fix = fix;
        this.date_create = date_create;
        this.date_update = date_update;
    }
}
