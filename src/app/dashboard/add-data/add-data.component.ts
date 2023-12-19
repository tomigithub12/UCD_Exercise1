import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent implements OnInit{

  constructor(private formbuilder: FormBuilder, public storeService: StoreService, public backendService: BackendService, private snackBar: MatSnackBar) {
  }
  public addChildForm: any;
  @Input() currentPage!: number;

  ngOnInit(): void {
    this.addChildForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      kindergardenId: ['', Validators.required],
      birthDate: [null, Validators.required]
    })
  }
  
/* 
  onSubmit() {
    if(this.addChildForm.valid) {
      console.log(this.currentPage);
      this.backendService.addChildData(this.addChildForm.value, this.currentPage);
    }
  } */

  onSubmit() {
    if (this.addChildForm.valid) {
      const page = this.currentPage;
      this.backendService.addChildData(this.addChildForm.value, page)
        .pipe(
          catchError((error) => {
            console.error('Error during registration:', error);
            this.snackBar.open('Registration failed. Please try again.', 'OK', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: 'error-snackbar'
            });
            return throwError(error);
          }),
          finalize(() => {
            this.snackBar.open('Registration was successful', 'OK', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: 'success-snackbar'
            });
          })
        )
        .subscribe();
    }
  }

}
