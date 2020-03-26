import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";
import { User } from "../_model/user";
import {
  map,
  catchError,
  toArray,
  mergeMap,
  concatMap,
  tap
} from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthorizationService {
  login_url = "http://localhost:3000/api/user/login";
  register_url = "http://localhost:3000/api/user/register";
  verify_url = "http://localhost:3000/api/user/verify";
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  login(email: string, password: string) {
    return this.http
      .post<any>(this.login_url, { email, password })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          //console.log(user);
          //const keys = user.headers.keys(); --> ERROR

          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            console.log(user);
            //debugger;
            localStorage.setItem("currentUser", JSON.stringify(user));
            this.currentUserSubject.next(user);
          }

          return user;
        })
      );
  }
  register(user: User) {
    return this.http.post(this.register_url, user);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }

  verify() {
    return this.http.get(this.verify_url, { responseType: "text" });
  }
}
