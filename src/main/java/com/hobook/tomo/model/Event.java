package com.hobook.tomo.model;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@Table(name="events")
public class Event extends Time {
    @Id
    @GenericGenerator(name="event_seq",strategy="increment")
    @GeneratedValue(generator = "event_seq")
    @Column(name="id", nullable=false, updatable = false)
    private Long id;

    @Column(name="creator", nullable = false, length = 50)
    private String creator;

    @Column(name="date_event", nullable = false)
    private String date_event;

    @Column(name="date_event_end")
    private String date_event_end;

    @Column(name="event_type")
    private int event_type;

    @Column(name="event_state")
    private int event_state;

    @Column(name="event_point")
    private int event_point;

    @Column(name="event_time")
    private LocalDateTime event_time;

    @Column(name="title", nullable = false, length = 20)
    private String title;

    @Column(name="event_description", length = 50)
    private String event_description;

    @Builder
    public Event(Long id, String creator, String date_event, String date_event_end, int event_type, int event_state, int event_point, LocalDateTime event_time, String title, String event_description){
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
    }
}
