package com.hobook.tomo.controller;

import com.fasterxml.jackson.databind.util.JSONPObject;
import com.hobook.tomo.dto.EventDto;
import com.hobook.tomo.dto.MemoDto;
import com.hobook.tomo.service.AccountService;
import com.hobook.tomo.service.MemoService;
import com.hobook.tomo.util.Common;
import lombok.AllArgsConstructor;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@AllArgsConstructor
public class MemoController {
    private MemoService memoService;
    @Autowired Common common;

    @RequestMapping(value = "memo/list", method = RequestMethod.GET)
    public ResponseEntity<Object> getList(Principal principal)
    {
        List<JSONObject> entities = new ArrayList<JSONObject>();
        List<MemoDto> memoList = memoService.getMemoList(principal.getName());
        for(MemoDto memo : memoList){
            JSONObject entity = new JSONObject();
            entity.put("id", memo.getId());
            entity.put("context",memo.getContext());
            entity.put("date_create",memo.getDate_create());
            entity.put("state",memo.getState());
            entity.put("fix",memo.getFix());
            entities.add(entity);
        }
        return new ResponseEntity<Object>(entities, HttpStatus.OK);
    }
    @RequestMapping(value="memo/create", method = {RequestMethod.POST,RequestMethod.PUT})
    public @ResponseBody ResponseEntity<MemoDto> create(@RequestBody MemoDto memoDto, Principal principal)
    {
        try{
            memoDto.setCreator(principal.getName());
            memoService.saveMemo(memoDto);
            return new ResponseEntity(memoDto, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity("Error", HttpStatus.BAD_REQUEST);
        }

    }

    @RequestMapping(value="memo/delete", method = {RequestMethod.PUT})
    public @ResponseBody ResponseEntity<MemoDto> delete(@RequestBody MemoDto memoDto, Principal principal){
        try{
            memoDto.setCreator(principal.getName());
            memoDto.setState(1);
            memoService.saveMemo(memoDto);
            return new ResponseEntity(memoDto, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity("Error", HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "memo/set_select", method = RequestMethod.GET)
    public String setSelect(@RequestParam Long id, Model model){
        common.setSelectedMemoId(id);
        return "redirect:/memo";
    }

    @RequestMapping(value = "memo/get_select", method = RequestMethod.GET)
    public ResponseEntity<Object> getSelect(Model model){
        JSONObject entity = new JSONObject();
        if(common.getSelectedMemoId()!=-1){
            entity.put("id", common.getSelectedMemoId());
            common.setSelectedMemoId(-1);
        }else{
            entity.put("id", null);
        }
        return new ResponseEntity<Object>(entity, HttpStatus.OK);
    }
}
