package com.hobook.tomo.controller;

import com.hobook.tomo.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Iterator;

@RestController
public class FileController {
    private final FileService fileservice;

    @Autowired
    public FileController(FileService fileService){
        this.fileservice = fileService;
    }

    @RequestMapping(value="/uploadFile", method = RequestMethod.POST)
    public @ResponseBody void uploadFile(@RequestBody MultipartFile file) throws IOException{
        try{
            System.out.println("---------------");
            System.out.println(file.getOriginalFilename());
            fileservice.saveFile(file);
        }catch (NullPointerException e){
            e.printStackTrace();
        }
    }
}
