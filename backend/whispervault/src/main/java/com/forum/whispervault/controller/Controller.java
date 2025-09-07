package com.forum.whispervault.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "https://soumya280.github.io")
public class Controller {

    @GetMapping("/home")
    public String homePage() {
        return "Whisper Vault";
    }

}
