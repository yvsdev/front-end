import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExperienceCard } from '../../components/experience-card/experience-card';
import { ExperienceService } from '../../services/experience';

@Component({
  selector: 'app-home',
  imports: [ExperienceCard, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private experienceService = inject(ExperienceService);
  
  // Use toSignal to convert the Observable to a Signal
  experiences = toSignal(this.experienceService.getTopExperiences());
}
