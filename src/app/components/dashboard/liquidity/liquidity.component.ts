import { Component, OnInit } from '@angular/core';
import { ClaimableAmountData } from 'src/app/models/claimable-amount-data';
import { LiquidityEventData } from 'src/app/models/liquidity-event-data';
import { LiquidityContractService } from 'src/app/services/liquidity-contract.service';
import { LocalDataUpdateService } from 'src/app/services/local-data-update.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-liquidity',
  templateUrl: './liquidity.component.html',
  styleUrls: ['./liquidity.component.scss']
})
export class LiquidityComponent implements OnInit {

  liquidityEventData: LiquidityEventData;
  claimableAmountData: ClaimableAmountData;
  timeLeft: string;
  eventIsClosed: boolean;
  claimableAmount = 0;

  constructor(private sharedService: SharedService,
              private liquidityContractService: LiquidityContractService,
              private localDataUpdateService: LocalDataUpdateService) { }

  ngOnInit() {
    this.tokenTimer();
    this.liquidityContractService.getLiquidityEventData().then(value => this.liquidityEventData = value!);
    this.localDataUpdateService.isClaimableAmountDataUpdated.subscribe(() => {
      this.liquidityContractService.getClaimableAmount().then(claimableAmtData => {
        if (claimableAmtData) {
          this.claimableAmountData = claimableAmtData;
          this.claimableAmount = claimableAmtData.claimableAmount;
        }
      });
    });
  }

  tokenTimer() {
    this.timeLeft = this.sharedService.getTimeLeft(this.sharedService.endTime);
    const intervalId = setInterval(() => {
      this.timeLeft = this.sharedService.getTimeLeft(this.sharedService.endTime);
      if (this.timeLeft == 'EXPIRED') {
        this.eventIsClosed = true;
        clearInterval(intervalId);
      }
    }, 1000);
  }

  checkClaimGrise(): boolean {
    if (this.claimableAmountData) {
      if (this.claimableAmount != 0 && this.claimableAmountData.generatedDays > 0 && this.claimableAmountData.totalWeiContributed == 0) {
        return false;
      }
    }

    return true;
  }

  claimGriseToken() {
    if (this.checkClaimGrise()) {
      return;
    }

    this.liquidityContractService.claimGriseToken();    
  }
}
