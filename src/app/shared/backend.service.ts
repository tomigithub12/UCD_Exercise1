import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Kindergarden } from './interfaces/Kindergarden';
import { StoreService } from './store.service';
import { Child, ChildResponse } from './interfaces/Child';
import { CHILDREN_PER_PAGE } from './constants';
import { Observable } from 'rxjs';
import { from, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient, private storeService: StoreService, private snackBar: MatSnackBar) { }

  isFilter: boolean = false;
  filterKindergardenId: number = 0;

  public getKindergardens() {
    this.http.get<Kindergarden[]>('http://localhost:5000/kindergardens').subscribe(data => {
      this.storeService.kindergardens = data;
    });
  }

  public getKindergarden(id: number) {
    this.http.get<Kindergarden[]>('http://localhost:5000/kindergardens/${id}').subscribe(data => {
      console.log(data[0]);
      this.storeService.kindergarden = data;
    });
  }

  public getChildren(page: number) {

    if(this.isFilter){
      this.http.get<ChildResponse[]>(`http://localhost:5000/childs?_expand=kindergarden&_page=${page}&_limit=${CHILDREN_PER_PAGE}&kindergardenId=${this.filterKindergardenId}`, { observe: 'response' }).subscribe(children => {
        let totalItems = Number(children.headers.get('X-Total-Count'));
        let totalPages = Math.ceil(totalItems / CHILDREN_PER_PAGE);

        // falls currentpage größer als available kindergarten zahl
        if (page > totalPages) {
          this.getChildren(totalPages); 
          return;
        }

        this.storeService.children = children.body!;
        this.storeService.childrenTotalCount = Number(children.headers.get('X-Total-Count'));
      });
    } else {
      this.http.get<ChildResponse[]>(`http://localhost:5000/childs?_expand=kindergarden&_page=${page}&_limit=${CHILDREN_PER_PAGE}`, { observe: 'response' }).subscribe(data => {
      this.storeService.children = data.body!;
      this.storeService.childrenTotalCount = Number(data.headers.get('X-Total-Count'));
    });
    }
    }

    public getChildrenInitial(page: number): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        if (this.isFilter) {
          this.http.get<ChildResponse[]>(`http://localhost:5000/childs?_expand=kindergarden&_page=${page}&_limit=${CHILDREN_PER_PAGE}&kindergardenId=${this.filterKindergardenId}`, { observe: 'response' })
            .subscribe(
              children => {
                let totalItems = Number(children.headers.get('X-Total-Count'));
                let totalPages = Math.ceil(totalItems / CHILDREN_PER_PAGE);
    
                if (page > totalPages) {
                  this.getChildrenInitial(totalPages).then(() => resolve());
                  return;
                }
    
                this.storeService.children = children.body!;
                this.storeService.childrenTotalCount = Number(children.headers.get('X-Total-Count'));
                resolve(); 
              },
              error => {
                reject(error); 
              }
            );
        } else {
          this.http.get<ChildResponse[]>(`http://localhost:5000/childs?_expand=kindergarden&_page=${page}&_limit=${CHILDREN_PER_PAGE}`, { observe: 'response' })
            .subscribe(
              data => {
                this.storeService.children = data.body!;
                this.storeService.childrenTotalCount = Number(data.headers.get('X-Total-Count'));
                resolve(); 
              },
              error => {
                reject(error);
              }
            );
        }
      });
    }


 /*    public addChildData(child: Child, page:  number) {
      this.http.post('http://localhost:5000/childs', child).subscribe(_ => {
        this.getChildren(page);
      })
    } */

    public addChildData(child: Child, page: number): Observable<void> {
      let currentDate = new Date();
      let formattedDate = currentDate.toISOString().split('T')[0];
      child.entryDate = formattedDate;
      return from(this.http.post('http://localhost:5000/childs', child)).pipe(
        switchMap(async () => this.getChildren(page)),
        catchError((error) => {
          console.error('Error during registration:', error);
          return throwError(error); 
        })
      );
    }
    

    // public deleteChildData(childId: string, page: number) {
    //   this.http.delete(`http://localhost:5000/childs/${childId}`).subscribe(_=> {
    //     this.getChildren(page);
    //   })
    // }

    public deleteChildData(childId: string, page: number): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        this.http.delete(`http://localhost:5000/childs/${childId}`).subscribe(
          _ => {
            this.getChildrenInitial(page)
              .then(() => {
                this.showDeletionCompletedSnackBar();
                resolve(); 
              })
              .catch(error => reject(error)); 
          },
          error => {
            reject(error); 
          }
        );
      });
    }

    private showDeletionCompletedSnackBar(): void {
      this.snackBar.open('Deletion Completed', 'Close', {
        duration: 3000, // Dauer in ms
        panelClass: ['mat-snack-bar-success'],
      });
    }

    public filterByKindergarden(kindergarden: number, page: number){
      this.isFilter = true;
      this.filterKindergardenId = kindergarden;
      this.getChildren(page);
    }

    public resetFilter(page: number){
      this.isFilter = false;
      this.filterKindergardenId = 0;
      this.getChildren(page);
    }
  }
