import { Component } from '@angular/core';

@Component({
  selector: 'martzcodes-root',
  template: `
    <div style="text-align:center">
      <h1>Welcome to {{ title }}!</h1>
      <pre>{{ navigation | json }}</pre>
      <router-outlet></router-outlet>
    </div>
  `,

  styles: []
})
export class AppComponent {
  title = 'qwerty';
  navigation: any[];

  constructor() {
    this.navigation = [{ name: 'Asdf', router: '/asdf', unsecure: false }];
  }
}
