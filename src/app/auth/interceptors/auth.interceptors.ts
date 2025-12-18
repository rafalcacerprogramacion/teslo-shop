import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@authservices/auth.service";
import { Observable, tap } from "rxjs";

export function authInterceptor(
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
) {
  
  // const authService = inject(AuthService);
  
  // const newReq = req.clone({
  //   headers: req.headers.set('Authorization', `Bearer ${authService.token()}`)
  // });
  // console.log('URL:', req.url);
  // console.log('Headers:', req.headers.keys());
  // console.log('Body:', req.body);
  // return next(newReq);
  const authService = inject(AuthService);
  const token = authService.token();

  if (!token) return next(req);

  // Clona la request y agrega el header Authorization
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(authReq);
}