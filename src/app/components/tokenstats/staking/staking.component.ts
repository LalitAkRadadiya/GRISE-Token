import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { StakingTokenContractService } from 'src/app/services/staking-token-contract.service';
import { StakeCountData } from '../../../models/stake-count-data';
import { StakeSlotLeftData } from '../../../models/stake-slot-left-data';

@Component({
  selector: 'app-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.scss']
})
export class StakingComponent implements OnInit, OnDestroy {

  stakeCount: StakeCountData;
  slotLeft: StakeSlotLeftData;

  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: { labels: { fontColor: 'white' } }
  };
  pieChartLabels: Label[] = ['Short-term stake', 'Medium-term stake', 'Long-term stake'];
  pieChartStakeCountData: SingleDataSet = [0, 0, 0];
  pieChartSlotLeftData: SingleDataSet = [0, 0, 0];

  intervalId: any;

  constructor(private stakingTokenContractService: StakingTokenContractService) { }

  ngOnInit(): void {
    this.refreshData();
    this.setRefreshDataTimer();
  }

  refreshData() {
    this.getStakeCountData();
    this.getStakeSlotsLeftData();
  }

  setRefreshDataTimer() {
    this.intervalId = setInterval(() => {
      this.refreshData();
    }, 30000);
  }

  getStakeCountData() {
    this.stakingTokenContractService.getStakeCountData().then(stakeCount => {
      if (stakeCount) {
        this.stakeCount = stakeCount;
        this.pieChartStakeCountData = [this.stakeCount.stStakeCount, this.stakeCount.mtStakeCount, this.stakeCount.ltStakeCount];
      }
    });
  }

  getStakeSlotsLeftData() {
    this.stakingTokenContractService.getStakeSlotsLeftData().then(slotLeft => {
      if (slotLeft) {
        this.slotLeft = slotLeft;
        this.pieChartSlotLeftData = [this.slotLeft.stSlotLeft, this.slotLeft.mtSlotLeft, this.slotLeft.ltSlotLeft];
      }
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
