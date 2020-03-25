package com.hobook.tomo.repository;

import com.hobook.tomo.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findEventsByCreator(String userEmail);
}
