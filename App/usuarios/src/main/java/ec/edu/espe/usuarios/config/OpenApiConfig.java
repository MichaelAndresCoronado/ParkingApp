package ec.edu.espe.usuarios.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI usuariosMicroserviceOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("API Microservicio de Usuarios")
                        .description("Documentación de los endpoints para la gestión de Personas, Roles y Usuarios en el ecosistema.")
                        .version("v1.0.0")
                        .contact(new Contact().name("Equipo de Desarrollo")));
    }
}