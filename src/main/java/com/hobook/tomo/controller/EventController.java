package com.hobook.tomo.controller;

import com.hobook.tomo.dto.EventDto;
import com.hobook.tomo.service.EventService;
import lombok.AllArgsConstructor;
import net.minidev.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Controller
@AllArgsConstructor
public class EventController {
    private EventService eventService;

    @RequestMapping(value = "schedule/events", method = RequestMethod.GET)
    public ResponseEntity<Object> getList(Principal principal)
    {
        List<JSONObject> entities = new ArrayList<JSONObject>();
        List<EventDto> eventDtos = eventService.getEventList(principal.getName());
        for(EventDto eventDto : eventDtos){
            JSONObject entity = new JSONObject();
            entity.put("id", eventDto.getId());
            entity.put("date_event",eventDto.getDate_event());
            entity.put("event_type",eventDto.getEvent_type());
            entity.put("title",eventDto.getTitle());
            entity.put("event_description", eventDto.getEvent_description());
            entities.add(entity);
        }
        return new ResponseEntity<Object>(entities, HttpStatus.OK);
    }
    @RequestMapping(value="schedule/create", method = {RequestMethod.POST,RequestMethod.PUT})
    public @ResponseBody ResponseEntity<EventDto> create(@RequestBody EventDto eventDto, Principal principal)
    {
        try{
            eventDto.setCreator(principal.getName());
            eventService.saveEvent(eventDto);
            return new ResponseEntity(eventDto, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity("Error", HttpStatus.BAD_REQUEST);
        }

    }

    @DeleteMapping(value="schedule/delete")
    public ResponseEntity<Void> delete(@RequestParam String id){
        try{
            eventService.deleteEvent(Long.parseLong(id));
            return new ResponseEntity(HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }
}
