import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { AuthService } from "./auth.service";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();
        // console.log('authToken',authToken);
        if(authToken){
        req = req.clone({
            setHeaders: {
                // Authorization: "Bearer " + authToken
                Authorization:  authToken
            }
        });
    }
        return next.handle(req);
    }
}