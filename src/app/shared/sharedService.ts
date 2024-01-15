import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private deletionCompleted: boolean = false;
  private tableLoaded: boolean = false;

  getDeletionCompleted(): boolean {
    return this.deletionCompleted;
  }

  setDeletionCompleted(value: boolean): void {
    this.deletionCompleted = value;
  }

  getTableLoaded(){
    return this.tableLoaded;
  }

  setTableLoaded(value: boolean): void {
    this.tableLoaded = value;
  }
}