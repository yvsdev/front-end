import { Component, input } from '@angular/core';
import { ExperienceItem } from '../../services/experience';

@Component({
  selector: 'app-experience-card',
  imports: [],
  templateUrl: './experience-card.html',
  styleUrl: './experience-card.css',
})
export class ExperienceCard {
  experience = input.required<ExperienceItem>();
}
