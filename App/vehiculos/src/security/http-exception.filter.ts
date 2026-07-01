import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let mensaje = exception.message;
    let errorStr = 'Error';

    // Personalizamos el mensaje si es un error de seguridad (403)
    if (status === HttpStatus.FORBIDDEN) {
      mensaje = 'No tienes los permisos o roles necesarios para realizar esta acción.';
      errorStr = 'Forbidden';
    } 
    // Personalizamos el mensaje si el token no sirve o no existe (401)
    else if (status === HttpStatus.UNAUTHORIZED) {
      mensaje = 'Token inválido o expirado.';
      errorStr = 'Unauthorized';
    } 
    // Para otros errores (como el 400 Bad Request), extraemos el mensaje original
    else {
      const exceptionResponse: any = exception.getResponse();
      errorStr = exceptionResponse.error || 'Error';
      mensaje = exceptionResponse.message || exception.message;
    }

    // Devolvemos el JSON exactamente con la misma estructura de Spring Boot
    response.status(status).json({
      fecha: new Date().toISOString(),
      estado: status,
      error: errorStr,
      mensaje: mensaje,
    });
  }
}