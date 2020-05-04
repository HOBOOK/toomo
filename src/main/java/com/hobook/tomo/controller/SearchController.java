package com.hobook.tomo.controller;

import com.hobook.tomo.dto.EventDto;
import com.hobook.tomo.dto.MemoDto;
import com.hobook.tomo.model.SearchItem;
import com.hobook.tomo.service.EventService;
import com.hobook.tomo.service.MemoService;
import com.hobook.tomo.util.Common;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Controller
@AllArgsConstructor
public class SearchController {
    private MemoService memoService;
    private EventService eventService;

    @RequestMapping(value="/search", method = RequestMethod.GET)
    public String goSearch(@RequestParam(value = "keyword", required = false) String keyword, Model model, Principal principal){
        List<SearchItem> searchResults = new ArrayList<>();
        try{
            List<MemoDto> memoDtoList = memoService.getMemoList(principal.getName());
            List<EventDto> eventDtoList = eventService.getEventList(principal.getName());
            for(MemoDto memo : memoDtoList){
                if(memo.getContext().contains(keyword)){
                    SearchItem searchItem = SearchItem.builder().type(0).id(memo.getId()).crator(memo.getCreator()).title(memo.getContext().split(" ")[0]).build();
                    searchResults.add(searchItem);
                }
            }
            for(EventDto event : eventDtoList){
                if(event.getTitle().contains(keyword) || event.getEvent_description().contains(keyword)){
                    SearchItem searchItem = SearchItem.builder().type(0).id(event.getId()).crator(event.getCreator()).title(event.getTitle()).build();
                    searchResults.add(searchItem);
                }

            }
        }catch(Exception e){
            e.printStackTrace();
        }
        model.addAttribute("search", searchResults);
        return "search";
    }
}
