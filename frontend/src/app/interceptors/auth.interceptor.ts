
import { HttpInterceptorFn } from '@angular/common/http';

/**
 * HTTP interceptor responsible for adding the authentication token
 * to outgoing HTTP requests when a valid token is available.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Retrieves the authentication token from local storage.
  const token = localStorage.getItem('token');
  // Adds the Bearer token to the Authorization header
  // if an authentication token is available.
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // Passes the request to the next interceptor or HTTP handler.
  return next(req);
};
