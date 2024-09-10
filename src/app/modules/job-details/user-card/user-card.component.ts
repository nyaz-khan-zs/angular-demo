import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent {
  @Input() user!: User;
  @Input() jobId!: string | null;

  getFirstLetterColor(name: string): string {
    const colors = ['#FF5733', '#33FF57', '#5733FF', '#FF3357'];
    return colors[name.charCodeAt(0) % colors.length];
  }
}
