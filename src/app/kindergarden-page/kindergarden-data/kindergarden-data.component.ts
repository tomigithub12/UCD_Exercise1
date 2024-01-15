import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Kindergarden } from 'src/app/shared/interfaces/Kindergarden';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-kindergarden',
  templateUrl: './kindergarden-data.component.html',
  styleUrls: ['./kindergarden-data.component.scss'],
})
export class KindergardenComponent implements OnInit {
  kindergardens: Kindergarden[] = [];
  kindergarden?: Kindergarden;

  pictureUrls: string = "";
  randomNumber: number = 1;
  public imagepath: string = "";
  private id: number = 0;

  constructor(public storeService: StoreService, private backendService: BackendService, private route: ActivatedRoute) {}

  ngOnInit() {
    // id von url
    this.route.params.subscribe(params => {
      this.id = +params['id']; 
    });
      this.loadKindergarden(this.id);
      this.imagepath = this.getRandomPicture();
  }

  loadKindergarden(kindergardenId: number) {
    this.kindergardens = this.storeService.kindergarden;
    for (let i = 0; i < this.kindergardens.length; i++) {
      if (this.kindergardens[i].id === kindergardenId) {
        this.kindergarden = this.kindergardens[i];
        break; 
      }
  }
}

  getRandomPicture(): string {
    let randomIndex = Math.floor(Math.random() * 5) + 1;
    // return this.randomNumber[randomIndex];
    return './../assets/images/display/bild'+ randomIndex +'.jpg';
  }
}
