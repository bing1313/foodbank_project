package edu.upenn.cis350.foodapp;

import androidx.appcompat.app.AppCompatActivity;
import edu.upenn.cis350.foodapp.User;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import java.net.URL;

public class LoginActivity extends AppCompatActivity {
    private  User logInUser = null;;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        Button loginAuth = (Button) findViewById(R.id.login_auth);
        loginAuth.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                EditText user = (EditText) findViewById(R.id.username);
                EditText pass = (EditText) findViewById(R.id.password);
                String username = user.getText().toString();
                String password = pass.getText().toString();
                if(username.isEmpty() == false && password.isEmpty() == false) {
                    boolean isAuthorized = authorize(username, password);
                    if(isAuthorized) {
                        Intent intent = new Intent(getApplicationContext(), HomeActivity.class);
                        intent.putExtra("user", logInUser);
                        startActivity(intent);

                    } else {
                        Log.v("LoginActivity.java" , "login");
                        Toast.makeText(getApplicationContext(), "Incorrect password or username, Please try again!", Toast.LENGTH_LONG).show();
                        user.setText("");
                        pass.setText("");
                    }
                }
                else {
                    Toast.makeText(getApplicationContext(), "error", Toast.LENGTH_LONG).show();
                    user.setText("");
                    pass.setText("");
                }
            }
        });
    }
    public boolean authorize(String username, String password) {
        try {
            URL url = new URL("http://10.0.2.2:3000/loginmobile?username="+username+"&password="+password);
            AccessWebTask task = new AccessWebTask();
            task.execute(url);
            logInUser = task.get();
            if(logInUser.getUsername().isEmpty()) {
                return false;
            }
            else {
                return true;
            }
        } catch (Exception e){
        }
        return false;
    }
}