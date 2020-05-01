package com.hobook.tomo.api;

public enum APIType {
    HOLIDAYS_AND_24DIVISIONS(1){
        @Override
        public String getAPIUrl(){
            return "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService";
        }
        @Override
        public String getAPIKey(){
            return "iJ6bXLuKFMtVG4Yssi1aEhxbdAG7JFhx64z2aHTAGB2d+TBJLaTRYn/o+F2oYcvbyeRb8vvEdZ83Ngn3TwA8Qw==";
        }
    };

    private int apiId;
    private final String API_KEY = "";
    public abstract String getAPIUrl();
    public abstract String getAPIKey();

    APIType(int apiId){
        this.apiId = apiId;
    }
}
