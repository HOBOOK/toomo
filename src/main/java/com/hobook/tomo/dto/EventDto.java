package com.hobook.tomo.dto;

import com.hobook.tomo.model.Event;
import lombok.*;
import org.apache.tomcat.jni.Local;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class EventDto {
    private Long id;
    private String creator;
    private String date_event;
    private String date_event_end;
    private int event_type;
    private int event_state;
    private int event_point;
    private LocalDateTime event_time;
    private String title;
    private String event_description;
    private LocalDateTime date_create;
    private LocalDateTime date_update;

    public Event toEntity(){
        Event event = Event.builder()
                .id(id)
                .creator(creator)
                .date_event(date_event)
                .date_event_end(date_event_end)
                .event_type(event_type)
                .event_state(event_state)
                .event_point(event_point)
                .event_time(event_time)
                .title(title)
                .event_description(event_description)
                .build();
        return event;
    }

    @Builder
    public EventDto(Long id, String creator, String date_event, String date_event_end, int event_type, int event_state, int event_point, LocalDateTime event_time, String title, String event_description, LocalDateTime date_create, LocalDateTime date_update){
        this.id = id;
        this.creator = creator;
        this.date_event = date_event;
        this.date_event_end = date_event_end;
        this.event_type = event_type;
        this.event_state = event_state;
        this.event_point = event_point;
        this.event_time = event_time;
        this.title = title;
        this.event_description = event_description;
        this.date_create = date_create;
        this.date_update = date_update;
    }
}
