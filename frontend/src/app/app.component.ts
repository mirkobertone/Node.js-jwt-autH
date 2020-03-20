import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "./_model/user";
import { AuthorizationService } from "./_service/authorization.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "frontend";
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthorizationService
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }

  verify() {
    console.log("verify clicked");
    this.authenticationService
      .verify()
      .pipe(first())
      .subscribe(
        res => console.log("HTTP response", res),
        err => console.log("HTTP Error", err),
        () => console.log("HTTP request completed.")
      );
  }
}
