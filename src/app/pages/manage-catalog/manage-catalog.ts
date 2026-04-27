import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExperienceService, ExperienceItem } from '../../services/experience';

@Component({
  selector: 'app-manage-catalog',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-catalog.html',
})
export class ManageCatalog implements OnInit {
  private experienceService = inject(ExperienceService);
  private fb = inject(FormBuilder);

  experiences = signal<ExperienceItem[]>([]);
  isLoading = signal<boolean>(true);
  
  isEditing = signal<boolean>(false);
  editingId = signal<number | null>(null);
  showForm = signal<boolean>(false);

  form: FormGroup = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    categoria: ['', Validators.required],
    horas: [0, [Validators.required, Validators.min(0)]],
    costo: [0, [Validators.required, Validators.min(0)]],
    ranking: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    resenas: [0, [Validators.required, Validators.min(0)]],
    imagen: ['', Validators.required]
  });

  ngOnInit() {
    this.loadExperiences();
  }

  loadExperiences() {
    this.isLoading.set(true);
    this.experienceService.getExperiences().subscribe({
      next: (data) => {
        this.experiences.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading experiences', err);
        this.isLoading.set(false);
      }
    });
  }

  openNewForm() {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.form.reset({
      horas: 0,
      costo: 0,
      ranking: 0,
      resenas: 0
    });
    this.showForm.set(true);
  }

  editExperience(item: ExperienceItem) {
    this.isEditing.set(true);
    this.editingId.set(item.id);
    this.form.patchValue({
      titulo: item.titulo,
      descripcion: item.descripcion,
      categoria: item.categoria,
      horas: item.horas,
      costo: item.costo,
      ranking: item.ranking,
      resenas: item.resenas,
      imagen: item.imagen
    });
    this.showForm.set(true);
  }

  deleteExperience(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta experiencia?')) {
      this.experienceService.deleteExperience(id).subscribe({
        next: () => {
          this.loadExperiences();
        },
        error: (err) => console.error('Error deleting', err)
      });
    }
  }

  cancelForm() {
    this.showForm.set(false);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const request$ = this.isEditing() 
      ? this.experienceService.updateExperience(this.editingId()!, val)
      : this.experienceService.createExperience(val);

    request$.subscribe({
      next: () => {
        this.showForm.set(false);
        this.loadExperiences();
      },
      error: (err) => console.error('Error saving', err)
    });
  }
}
