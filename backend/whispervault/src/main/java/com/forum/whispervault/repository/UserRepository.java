package com.forum.whispervault.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.forum.whispervault.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findByEmailAndPassword(String email, String password);

    User findByEmail(String email);

}
