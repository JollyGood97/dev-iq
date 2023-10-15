package com.deviq.init;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class InitJobApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(InitJobApplication.class, args);
        context.close();

    }

    @Bean(name = "restTemplateV2")
    public RestTemplate restTemplateV2() {
        return new RestTemplate();
    }

}
