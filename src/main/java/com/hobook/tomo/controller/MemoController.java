package com.hobook.tomo.controller;

import com.hobook.tomo.dto.MemoDto;
import com.hobook.tomo.service.MemoService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@AllArgsConstructor
public class MemoController {
    private MemoService memoService;

    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public String getList()
    {
        return "memo/list";
    }
    @RequestMapping(value = "/post", method = RequestMethod.GET)
    public String write()
    {
        return "memo/write";
    }
    @PostMapping(value = "/post")
    public String write(MemoDto memoDto){
        memoService.saveMemo(memoDto);
        return "memo/list";
    }
}
