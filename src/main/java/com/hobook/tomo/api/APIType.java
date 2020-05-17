package com.hobook.tomo.api;

public enum APIType {
    HOLIDAYS_AND_24DIVISIONS(1){
        @Override
        public String getAPIUrl(){
            return "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService";
        }
        @Override
        public String getAPIKey(){
            return "%2B%2FCRPvy%2FbRJTp%2FAc2fiOz7Haj9F36nRX5tKmvtlIguMbM4%2F1JfA0zWfuaoO2Vbo3szb8tnre3VpMx7xzx2WufA%3D%3D";
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
