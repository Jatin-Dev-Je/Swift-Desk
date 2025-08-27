package com.ticketing.dto;

import lombok.Data;
import java.util.Set;

@Data
public class UpdateUserRolesRequest {
    private Set<String> roles;
}
