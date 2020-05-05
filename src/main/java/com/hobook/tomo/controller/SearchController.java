package com.hobook.tomo.controller;

import com.hobook.tomo.dto.EventDto;
import com.hobook.tomo.dto.MemoDto;
import com.hobook.tomo.model.SearchItem;
import com.hobook.tomo.service.EventService;
import com.hobook.tomo.service.MemoService;
import com.hobook.tomo.util.Common;
import lombok.AllArgsConstructor;
import net.minidev.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Controller
@AllArgsConstructor
public class SearchController {
    private MemoService memoService;
    private EventService eventService;
    private List<SearchItem> totalSearchList;
    private List<SearchItem> searchResults;

    @RequestMapping(value="/search", method = RequestMethod.GET)
    public String goSearch(@RequestParam(value = "keyword", required = false) String keyword){
        try{
            searchResults.clear();
            if(StringUtils.hasText(keyword)){
                for(SearchItem item : totalSearchList){
                    if(isSearchMatach(keyword,item.getFinder())){
                        searchResults.add(item);
                    }
                }
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        return "search";
    }

    @RequestMapping(value="/search/result", method = RequestMethod.GET)
    public ResponseEntity<Object> getSearch()
    {
        List<JSONObject> entities = new ArrayList<JSONObject>();
        if(searchResults!=null){
            for(SearchItem item : searchResults){
                JSONObject entity = new JSONObject();
                entity.put("id", item.getId());
                entity.put("type",item.getType());
                entity.put("title",item.getTitle());
                entity.put("creator",item.getCreator());
                entities.add(entity);
            }
        }else{
            Common.print("searchItem null");
        }
        return new ResponseEntity<Object>(entities, HttpStatus.OK);
    }



    @RequestMapping(value="/searchedtext", produces = {"application/xml", "application/json"})
    @ResponseStatus(HttpStatus.OK)
    public @ResponseBody List<SearchItem> searchedText(String keyword, Principal principal){
        if(keyword.length()==0 || totalSearchList.size()==0){
            buildSearchingItem(principal.getName());
        }

        searchResults.clear();
        if(StringUtils.hasText(keyword)){
            for(SearchItem item : totalSearchList){
                if(isSearchMatach(keyword,item.getFinder())){
                    searchResults.add(item);
                }
            }
        }
        return searchResults;
    }

    private void buildSearchingItem(String email){
        totalSearchList.clear();
        List<MemoDto> memoDtoList = memoService.getMemoList(email);
        List<EventDto> eventDtoList = eventService.getEventList(email);

        for(MemoDto memo : memoDtoList){
            if(memo.getState()==0){
                String title = Common.getRemovedHtmlTag(memo.getContext()).split("\n")[0].length()>20 ? Common.getRemovedHtmlTag(memo.getContext()).split("\n")[0].substring(0,20)+"..." : Common.getRemovedHtmlTag(memo.getContext()).split("\n")[0];
                SearchItem searchItem = SearchItem.builder().type(0).id(memo.getId()).crator(memo.getCreator()).title(title).finder(Common.getRemovedHtmlTag(memo.getContext())).build();
                totalSearchList.add(searchItem);
            }
        }
        for(EventDto event : eventDtoList){
            SearchItem searchItem = SearchItem.builder().type(0).id(event.getId()).crator(event.getCreator()).title(event.getTitle()).finder(event.getTitle()+event.getEvent_description()).build();
            totalSearchList.add(searchItem);
        }

    }

    private boolean isSearchMatach(String keyword, String target){
        String[] keywords = keyword.toLowerCase().split(" ");
        for(String key : keywords){
            if(StringUtils.hasText(key) && target.toLowerCase().replaceAll(" ","").contains(key))
                return true;
        }
        return false;
    }
}
