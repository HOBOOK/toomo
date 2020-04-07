package com.hobook.tomo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;


import javax.servlet.ServletContext;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Component
public class FileService {
    private static final String PROFILE_IMAGE_DIR = "/img/users/profile/";

    @Autowired
    ServletContext context;

    public void saveFile(MultipartFile file) throws IOException{
        String absoluteFilePath = context.getRealPath(PROFILE_IMAGE_DIR);
        System.out.println(absoluteFilePath);
        File dir = new File(absoluteFilePath);
        if(!dir.exists()){
            dir.mkdir();
        }
        FileOutputStream fos = new FileOutputStream(absoluteFilePath);
        fos.write(file.getBytes());
        fos.close();
    }
}
