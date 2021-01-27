import { WorldwideComponent } from './worldwide/worldwide.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { CountryComponent } from './country/country.component';
import { AddEligibleUserComponent } from './add-eligible-user/add-eligible-user.component';

const routes: Routes = [
  {path: "signin", component: SigninComponent},
  {path: "", component: WorldwideComponent},
  {path: "addUserToAuthorized", component: AddEligibleUserComponent},
  //{path: "country", component: CountryComponent},
  {path: ":country", component: CountryComponent},
  {path: "", pathMatch: "full", redirectTo: ""},
  {path: "**", redirectTo: "signin"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
