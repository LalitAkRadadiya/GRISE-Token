import { Component, OnInit } from '@angular/core';
import { PersonalReferralData } from 'src/app/models/personal-referral-data';
import { LiquidityContractService } from 'src/app/services/liquidity-contract.service';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit {

  personalReferralData: PersonalReferralData;

  constructor(private liquidityContractService: LiquidityContractService) { }

  ngOnInit(): void {
    this.liquidityContractService.getPersonalReferralData().then(value => this.personalReferralData = value!);
  }

}
