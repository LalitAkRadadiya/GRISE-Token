import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WavesModule } from 'angular-bootstrap-md';
import { ChartsModule } from 'ng2-charts';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { CountdownModule } from 'ngx-countdown';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule, routingmod } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountNoPipe } from './pipes/account-no.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AccountNoPipe,
    routingmod,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    CountdownModule,
    MatMenuModule,
    WavesModule,
    ChartsModule,
    MatButtonModule,
    Ng2PageScrollModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSelectModule,
    ToastrModule.forRoot({ positionClass: 'toast-top-center' }),
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
