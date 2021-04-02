import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LiquidityComponent } from './components/dashboard/liquidity/liquidity.component';
import { PersonalComponent } from './components/dashboard/personal/personal.component';
import { ReferralsComponent } from './components/dashboard/referrals/referrals.component';
import { RefundHistoryComponent } from './components/dashboard/refund-history/refund-history.component';
import { RewardComponent } from './components/dashboard/reward/reward.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { HomeComponent } from './components/home/home.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { ReferralLinkDialogComponent } from './components/tokeninfo/referral-link-dialog/referral-link-dialog.component';
import { TokeninfoComponent } from './components/tokeninfo/tokeninfo.component';
import { GraphComponent } from './components/tokenstats/graph/graph.component';
import { StakingComponent } from './components/tokenstats/staking/staking.component';
import { TokenstatsComponent } from './components/tokenstats/tokenstats.component';
import { ConfirmDialogComponent } from './helper/confirm-dialog/confirm-dialog.component';
import { SpinnerComponent } from './helper/spinner/spinner.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NFTComponent } from './components/nft/nft.component';
import { TokenMetrixComponent } from './components/token-metrix/token-metrix.component';
const material = [MatTabsModule, ClipboardModule, MatTooltipModule];
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'reservation', component: ReservationComponent },
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { path: '', redirectTo: 'personal', pathMatch: 'full' },
      { path: 'personal', component: PersonalComponent },
      { path: 'liquidity', component: LiquidityComponent },
      { path: 'referrals', component: ReferralsComponent },
      { path: 'refundhistory', component: RefundHistoryComponent },
      { path: 'reward', component: RewardComponent }
    ]
  },
  {
    path: 'tokenstats', component: TokenstatsComponent, children: [
      { path: '', redirectTo: 'staking', pathMatch: 'full' },
      { path: 'staking', component: StakingComponent },
      { path: 'graph', component: GraphComponent }
    ]
  },
  { path: 'tokeninfo', component: TokeninfoComponent },
  { path: 'NFT' ,component: NFTComponent},
  { path:'tokenmetrix', component:TokenMetrixComponent},
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, material]
})
export class AppRoutingModule { }
export const routingmod = [
  HomeComponent,
  DialogComponent,
  StakingComponent,
  GraphComponent,
  ReservationComponent,
  DashboardComponent,
  LiquidityComponent,
  PersonalComponent,
  ReferralsComponent,
  RefundHistoryComponent,
  TokenstatsComponent,
  TokeninfoComponent,
  RewardComponent,
  SpinnerComponent,
  ConfirmDialogComponent,
  ReferralLinkDialogComponent
];
