package edu.upenn.cis350.foodapp;

import androidx.appcompat.app.AppCompatActivity;
import edu.upenn.cis350.foodapp.User;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.net.Uri;
import android.app.Activity;
import android.content.Intent;
import android.view.View;
import android.widget.Toast;

public class HomeActivity extends AppCompatActivity {
    String date = "";
    String time = "";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        User user = (User) getIntent().getSerializableExtra("user");
        TextView welcomeMessage = (TextView) findViewById(R.id.welcomemessage);
        welcomeMessage.setText("Welcome " + user.getName());
        TextView username = (TextView) findViewById(R.id.username);
        TextView contact = (TextView) findViewById(R.id.contact);
        TextView description = (TextView) findViewById(R.id.description);
        TextView food = (TextView) findViewById(R.id.food);
        TextView pickupDate = (TextView) findViewById(R.id.pickupDate);
        TextView pickupTime = (TextView) findViewById(R.id.pickupTime);

        username.setText(user.getUsername());
        contact.setText(user.getContact());
        description.setText(user.getDescription());
        food.setText(user.getFoodAvailability());
        pickupDate.setText(user.getpickupDate());
        pickupTime.setText(user.getpickupTime());
        date = user.getpickupDate();
        time = user.getpickupTime();
        Button sendbtn = (Button) findViewById(R.id.sendEmail);
        sendbtn.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view){
                sendEmail(date, time);
            }
        });
    }

    protected void sendEmail(String date, String time) {
        Intent emailIntent = new Intent(Intent.ACTION_SEND);
        emailIntent.setData(Uri.parse("mailto:"));
        emailIntent.setType("text/plain");
        emailIntent.putExtra(Intent.EXTRA_SUBJECT, "Food Schedule");
        emailIntent.putExtra(Intent.EXTRA_TEXT, "Here is the schedule: \n" + "Date: " + date + "\n" + "Time: " + time );
        try {
            startActivity(Intent.createChooser(emailIntent, "Send mail"));
            finish();
        } catch (android.content.ActivityNotFoundException ex) {
            Toast.makeText(getApplicationContext(), "There is no email client installed.", Toast.LENGTH_SHORT).show();
        }
    }
}
