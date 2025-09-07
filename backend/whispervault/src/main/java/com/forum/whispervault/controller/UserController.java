package com.forum.whispervault.controller;

import org.springframework.web.bind.annotation.RestController;

import com.forum.whispervault.dto.UserLogin;
import com.forum.whispervault.dto.UserUpdate;
import com.forum.whispervault.entity.User;
import com.forum.whispervault.repository.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "https://soumya280.github.io/whisper-vault/")
public class UserController {

    @Autowired
    private UserRepository repository;

    @PostMapping("/login")
    public ResponseEntity<?> login(HttpServletRequest request, @RequestBody UserLogin loginData) {

        User user = repository.findByEmailAndPassword(loginData.getEmail(), loginData.getPassword());

        if (user != null) {
            HttpSession session = request.getSession(false);

            if (session != null)
                session.invalidate();

            session = request.getSession(true);

            session.setAttribute("userId", user.getId());
            return ResponseEntity.ok(Map.of("login", "success"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("login", "failure"));
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();

            Cookie cookie = new Cookie("JSESSIONID", null);
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(0);
            response.addCookie(cookie);

            return ResponseEntity.ok(Map.of("logout", "success"));
        }

        return ResponseEntity.ok(Map.of("logout", "already logged out"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {

        if (repository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Map.of("signup", "already exists"));
        }
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            user.setUsername(user.getEmail());
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("signup", "password can't be blank"));
        }

        try {
            repository.save(user);
            return ResponseEntity.ok(Map.of("signup", "user added"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("signup", e.getMessage()));
        }

    }

    @GetMapping("/userdata")
    public ResponseEntity<?> userData(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not logged in"));
        }

        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid session"));
        }

        User user = repository.findById(userId)
                .orElse(null);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "user not found"));
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(HttpServletRequest request, @RequestBody UserUpdate userUpdate) {

        HttpSession session = request.getSession(false);

        if (session != null) {
            Integer id = (Integer) session.getAttribute("userId");
            if (id != null) {
                User user = repository.findById(id).orElse(null);
                if (user != null) {
                    user.setEmail(userUpdate.getEmail());
                    user.setUsername(userUpdate.getUsername());

                    repository.save(user);
                    // session.invalidate();
                    return ResponseEntity.ok(Map.of("update", "user updated"));

                }
            }
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("update", "session or user not fount"));
    }

}
