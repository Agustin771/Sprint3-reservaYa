package com.reservaYa.RYV1.dto;

import java.math.BigDecimal;

public record FavoritoDTO(
        Long id,
        String name,
        String category,
        String location,
        BigDecimal price,
        String image,
        String description
) {}
