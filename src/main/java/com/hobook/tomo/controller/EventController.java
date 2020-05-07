package com.hobook.tomo.controller;

import com.hobook.tomo.api.APIType;
import com.hobook.tomo.dto.EventDto;
import com.hobook.tomo.model.Event;
import com.hobook.tomo.service.EventService;
import com.hobook.tomo.util.Common;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import lombok.AllArgsConstructor;
import net.minidev.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.w3c.dom.CharacterData;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.io.StringReader;
import java.security.Principal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@AllArgsConstructor
public class EventController {
    private EventService eventService;

    @RequestMapping(value = "schedule/event", method = RequestMethod.GET)
    public ResponseEntity<Object> getEvent(@RequestParam Long id, Principal principal){
        JSONObject entity = new JSONObject();
        EventDto eventDto = eventService.getEvent(id, principal.getName());
        entity.put("id", eventDto.getId());
        entity.put("date_event",eventDto.getDate_event());
        entity.put("date_event_end", eventDto.getDate_event_end());
        entity.put("event_type",eventDto.getEvent_type());
        entity.put("event_state",eventDto.getEvent_state());
        entity.put("event_point",eventDto.getEvent_point());
        entity.put("event_color",eventDto.getEvent_color());
        entity.put("event_time",eventDto.getEvent_time());
        entity.put("title",eventDto.getTitle());
        entity.put("event_description", eventDto.getEvent_description());
        return new ResponseEntity<Object>(entity, HttpStatus.OK);
    }

    @RequestMapping(value = "schedule/events", method = RequestMethod.GET)
    public ResponseEntity<Object> getList(Principal principal)
    {
        List<JSONObject> entities = new ArrayList<JSONObject>();
        List<EventDto> eventDtos = eventService.getEventList(principal.getName());
        for(EventDto eventDto : eventDtos){
            JSONObject entity = new JSONObject();
            entity.put("id", eventDto.getId());
            entity.put("date_event",eventDto.getDate_event());
            entity.put("date_event_end", eventDto.getDate_event_end());
            entity.put("event_type",eventDto.getEvent_type());
            entity.put("event_state",eventDto.getEvent_state());
            entity.put("event_point",eventDto.getEvent_point());
            entity.put("event_color",eventDto.getEvent_color());
            entity.put("event_time",eventDto.getEvent_time());
            entity.put("title",eventDto.getTitle());
            entity.put("event_description", eventDto.getEvent_description());
            entities.add(entity);
        }
        List<EventDto> holidays = getHolidays("2020");
        for(EventDto holiday : holidays) {
            JSONObject entity = new JSONObject();
            entity.put("id", holiday.getId());
            entity.put("date_event", holiday.getDate_event());
            entity.put("date_event_end", holiday.getDate_event_end());
            entity.put("event_type", holiday.getEvent_type());
            entity.put("event_state", holiday.getEvent_state());
            entity.put("event_time", holiday.getEvent_time());
            entity.put("title", holiday.getTitle());
            entity.put("event_description", holiday.getEvent_description());
            entities.add(entity);
        }

        return new ResponseEntity<Object>(entities, HttpStatus.OK);
    }

    @RequestMapping(value ="todolist/events", method = RequestMethod.GET)
    public ResponseEntity<Object> getTodoList(Principal principal){
        List<JSONObject> entities = new ArrayList<JSONObject>();
        List<EventDto> eventDtos = eventService.getTodoList(principal.getName());
        for(EventDto eventDto : eventDtos){
            if(eventDto.getEvent_state()==0){
                JSONObject entity = new JSONObject();
                entity.put("id", eventDto.getId());
                entity.put("date_event",eventDto.getDate_event());
                entity.put("date_event_end", eventDto.getDate_event_end());
                entity.put("event_type",eventDto.getEvent_type());
                entity.put("event_state",eventDto.getEvent_state());
                entity.put("event_point",eventDto.getEvent_point());
                entity.put("event_color",eventDto.getEvent_color());
                entity.put("event_time",eventDto.getEvent_time());
                entity.put("title",eventDto.getTitle());
                entity.put("event_description", eventDto.getEvent_description());
                entities.add(entity);
            }
        }
        return new ResponseEntity<Object>(entities, HttpStatus.OK);
    }

    @RequestMapping(value ="todolist/clearevents", method = RequestMethod.GET)
    public ResponseEntity<Object> getTodoClearList(Principal principal){
        List<JSONObject> entities = new ArrayList<JSONObject>();
        List<EventDto> eventDtos = eventService.getTodoList(principal.getName());
        for(EventDto eventDto : eventDtos){
            if(eventDto.getEvent_state()==1){
                JSONObject entity = new JSONObject();
                entity.put("id", eventDto.getId());
                entity.put("date_event",eventDto.getDate_event());
                entity.put("date_event_end", eventDto.getDate_event_end());
                entity.put("event_type",eventDto.getEvent_type());
                entity.put("event_state",eventDto.getEvent_state());
                entity.put("event_point",eventDto.getEvent_point());
                entity.put("event_color",eventDto.getEvent_color());
                entity.put("event_time",eventDto.getEvent_time());
                entity.put("title",eventDto.getTitle());
                entity.put("event_description", eventDto.getEvent_description());
                entities.add(entity);
            }
        }
        return new ResponseEntity<Object>(entities, HttpStatus.OK);
    }

    @RequestMapping(value="schedule/create", method = {RequestMethod.POST,RequestMethod.PUT})
    public @ResponseBody ResponseEntity<EventDto> create(@RequestBody EventDto eventDto, Principal principal)
    {
        try{
            eventDto.setCreator(principal.getName());
            eventDto.setId(eventService.saveEvent(eventDto));
            return new ResponseEntity(eventDto, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity("Error", HttpStatus.BAD_REQUEST);
        }

    }

    @DeleteMapping(value="schedule/delete")
    public ResponseEntity<Void> delete(@RequestParam String id){
        try{
            Common.print(id);
            eventService.deleteEvent(Long.parseLong(id));
            return new ResponseEntity(HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }

    // 대한민국 공휴일 데이터
    private List<EventDto> getHolidays(String year){
        String url = APIType.HOLIDAYS_AND_24DIVISIONS.getAPIUrl()+"/getHoliDeInfo?serviceKey="+APIType.HOLIDAYS_AND_24DIVISIONS.getAPIKey()
                +"&solYear="+year;
        Client client = Client.create();
        WebResource webResource = client.resource(url);
        ClientResponse response = webResource.accept("aplication/xml").get(ClientResponse.class);
        List<EventDto> holidays = new ArrayList<EventDto>();
        if(response.getStatus() != 200){
            Common.print("Failed : HTTP error code : " + response.getStatus());
            return holidays;
        }else{
            return getParseHolidayXMLResult(response.getEntity(String.class));
        }
    }

    private List<EventDto> getParseHolidayXMLResult(String apiResult){
        List<EventDto> resultList = new ArrayList<EventDto>();
        DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder;
        try{
            builder = builderFactory.newDocumentBuilder();
            InputSource inputSource = new InputSource();
            inputSource.setCharacterStream(new StringReader(apiResult));
            Document domParsed = builder.parse(inputSource);
            NodeList itemList = domParsed.getElementsByTagName("item");

            for(int i = 0; i < itemList.getLength(); i++){
                Element element = (Element) itemList.item(i);
                //Element dateKind = (Element)element.getElementsByTagName("dateKind").item(0);
                Element dateName = (Element) element.getElementsByTagName("dateName").item(0);
                Element isHoliday = (Element) element.getElementsByTagName("isHoliday").item(0);
                Element locdate = (Element) element.getElementsByTagName("locdate").item(0);
                //Element seq = (Element) element.getElementsByTagName("seq").item(0);

                EventDto holiday = new EventDto();
                holiday.setTitle(Common.getElementValue(dateName));
                holiday.setEvent_description("대한민국 공휴일");
                holiday.setEvent_type(2);
                String dateHoliday = Common.getElementValue(locdate);
                holiday.setDate_event(dateHoliday.substring(0,4)+"-"+dateHoliday.substring(4,6)+"-"+dateHoliday.substring(6));
                holiday.setDate_event_end(holiday.getDate_event());
                holiday.setEvent_state(Common.getElementValue(isHoliday).toLowerCase().equals("false") ? 0 : 1);
//                holiday.put("DAY_CD", String.valueOf(dayNum));
//                holiday.put("DAY_NM", day);
//                holiday.put("D_REG_DT", LocalDate.now().format(formatter));
//                holiday.put("D_UPDATE_DT", LocalDate.now().format(formatter));
//                holiday.put("BIGO", holiday.get("dateName").toString());
//                holiday.put("V_TIME", holiday.get("locdate").toString());
                resultList.add(holiday);
            }
        }catch (ParserConfigurationException | SAXException | IOException e){
            e.printStackTrace();
        }
        return resultList;
    }
}
