package com.hobook.tomo.controller;

import com.hobook.tomo.dto.AccountDto;
import com.hobook.tomo.service.AccountService;
import com.hobook.tomo.service.FileService;
import lombok.AllArgsConstructor;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;
import java.util.Iterator;

@RestController
public class FileController {
    private final FileService fileservice;


    @Autowired
    public FileController(FileService fileService){
        this.fileservice = fileService;
    }

    @RequestMapping(value="/uploadProfileImageFile", method = RequestMethod.POST)
    public @ResponseBody void uploadProfileImageFile(@RequestBody MultipartFile file, Principal principal) throws IOException{
        String newFileName = "profileImage_" + principal.getName().substring(0,principal.getName().indexOf(".")) + file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
        fileservice.saveFile(file,newFileName);
    }
}
