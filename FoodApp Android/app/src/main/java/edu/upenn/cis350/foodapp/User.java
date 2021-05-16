package edu.upenn.cis350.foodapp;

import java.io.Serializable;

public class User implements Serializable {
    private String username;
    private String password;
    private String name;
    private String description;
    private String contact;
    private String foodAvailability;
    private String pickupDate;
    private String pickupTime;

    public User(String username, String password, String name, String description, String contact, String foodAvailability, String pickupDate, String pickupTime) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.description = description;
        this.contact = contact;
        this.foodAvailability = foodAvailability;
        this.pickupDate = pickupDate;
        this.pickupTime = pickupTime;
    }

    public String getUsername() {
        return username;
    }

    public String getName() {
        return name;
    }

    public String getContact() {
        return contact;
    }

    public String getDescription() {
        return description;
    }

    public String getFoodAvailability() {
        return foodAvailability;
    }

    public String getpickupDate(){ return pickupDate;}

    public String getpickupTime(){return pickupTime;}
}
