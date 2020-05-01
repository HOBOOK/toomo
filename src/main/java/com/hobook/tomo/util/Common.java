package com.hobook.tomo.util;

import org.w3c.dom.*;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.io.StringReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Common {
    public static void print(String...log){
        System.out.println("############ [Log 시작] ###########");
        for(String s : log){
            System.out.println(s);
        }
        System.out.println("############ [Log 종료] ###########");
    }
    public static String getRamdomPassword(int len) {
        char[] charSet = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' }; int idx = 0;
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < len; i++) {
            idx = (int) (charSet.length * Math.random()); // 36 * 생성된 난수를 Int로 추출 (소숫점제거)
        }
        return sb.toString();
    }

    public static String getElementValue(Element e) {
        Node child = e.getFirstChild();
        if(child instanceof CharacterData) {
            CharacterData data = (CharacterData) child;
            return data.getData();
        }
        return "-";
    }
}
