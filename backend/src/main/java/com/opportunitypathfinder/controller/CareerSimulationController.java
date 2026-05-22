package com.opportunitypathfinder.controller;

import com.opportunitypathfinder.service.CareerSimulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/career")
@RequiredArgsConstructor
public class CareerSimulationController {

    private final CareerSimulationService simulationService;

    @GetMapping("/simulate")
    public ResponseEntity<?> simulate(@RequestParam(required = false) String role) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(simulationService.simulate(email, role));
    }
}
