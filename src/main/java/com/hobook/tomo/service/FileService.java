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
    private static final String PROFILE_IMAGE_DIR = "/upload/profile/";

    @Autowired
    ServletContext context;

    public void saveFile(MultipartFile file, String filename) throws IOException{
        File parentDirectory = new File(PROFILE_IMAGE_DIR);
        if(!parentDirectory.exists()){
            parentDirectory.mkdirs();
        }
        Files.copy(file.getInputStream(), Paths.get(PROFILE_IMAGE_DIR+filename), StandardCopyOption.REPLACE_EXISTING);
    }
}
