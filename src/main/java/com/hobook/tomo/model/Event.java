package com.hobook.tomo.model;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

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

    @Column(name="event_type")
    private int event_type;

    @Column(name="title", nullable = false, length = 20)
    private String title;

    @Column(name="event_description", length = 50)
    private String event_description;

    @Builder
    public Event(Long id, String creator, String date_event, int event_type, String title, String event_description){
        this.id = id;
        this.creator = creator;
        this.date_event = date_event;
        this.event_type = event_type;
        this.title = title;
        this.event_description = event_description;
    }
}
