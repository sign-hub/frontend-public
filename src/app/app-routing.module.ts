import { LscComponent } from './pages/assessment/lsc/lsc.component';
import { LseComponent } from './pages/assessment/lse/lse.component';
import { LsfComponent } from './pages/assessment/lsf/lsf.component';
import { LisComponent } from './pages/assessment/lis/lis.component';
import { WelcomePage } from './pages/assessment/welcome-page/welcome-page.component';
import { SupportingMaterialsComponent } from './pages/supporting-materials/supporting-materials.component';
import { IntroPageComponent } from './pages/digital-archive/intro-page/intro-page.component';
import { AssessmentComponent } from './pages/assessment/assessment.component';
import { ProjectComponent } from './pages/project/project.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SigngramComponent } from './pages/signgram/signgram.component';
import { AtlasComponent } from './pages/atlas/atlas.component';
import { DigitalArchiveComponent } from './pages/digital-archive/digital-archive.component';
import { DigitalArchiveDetailsComponent } from './pages/digital-archive/digital-archive-details/digital-archive-details.component';
import { NavigationStreamingToolComponent } from './components/navigation-streaming-tool/navigation-streaming-tool.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SupportComponent } from './pages/support/support.component';
import { ConnectsComponent } from './pages/connects/connects.component';
import { FaqComponent } from './pages/faq/faq.component';
import { NavigationGrammarFeaturesComponent } from './components/navigation-grammar-features/navigation-grammar-features.component';
import { GrammarFeatureComponent } from './pages/grammar-feature/grammar-feature.component';
import { NavigationSignLanguageComponent } from './components/navigation-sign-language/navigation-sign-language.component';
import { SignLanguageComponent } from './pages/sign-language/sign-language.component';
import { FeatureDetailsComponent } from './pages/sign-language/feature-details/feature-details.component';
import { SigngramdetailComponent } from './pages/signgramdetail/signgramdetail.component';

const routes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: 'grammar', component: SigngramComponent },
  { path: 'grammardetail/:uuid', component: SigngramdetailComponent },
  { path: 'atlas', component: AtlasComponent },
  {
    path: 'grammar-features', component: NavigationGrammarFeaturesComponent,
    children: [
      { path: 'feature-details/:code', component: FeatureDetailsComponent }
    ]
  },
  {
    path: 'digital-archive', component: NavigationStreamingToolComponent,
    children: [
      { path: '', redirectTo: 'digital-archive-main', pathMatch: 'full' },
      { path: 'digital-archive-main', component: DigitalArchiveComponent },
      { path: 'details/:name', component: DigitalArchiveDetailsComponent },
    ]
  },

  {
    path: 'sign-language', component: NavigationSignLanguageComponent,
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: SignLanguageComponent },
      { path: 'feature-details/:uuid', component: FeatureDetailsComponent }
    ]
  },
  { path: 'about', component: AboutComponent },
  { path: 'contacts', component: ContactComponent },
  { path: 'support', component: SupportComponent },
  { path: 'connects', component: ConnectsComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'project', component: ProjectComponent },
  {
    path: 'assessment', component: AssessmentComponent,
    children: [
      { path: '', redirectTo: 'welcome-page-assessment', pathMatch: 'full' },
      { path: 'welcome-page-assessment', component: WelcomePage },
      { path: 'lis', component: LisComponent },
      { path: 'lsf', component: LsfComponent },
      { path: 'lse', component: LseComponent },
      { path: 'lsc', component: LscComponent },
    ]
  },
  { path: 'streaming', component: IntroPageComponent },
  { path: 'supportingMaterials', component: SupportingMaterialsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
