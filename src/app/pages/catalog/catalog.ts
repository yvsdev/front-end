import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExperienceCard } from '../../components/experience-card/experience-card';
import { ExperienceService } from '../../services/experience';

@Component({
  selector: 'app-catalog',
  imports: [ExperienceCard],
  templateUrl: './catalog.html',
})
export class Catalog {
  private experienceService = inject(ExperienceService);
  experiences = toSignal(this.experienceService.getExperiences());
}
