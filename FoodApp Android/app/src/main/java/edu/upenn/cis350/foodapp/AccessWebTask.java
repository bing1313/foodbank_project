package edu.upenn.cis350.foodapp;

import android.os.AsyncTask;
import android.util.Log;
import android.widget.Toast;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;
import java.util.Iterator;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class AccessWebTask extends AsyncTask<URL, String, User> {
    protected User doInBackground(URL... urls) {
        int i = 0;
        User loggedInUser = null;
        try {
            URL url = urls[0];
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.connect();
            int responsecode = 0;
            try {
                responsecode = conn.getResponseCode();
            } catch (IOException e) {
                e.printStackTrace();
            }
            if (responsecode != 200) {
                System.out.println("Unexpected status code: " + responsecode);
            } else {
                Scanner in = null;
                String line = null;
                try {
                    in = new Scanner(url.openStream());
                    while (in.hasNext()) {
                        line = in.nextLine();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
                JSONParser parser = new JSONParser();
                JSONArray data = null;
                Iterator iter = null;
                try {
                    data = (JSONArray) parser.parse(line);
                    iter = (Iterator)data.iterator();
                } catch (ParseException e) {

                }
                while (iter.hasNext()) {
                    JSONObject obj = (JSONObject) iter.next();
                    String name = (String)obj.get("name");
                    String usname = (String)obj.get("username");
                    String pw = (String)obj.get("password");
                    String contact = (String)obj.get("contact_info");
                    String desc = (String)obj.get("description");
                    String foodAvail = (String)obj.get("food_availability");
                    String pickupDate = (String)obj.get("pickup_date");
                    String pickupTime = (String)obj.get("pickup_time");
                    loggedInUser = new User(usname, pw, name, desc, contact, foodAvail, pickupDate, pickupTime);
                    i++;
                }
            }
        } catch (Exception e) {

        }
        if(i == 0) {
            User ret = new User("", "", "", "", "", "", "" ,"");
            return ret;
        }
        else return loggedInUser;
    }

    protected void onPostExecute(User result) {

    }
}
