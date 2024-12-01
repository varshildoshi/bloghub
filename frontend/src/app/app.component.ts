import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  constructor(
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.authService.autoLogin();
    this.authService.isLoggedIn();
  }
}
