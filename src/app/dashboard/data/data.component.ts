import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { BackendService } from 'src/app/shared/backend.service';
import { CHILDREN_PER_PAGE } from 'src/app/shared/constants';
import { StoreService } from 'src/app/shared/store.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChildResponse } from 'src/app/shared/interfaces/Child';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/shared/spinner/spinner.component';
import { SharedService } from 'src/app/shared/SharedService';



@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})

export class DataComponent implements OnInit {


  constructor(public storeService: StoreService, private backendService: BackendService, private router: Router, private sharedService: SharedService) {}
  @Input() currentPage!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  public page: number = 0;
  public sortDirection: string = 'asc';
  public sortColumn: string = 'name';
  showSpinner = false;
  deletionCompleted = false;

  @ViewChild(MatSort) sort: MatSort = new MatSort;
  datasource = new MatTableDataSource<ChildResponse>(this.storeService.children);

  ngOnInit(): void {
    this.showSpinner = true;
    this.backendService.getChildrenInitial(this.currentPage)
      .then(() => {
        // happy case
        this.showSpinner = false;
      })
      .catch(error => {
        console.error(error);
        this.showSpinner = false;
      });
  }


  sortData(column: string): void{
    if (this.sortColumn === column) {
      // bei click richtung ändern
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // neue column -> asc as default
      this.sortDirection = 'asc';
      this.sortColumn = column;
    }

     let myList: ChildResponse[] = [...this.storeService.children];
 
    myList.sort((a, b) => {
      let valueA, valueB;

      if (column === 'kindergarden') {
        valueA = a.kindergarden.name;
        valueB = b.kindergarden.name;
      } else {
        valueA = a[column];
        valueB = b[column];
      }
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });
  
    this.storeService.children = myList;
  }
  
  getAge(birthDate: string) {
    var today = new Date();
    var birthDateTimestamp = new Date(birthDate);
    var age = today.getFullYear() - birthDateTimestamp.getFullYear();
    var m = today.getMonth() - birthDateTimestamp.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateTimestamp.getDate())) {
        age--;
    }
    return age;
  }

  selectPage(i: any) {
    let currentPage = i;
    this.selectPageEvent.emit(currentPage)
    this.backendService.getChildren(currentPage);
  }

  public returnAllPages() {
    return Math.ceil(this.storeService.childrenTotalCount / CHILDREN_PER_PAGE)
  }

  // public async cancelRegistration(childId: string) {
  //    this.showSpinner = true;
  //    this.backendService.deleteChildData(childId, this.currentPage);
     
  //   while(!this.getDeletionCompleted){
  //     await new Promise(resolve => setTimeout(resolve, 1000));
  //   }
  //   this.showSpinner = false;
  // }

  public async cancelRegistration(childId: string) {
    this.showSpinner = true;
  
    try {
      await this.backendService.deleteChildData(childId, this.currentPage);
      this.showSpinner = false;
    } catch (error) {
      console.error(error);
      this.showSpinner = false;
    }
  }

  navigateToPage(targetPage: number) {
    if (targetPage >= 1 && targetPage <= this.returnAllPages()) {
      this.selectPageEvent.emit(targetPage);
      this.backendService.getChildren(targetPage);
    }
  }

   openKindergardenDetails(kindergardenId: number) {
     this.storeService.kindergarden = [...this.storeService.kindergardens];
     this.router.navigate(['/kindergarden', kindergardenId]);
   }

}



