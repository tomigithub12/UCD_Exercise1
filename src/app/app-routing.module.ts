import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './about-page/about-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KindergardenComponent } from './kindergarden-page/kindergarden-data/kindergarden-data.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'kindergarden/:id', component: KindergardenComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
