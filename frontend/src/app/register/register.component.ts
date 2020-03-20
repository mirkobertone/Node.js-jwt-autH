import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  FormControl
} from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthorizationService } from "../_service/authorization.service";
import { AlertService } from "../_service/alert.service";

@Component({ templateUrl: "register.component.html" })
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthorizationService, //  private userService: UserService
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.minLength(4)]],
      lastName: ["", [Validators.required, Validators.minLength(4)]],
      email: ["", [Validators.email, Validators.required, this.emailValidator]],
      password1: ["", [Validators.required, Validators.minLength(6)]],
      password2: ["", [Validators.required, Validators.minLength(6)]]
    });
  }
  emailValidator(): ValidatorFn {
    return (c: FormControl) => {
      let isValid = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(
        c.value
      );
      if (isValid) {
        return null;
      } else {
        return {
          emailvalidator: {
            valid: false
          }
        };
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success("Registration successful", true);
          this.router.navigate(["/login"]);
        },
        error => {
          this.alertService.error(error.error);
          this.loading = false;
        }
      );
  }
}
