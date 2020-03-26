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
import { FnParam } from "@angular/compiler/src/output/output_ast";

@Component({ templateUrl: "register.component.html" })
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  passwordForm: FormGroup;

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
      email: ["", [Validators.email, Validators.required]]
    });

    this.passwordForm = this.formBuilder.group(
      {
        password1: ["", [Validators.required, Validators.minLength(6)]],
        password2: ["", [Validators.required, Validators.minLength(6)]]
      },
      { validator: this.checkPasswords }
    );

    /*  this.registerForm = new FormGroup({
      firstName: new FormControl("", Validators.required)
    }); */
  }

  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group

    /*   console.log("Validation");

    console.log(group.get("password1").value);
    console.log(group.get("password2").value);
    console.log(group.get("password2").errors); */

    if (group.get("password2").errors) return;

    const pass = group.get("password1").value;
    const confirmPass = group.get("password2").value;
    //return pass === confirmPass ? null : { notMatch: true };
    if (pass === confirmPass) return null;
    else group.get("password2").setErrors({ notMatch: true });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }
  get m() {
    return this.passwordForm.controls;
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
