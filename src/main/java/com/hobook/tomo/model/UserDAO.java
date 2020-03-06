package com.hobook.tomo.model;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class UserDAO {
    private ConnectionManager connectionManager;
    public UserDAO(ConnectionManager connManager){
        connectionManager = connManager;
    }
    public void add(User user) throws Exception{
        Connection conn = connectionManager.getConnection();
        PreparedStatement psmt = conn.prepareStatement("INSERT INTO users");
        psmt.setString(1, user.getId());
        psmt.setString(2, user.getName());
        psmt.setString(3, user.getEmail());
        psmt.setString(4, user.getPassword());
        psmt.setString(5, user.getProfileImageUrl());
        psmt.setString(6, user.getDateOfLastLogin());
        psmt.setString(7, user.getDateOfSign());
        psmt.executeUpdate();
        psmt.close();
        conn.close();
    }
    public User get(String id) throws Exception{
        Connection conn = connectionManager.getConnection();
        PreparedStatement psmt = conn.prepareStatement("SELECT * FROM users WHERE id=?");
        psmt.setString(1, id);

        ResultSet rs = psmt.executeQuery();
        rs.next();

        User user = new User();
        user.setId(rs.getString("id"));
        user.setId(rs.getString("name"));
        user.setId(rs.getString("email"));
        user.setId(rs.getString("profileImageUrl"));
        user.setId(rs.getString("dateOfLastLogin"));

        rs.close();
        psmt.close();
        conn.close();

        return user;
    }
}
