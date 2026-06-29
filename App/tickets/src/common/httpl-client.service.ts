import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HttpClientService {
  private readonly logger = new Logger(HttpClientService.name);

  // Añadimos el parámetro opcional 'headers'
  async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers, // Inyectamos las cabeceras aquí
    });
    if (!response.ok) {
      this.logger.error(`GET ${url} failed: ${response.statusText}`);
      throw new Error(`Error fetching ${url}: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  }

  async post<T>(url: string, body: any, headers?: Record<string, string>): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...headers // Combinamos el JSON con el Token
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      this.logger.error(`POST ${url} failed: ${response.statusText}`);
      throw new Error(`Error posting to ${url}: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  }

  async patch<T>(url: string, body: any, headers?: Record<string, string>): Promise<T> {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...headers 
      },
      body: JSON.stringify(body),
    });
    
    // SI HAY UN ERROR.
    if (!response.ok) {
      const errorDeJava = await response.text(); 
      this.logger.error(`PATCH ${url} falló con código ${response.status}. Respuesta de Java: ${errorDeJava}`);
      throw new Error(`Error ${response.status}: ${errorDeJava}`);
    }
    
    return response.json() as Promise<T>;
  }
}