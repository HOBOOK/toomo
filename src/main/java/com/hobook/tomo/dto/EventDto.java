package com.hobook.tomo.dto;

import com.hobook.tomo.model.Event;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class EventDto {
    private Long id;
    private String creator;
    private String date_event;
    private int event_type;
    private int event_state;
    private String title;
    private String event_description;
    private LocalDateTime date_create;
    private LocalDateTime date_update;

    public Event toEntity(){
        Event event = Event.builder()
                .id(id)
                .creator(creator)
                .date_event(date_event)
                .event_type(event_type)
                .event_state(event_state)
                .title(title)
                .event_description(event_description)
                .build();
        return event;
    }

    @Builder
    public EventDto(Long id, String creator, String date_event, int event_type, int event_state, String title, String event_description, LocalDateTime date_create, LocalDateTime date_update){
        this.id = id;
        this.creator = creator;
        this.date_event = date_event;
        this.event_type = event_type;
        this.event_state = event_state;
        this.title = title;
        this.event_description = event_description;
        this.date_create = date_create;
        this.date_update = date_update;
    }
}
