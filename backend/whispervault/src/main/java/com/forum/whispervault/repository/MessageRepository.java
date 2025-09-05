package com.forum.whispervault.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.forum.whispervault.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Integer> {

    List<Message> findAllByOrderByCreatedAtDesc();
}
