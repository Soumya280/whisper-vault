package com.forum.whispervault.dto;

import lombok.Data;

@Data
public class EditMessage {

    private Integer messageId;
    private String title;
    private String content;

}
