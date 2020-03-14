package com.hobook.tomo.controller;

import com.fasterxml.jackson.databind.util.JSONPObject;
import com.hobook.tomo.dto.MemoDto;
import com.hobook.tomo.service.MemoService;
import lombok.AllArgsConstructor;
import net.minidev.json.JSONObject;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@AllArgsConstructor
public class MemoController {
    private MemoService memoService;

    @RequestMapping(value = "memo/list", method = RequestMethod.GET)
    public ResponseEntity<Object> getList()
    {
        List<JSONObject> entities = new ArrayList<JSONObject>();
        List<MemoDto> memoList = memoService.getMemoList();
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
    @RequestMapping(value="memo/create", method = RequestMethod.POST)
    public ResponseEntity<Void> create(@RequestBody MemoDto memoDto, final UriComponentsBuilder ucBuilder)
    {
        if(memoService.getMemoList().contains(memoDto)){
            update(memoDto,ucBuilder);
        }
        memoService.saveMemo(memoDto);
        System.out.println("------------------------------");
        System.out.println(memoDto.getContext());
        System.out.println("------------------------------");
        HttpHeaders headers = new HttpHeaders();
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }
    @PutMapping(value="memo/update")
    public ResponseEntity<Void> update(@RequestBody MemoDto memoDto, final UriComponentsBuilder ucBuilder)
    {
        HttpHeaders headers = new HttpHeaders();
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }
    @DeleteMapping(value = "memo/delete")
    public String delete(@RequestBody MemoDto memoDto){
        //memoService.saveMemo(memoDto);
        return "memo/list";
    }

}
