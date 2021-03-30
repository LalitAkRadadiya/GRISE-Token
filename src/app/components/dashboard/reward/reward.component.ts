import { Component, OnInit } from '@angular/core';
import { GriseTokenContractService } from 'src/app/services/grise-token-contract.service';

@Component({
  selector: 'app-reward',
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.scss']
})
export class RewardComponent implements OnInit {

  rewardToken: any;
  daysLeft: any;

  constructor(private griseTokenContractService: GriseTokenContractService) { }

  ngOnInit() {
    this.griseTokenContractService.isClaimTokenHolderTransactionRewardDataUpdated.subscribe(() => {
      this.griseTokenContractService.getTokenHolderTransactionReward().then(value => this.rewardToken = value);
    });
    this.griseTokenContractService.getTimeToClaimWeeklyReward().then(value => this.daysLeft = value);
  }

  claimReward() {
    if (this.daysLeft != 0 && this.rewardToken != 0) {
      return;
    }

    this.griseTokenContractService.claimTokenHolderTransactionReward();
  }
}
