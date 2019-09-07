import { NgModule } from '@angular/core';
import{
  MatInputModule,MatFormFieldModule,MatButtonModule,
  MatMenuModule,MatToolbarModule,MatSidenavModule,
  MatListModule,MatIconModule,MatCardModule,MatSnackBarModule,MatExpansionModule,MatPaginatorModule,MatProgressSpinnerModule
} from '@angular/material'
@NgModule({
  exports: [
    MatInputModule,MatFormFieldModule,MatButtonModule,
    MatMenuModule,MatToolbarModule,MatSidenavModule,
    MatListModule,MatIconModule,MatCardModule,MatSnackBarModule,MatExpansionModule,MatPaginatorModule,MatProgressSpinnerModule
]
})
export class MaterialModule { }
