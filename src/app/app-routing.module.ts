import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./routes/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'questions',
    loadChildren: () =>
      import('./routes/questions/questions.module').then(
        (m) => m.QuestionsModule
      ),
  },
  {
    path: '',
    redirectTo: '/questions',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/questions',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
