package com.hobook.tomo.model;

import java.sql.Connection;
import java.sql.DriverManager;

public class ConnectionManager {
    public Connection getConnection() throws Exception{
        Class.forName("");
        Connection conn = DriverManager.getConnection("");
        return conn;
    }
}
