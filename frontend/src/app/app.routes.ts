import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { CoreComponent } from './components/core/core.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { RoleGuard } from './guards/role/role.guard';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { UsersComponent } from './components/admin/users/users.component';
import { InvestorsComponent } from './components/admin/investors/investors.component';
import { OrganizationsComponent } from './components/admin/organizations/organizations.component';
import { StartupsComponent } from './components/admin/startups/startups.component';
import { ProjectsComponent } from './components/admin/projects/projects.component';
import { ProfileComponent } from './components/admin/profile/profile.component';
import { ContactComponent } from './components/contact/contact.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { AboutComponent } from './components/shared/about/about.component';
import { FeaturesComponent } from './components/shared/features/features.component';
import { TestimonialsComponent } from './components/shared/testimonials/testimonials.component';
import { UserProjectsComponent } from './components/core/user-projects/user-projects.component';
import { SingleProjectComponent } from './components/core/single-project/single-project.component';
import { CreateProjectComponent } from './components/core/create-project/create-project.component';
import { UserOrgComponent } from './components/core/user-org/user-org.component';
import { TransactionComponent } from './components/core/transaction/transaction.component';
import { InvestorComponent } from './components/core/investor/investor.component';
import { OrganizationComponent } from './components/shared/organization/organization.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'contact-us', component: ContactComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'about', component: AboutComponent},
    { path: 'features', component: FeaturesComponent},
    { path: 'testimonials', component: TestimonialsComponent},
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'organization', component: OrganizationComponent },
    {path: 'project/:id',
    component: SingleProjectComponent},
    { path: 'home', component: CoreComponent, canActivate: [AuthGuard], 
      children: [
        { path: '', component: UserProjectsComponent },
        { path: 'projects', component: UserProjectsComponent },
        { path: 'create-project', component: CreateProjectComponent },
        { path: 'profile', component: UserOrgComponent },
        { path: 'transact', component: TransactionComponent },
        { path: 'investor', component: InvestorComponent }
      ] 
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard, RoleGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent },
          { path: 'users', component: UsersComponent },
          { path: 'investors', component: InvestorsComponent },
          { path: 'organizations', component: OrganizationsComponent },
          { path: 'startups', component: StartupsComponent },
          { path: 'projects', component: ProjectsComponent },
          { path: 'profile', component: ProfileComponent }
        ]
      }
];
