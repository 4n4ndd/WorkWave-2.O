package com.workwave.util;

import org.springframework.stereotype.Component;
import java.security.SecureRandom;

@Component
public class OTPUtil {

    private final SecureRandom random = new SecureRandom();

    public String generateOTP() {
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
