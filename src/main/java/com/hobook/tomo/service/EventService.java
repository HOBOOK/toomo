package com.hobook.tomo.service;

import com.hobook.tomo.dto.EventDto;
import com.hobook.tomo.model.Event;
import com.hobook.tomo.repository.EventRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class EventService {
    private EventRepository eventRepository;

    @Transactional
    public Long saveEvent(EventDto eventDto){
        return eventRepository.save(eventDto.toEntity()).getId();
    }

    @Transactional
    public void deleteEvent(Long id){
        eventRepository.deleteById(id);
    }

    @Transactional
    public EventDto getEvent(Long id, String email){
        Event event = eventRepository.findEventByIdAndCreator(id, email);
        EventDto eventDto = EventDto.builder()
                .id(event.getId())
                .creator(event.getCreator())
                .date_event(event.getDate_event())
                .date_event_end(event.getDate_event_end())
                .event_type(event.getEvent_type())
                .event_state(event.getEvent_state())
                .event_point(event.getEvent_point())
                .event_color(event.getEvent_color())
                .event_time(event.getEvent_time())
                .title(event.getTitle())
                .event_description(event.getEvent_description())
                .date_create(event.getDate_create())
                .date_update(event.getDate_update())
                .build();
        return eventDto;
    }

    @Transactional
    public List<EventDto> getEventList(String email){
        List<Event> eventEntities = eventRepository.findEventsByCreator(email);
        List<EventDto> eventDtoList = new ArrayList<>();
        for(Event event : eventEntities){
            EventDto eventDto = EventDto.builder()
                    .id(event.getId())
                    .creator(event.getCreator())
                    .date_event(event.getDate_event())
                    .date_event_end(event.getDate_event_end())
                    .event_type(event.getEvent_type())
                    .event_state(event.getEvent_state())
                    .event_point(event.getEvent_point())
                    .event_color(event.getEvent_color())
                    .event_time(event.getEvent_time())
                    .title(event.getTitle())
                    .event_description(event.getEvent_description())
                    .date_create(event.getDate_create())
                    .date_update(event.getDate_update())
                    .build();
            eventDtoList.add(eventDto);
        }
        return eventDtoList;
    }

    @Transactional
    public List<EventDto> getTodoList(String email){
        List<Event> eventEntities = eventRepository.findEventsByCreator(email);
        List<EventDto> eventDtoList = new ArrayList<>();
        for(Event event : eventEntities){
            if(event.getEvent_type()==1){
                EventDto eventDto = EventDto.builder()
                        .id(event.getId())
                        .creator(event.getCreator())
                        .date_event(event.getDate_event())
                        .date_event_end(event.getDate_event_end())
                        .event_type(event.getEvent_type())
                        .event_state(event.getEvent_state())
                        .event_point(event.getEvent_point())
                        .event_color(event.getEvent_color())
                        .event_time(event.getEvent_time())
                        .title(event.getTitle())
                        .event_description(event.getEvent_description())
                        .date_create(event.getDate_create())
                        .date_update(event.getDate_update())
                        .build();
                eventDtoList.add(eventDto);
            }
        }
        return eventDtoList;
    }
}
