package com.hobook.tomo.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.w3c.dom.*;


@Slf4j
@Component
public class Common {
    public void print(String...text){
        System.out.println("############ [Log 시작] ###########");
        for(String s : text){
            log.info(s);
        }
        System.out.println("############ [Log 종료] ###########");
    }
    public String getRamdomPassword(int len) {
        char[] charSet = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' }; int idx = 0;
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < len; i++) {
            idx = (int) (charSet.length * Math.random()); // 36 * 생성된 난수를 Int로 추출 (소숫점제거)
        }
        return sb.toString();
    }

    public String getElementValue(Element e) {
        Node child = e.getFirstChild();
        if(child instanceof CharacterData) {
            CharacterData data = (CharacterData) child;
            return data.getData();
        }
        return "-";
    }

    public String getRemovedHtmlTag(String html){
        return html.replaceAll("<(/)?([a-zA-Z]*)(\\s[a-zA-Z]*=[^>]*)?(\\s)*(/)?>", "");
    }


    /*
    * Controller 속성 관련
    * */
    public String currentSearchingId;

    private long selectedMemoId = -1;
    public long getSelectedMemoId(){
        return selectedMemoId;
    }
    public void setSelectedMemoId(long id){
        selectedMemoId = id;
    }
}
