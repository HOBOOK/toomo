package com.hobook.tomo.model;

public class Memo {
    private String id;
    private String content;
    private String date_create;
    private int state; //0:보여짐, 1:가려짐, 2>= 제거
    private int fix;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getDateOfCreate() {
        return date_create;
    }

    public void setDateOfCreate(String dateOfCreate) {
        this.date_create = dateOfCreate;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    public int getFix() {
        return fix;
    }

    public void setFix(int fix) {
        this.fix = fix;
    }


}
