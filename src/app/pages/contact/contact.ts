import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../services/contact';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  
  isSubmitting = signal(false);

  contactForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    asunto: ['', [Validators.required, Validators.minLength(5)]],
    mensaje: ['', [Validators.required, Validators.minLength(20)]]
  });

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);
      
      this.contactService.submitForm(this.contactForm.value).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          this.contactForm.reset();
          this.isSubmitting.set(false);
          alert('¡Mensaje enviado y guardado con éxito!');
        },
        error: (err) => {
          console.error('Error al enviar el formulario', err);
          this.isSubmitting.set(false);
          alert('Hubo un error al guardar el formulario.');
        }
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
