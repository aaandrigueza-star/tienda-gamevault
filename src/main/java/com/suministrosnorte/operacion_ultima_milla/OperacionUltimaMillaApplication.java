package com.suministrosnorte.operacion_ultima_milla;

// Punto de entrada: inicia Spring Boot y registra entidades, controladores y repositorios.

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.suministrosnorte")
@EntityScan("com.suministrosnorte.model")
@EnableJpaRepositories("com.suministrosnorte.repository")
public class OperacionUltimaMillaApplication {

	public static void main(String[] args) {
		SpringApplication.run(OperacionUltimaMillaApplication.class, args);
	}

}
