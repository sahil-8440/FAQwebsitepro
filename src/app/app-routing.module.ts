import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { LoginComponent } from './login/login.component';



const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'login'},
  {path: 'faq' , component: FaqComponent},
  {path: 'login' , component: LoginComponent},
  {path: '**', component: LoginComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
