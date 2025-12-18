import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@authservices/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.html',
})
export class RegisterPage { 
  fb = inject(FormBuilder);
  hasError = signal(false);
  authService = inject(AuthService);
  router = inject(Router);
  
  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]]
  })

  onSubmit(){
    console.log(this.registerForm.value);
    if( this.registerForm.invalid ){
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false)
      }, 2000)
      return
    }

    const { name = '', email = '', password = '' } = this.registerForm.value;

    this.authService.register( name!, email!, password! ).subscribe((resp) => {
      if( resp ){
        this.router.navigateByUrl('/');
        return
      }
      this.hasError.set(true)
      setTimeout(() => {
        this.hasError.set(false)
      }, 2000)
    })
  }
}
