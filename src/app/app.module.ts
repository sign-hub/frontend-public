import { DocumentaryComponent } from './pages/digital-archive/documentary/documentary.component';
import { LseComponent } from './pages/assessment/lse/lse.component';
import { LscComponent } from './pages/assessment/lsc/lsc.component';
import { WelcomePage } from './pages/assessment/welcome-page/welcome-page.component';
import { LsfComponent } from './pages/assessment/lsf/lsf.component';
import { LisComponent } from './pages/assessment/lis/lis.component';
import { AssessmentComponent } from './pages/assessment/assessment.component';
import { SupportingMaterialsComponent } from './pages/supporting-materials/supporting-materials.component';
import { IntroPageComponent } from './pages/digital-archive/intro-page/intro-page.component';
import { ProjectComponent } from './pages/project/project.component';
import { BrowserModule } from '@angular/platform-browser';
import { CookieLawModule } from 'angular2-cookie-law';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SigngramComponent } from './pages/signgram/signgram.component';
import { AtlasComponent } from './pages/atlas/atlas.component';
import { DigitalArchiveComponent } from './pages/digital-archive/digital-archive.component';
import { DigitalArchiveService } from './services/digital-archive/digital-archive.service';
import { NavigationStreamingToolComponent } from './components/navigation-streaming-tool/navigation-streaming-tool.component';
import { DigitalArchiveDetailsComponent } from './pages/digital-archive/digital-archive-details/digital-archive-details.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Interceptor } from './helpers/interceptor/interceptor';
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';

import { VgCoreModule } from 'videogular2/compiled/core';
import { VgControlsModule } from 'videogular2/compiled/controls';
import { VgOverlayPlayModule } from 'videogular2/compiled/overlay-play';
import { VgBufferingModule } from 'videogular2/compiled/buffering';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { SupportComponent } from './pages/support/support.component';
import { ConnectsComponent } from './pages/connects/connects.component';
import { FaqComponent } from './pages/faq/faq.component';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { GrammarFeatureComponent } from './pages/grammar-feature/grammar-feature.component';
// tslint:disable-next-line:max-line-length
import { NavigationGrammarFeaturesComponent, ChecklistDatabase } from './components/navigation-grammar-features/navigation-grammar-features.component';
import { NavigationSignLanguageComponent } from './components/navigation-sign-language/navigation-sign-language.component';
import { SignLanguageComponent } from './pages/sign-language/sign-language.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FeatureDetailsComponent } from './pages/sign-language/feature-details/feature-details.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { VideoDialogComponent } from './components/video-dialog/video-dialog.component';
import { SigngramdetailComponent } from './pages/signgramdetail/signgramdetail.component';
import { MatSlideToggleModule } from '@angular/material';
import { FilterlistPipe } from './pipes/filterlist.pipe';
import { IslComponent } from './pages/assessment/isl/isl.component';
import { PrivateVideoComponent } from './pages/digital-archive/private-video/private-video.component';
import { UrlTrustPipe } from './pipes/UrlTrust.pipe';
// import { Vocabulary } from './directives/vocabulary.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    SigngramComponent,
    AtlasComponent,
    DigitalArchiveComponent,
    NavigationStreamingToolComponent,
    DigitalArchiveDetailsComponent,
    ContactComponent,
    AboutComponent,
    SupportComponent,
    ConnectsComponent,
    FaqComponent,
    GrammarFeatureComponent,
    SignLanguageComponent,
    NavigationGrammarFeaturesComponent,
    NavigationSignLanguageComponent,
    FeatureDetailsComponent,
    DataTableComponent,
    VideoDialogComponent,
    SigngramdetailComponent,
    EscapeHtmlPipe,
    FilterlistPipe,
    UrlTrustPipe,
    ProjectComponent,
    SupportingMaterialsComponent,
    IntroPageComponent,
    AssessmentComponent,
    LisComponent,
    LsfComponent,
    LscComponent,
    LseComponent,
    IslComponent,
    WelcomePage,
    DocumentaryComponent,
    PrivateVideoComponent
    // Vocabulary,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    Ng2OrderModule,
    NgxSkeletonLoaderModule,
    MatCardModule,
    MatChipsModule,
    MatSlideToggleModule,
    CookieLawModule
  ],
  providers: [
    ChecklistDatabase,
    Interceptor,
    DigitalArchiveService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
  ],
  entryComponents: [VideoDialogComponent, NavigationStreamingToolComponent, DigitalArchiveComponent],
  bootstrap: [AppComponent],

})
export class AppModule { }
