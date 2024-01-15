import { Component, OnInit } from '@angular/core';
import { StoreService } from './shared/store.service';
import { BackendService } from './shared/backend.service';
import { SpinnerService } from './shared/spinner/spinner.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'kindergardenApp';

  showSpinner = false;

  constructor(private backendService: BackendService, private spinnerService: SpinnerService) {
    
    this.spinnerService.spinner$.subscribe((data: boolean) => {
      setTimeout(() => {
        this.showSpinner = data ? data : false;
      });
      console.log(this.showSpinner);
    });
  }

  ngOnInit(): void {
    this.backendService.getKindergardens();
    }
}
