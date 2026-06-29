import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Lee qué roles exige el controlador (ej: 'SUPER_ADMIN')
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Si la ruta no exige roles específicos, la deja pasar
    if (!requiredRoles) {
      return true;
    }
    
    // 2. Extrae el usuario que ya fue validado por el token JWT
    const { user } = context.switchToHttp().getRequest();
    
    // 3. Compara si los roles del usuario coinciden con los exigidos
    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}