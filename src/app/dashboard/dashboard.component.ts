import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/shared/store.service';
import { BackendService } from 'src/app/shared/backend.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public currentPage: number = 1;
  public showAddData = true;
  public kindergardenFilterForm!: FormGroup;

  constructor(private formbuilder: FormBuilder, public storeService: StoreService, public backendService: BackendService) {}

  ngOnInit() {
    this.kindergardenFilterForm = this.formbuilder.group({
      selectedKindergarten: ['']
    });
  }

  receiveMessage(newPageCount: number) {
    this.currentPage = newPageCount;
  }

  toggleButtonClicked(showAddData: boolean) {
    this.showAddData = showAddData;
  }

  applyFilter(){
    const selectedKindergarden = this.kindergardenFilterForm.value.selectedKindergarten;
    this.backendService.filterByKindergarden(selectedKindergarden, this.currentPage);
  }

  resetFilter(){
    this.kindergardenFilterForm.reset();
    this.backendService.resetFilter(this.currentPage);
  }

}
