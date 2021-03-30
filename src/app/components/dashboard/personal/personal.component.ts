import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { StakeTransactionData } from 'src/app/models/stake-transaction-data';
import { LocalDataUpdateService } from 'src/app/services/local-data-update.service';
import { SharedService } from 'src/app/services/shared.service';
import { StakingTokenContractService } from 'src/app/services/staking-token-contract.service';
import { ConfirmDialogComponent } from '../../../helper/confirm-dialog/confirm-dialog.component';
import { PersonalPeriodStakeSetup } from '../../../models/personal-period-stake-setup';
import { PersonalStakeData } from '../../../models/personal-stake-data';
import { ExchangeRateData } from './../../../models/exchage-rate-data';
import { ContractService } from './../../../services/contract.service';
import { GriseTokenContractService } from './../../../services/grise-token-contract.service';
import { MinAbiDataContractService } from './../../../services/minabi-data-contract.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  weeklyPeriodStake: PersonalPeriodStakeSetup;
  monthlyPeriodStake: PersonalPeriodStakeSetup;
  yearlyPeriodStake: PersonalPeriodStakeSetup;
  selectedPeriod: string;
  weekly = new PersonalStakeData();
  monthly = new PersonalStakeData();
  yearly = new PersonalStakeData();
  stakeTransactions: StakeTransactionData[] = [];
  pageNo = 0;
  perPageRecords = 10;
  reachMaxRecords = false;
  weeklyDaysLeft = 0;
  weeklyDaysProgress = 0;
  monthlyDaysLeft = 0;
  monthlyDaysProgress = 0;
  etherExchangeRate: ExchangeRateData;
  griseValidationText: string;
  ethValidationText: string;

  constructor(private sharedService: SharedService,
    private localDataUpdateService: LocalDataUpdateService,
    private stakingTokenContractService: StakingTokenContractService,
    private griseTokenContractService: GriseTokenContractService,
    private contractService: ContractService,
    private minAbiDataContractService: MinAbiDataContractService,
    private toastr: ToastrService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.etherExchangeRate = {
      regularRate: 0,
      reverseRate: 0,
      reverseRateWithoutDecimal: 0
    };
    this.griseTokenContractService.timeToClaimWeeklyReward().then(weeklyDaysLeft => {
      this.weeklyDaysLeft = +weeklyDaysLeft;
      this.weeklyDaysProgress = (7 - this.weeklyDaysLeft) / 7 * 100;
    });
    this.griseTokenContractService.timeToClaimMonthlyReward().then(monthlyDaysLeft => {
      this.monthlyDaysLeft = +monthlyDaysLeft;
      this.monthlyDaysProgress = (28 - this.monthlyDaysLeft) / 28 * 100;
    });
    this.localDataUpdateService.isStakeTransactionsDataUpdated.subscribe(() => {
      this.reachMaxRecords = false;
      this.stakeTransactions = [];
      this.getStakeTransactions();
      this.sharedService.updatePersonalPeriodStakeSlotLeft();
    });
    this.localDataUpdateService.isPersonalPeriodStakeSlotLeftDataUpdated.subscribe(() => {
      this.assignStakeSetup();
    });
    this.localDataUpdateService.isStakePaginationDataUpdated.subscribe(stakeId => {
      if (stakeId) {
        this.updateStakeDataById(stakeId);
      }
    });
    this.localDataUpdateService.isExchangeRateDataUpdated.subscribe(() => {
      this.minAbiDataContractService.getTokenExchangeRate(this.contractService.griseAccountNo).then(exchangeRate => {
        if (exchangeRate) {
          this.etherExchangeRate = exchangeRate;
        }
      });
    });
  }

  assignStakeSetup() {
    this.reset();
    this.weeklyPeriodStake = this.getPeriodStake('W', '');
    this.yearlyPeriodStake = this.getPeriodStake('Y', '');
    this.monthlyPeriodStake = this.getPeriodStake('M', this.monthly.periodValue.toString());

    this.weekly.stakeValue = this.weeklyPeriodStake.slotLeft == 0 ? 0 : this.weeklyPeriodStake.stakeStep;
    this.monthly.stakeValue = this.monthlyPeriodStake.slotLeft == 0 ? 0 : this.monthlyPeriodStake.stakeStep;
    this.yearly.stakeValue = this.yearlyPeriodStake.slotLeft == 0 ? 0 : this.yearlyPeriodStake.stakeStep;
  }

  reset() {
    this.selectedPeriod = '';
    this.weekly = new PersonalStakeData();
    this.monthly = new PersonalStakeData();
    this.yearly = new PersonalStakeData();
    this.weekly.periodValue = 1;
    this.monthly.periodValue = 3;
    this.yearly.periodValue = 1;
  }

  changePeriodStake(periodType: string) {
    if (periodType == 'M') {
      this.monthlyPeriodStake = this.getPeriodStake(periodType, this.monthly.periodValue.toString());
      this.monthly.stakeValue = this.monthlyPeriodStake.slotLeft == 0 ? 0 : this.monthlyPeriodStake.stakeStep;
    }
  }

  getPeriodStake(periodType: string, additionalValue: string): PersonalPeriodStakeSetup {
    const foundPeriodStake = this.sharedService.allPersonalPeriodStakes.filter(val => val.periodType == periodType && val.additionalValue == additionalValue);
    if (foundPeriodStake.length > 0) {
      return foundPeriodStake[0];
    }
    return new PersonalPeriodStakeSetup();
  }

  onTabClick(periodType: string) {
    this.selectedPeriod = periodType;
  }

  increment(periodType: string) {
    this.incrementDecrement(periodType, 1);
  }

  decrement(periodType: string) {
    this.incrementDecrement(periodType, -1);
  }

  incrementDecrement(periodType: string, plusMinus: number) {
    if (periodType == 'W') {
      this.weekly.stakeValue = this.validateMinMaxValues(this.weekly.stakeValue, this.weeklyPeriodStake, plusMinus);
    } else if (periodType == 'M' && this.monthlyPeriodStake != null) {
      this.monthly.stakeValue = this.validateMinMaxValues(this.monthly.stakeValue, this.monthlyPeriodStake, plusMinus);
    } else if (periodType == 'Y') {
      this.yearly.stakeValue = this.validateMinMaxValues(this.yearly.stakeValue, this.yearlyPeriodStake, plusMinus);
    }
  }

  validateMinMaxValues(currentValue: number, stakeSetting: PersonalPeriodStakeSetup, plusMinus: number): number {
    if (stakeSetting.slotLeft == 0) {
      currentValue = 0;
    } else {
      currentValue = (currentValue == null ? 0 : +currentValue) + (stakeSetting.stakeStep * plusMinus);
      if (currentValue < stakeSetting.stakeStep) {
        currentValue = stakeSetting.stakeStep;
      }
      if (currentValue > (stakeSetting.stakeStep * stakeSetting.slotLeft)) {
        currentValue = stakeSetting.stakeStep * stakeSetting.slotLeft;
      }
    }
    return currentValue;
  }

  checkValueWithGriseBalance(): boolean {
    if (!this.selectedPeriod) {
      return true;
    }
    if (this.griseValidationText) { this.griseValidationText = ''; }
    const selectedStakeData = this.getSelectedValues();
    if (selectedStakeData.periodValue == undefined) {
      return true;
    }
    if (selectedStakeData.periodValue == 0 || selectedStakeData.stakeValue == 0) {
      return true;
    }
    if (selectedStakeData.stakeValue > this.contractService.totalGriseBalance) {
      this.griseValidationText = 'Insufficient Balance';
      return true;
    }

    return false;
  }

  checkValueWithEthBalance(): boolean {
    if (!this.selectedPeriod) {
      return true;
    }
    if (this.ethValidationText) { this.ethValidationText = ''; }
    const selectedStakeData = this.getSelectedValues();
    if (selectedStakeData.periodValue == undefined) {
      return true;
    }
    if (selectedStakeData.periodValue == 0 || selectedStakeData.stakeValue == 0) {
      return true;
    }
    if (this.etherExchangeRate.reverseRate == 0) {
      return true;
    }
    const ethAmount = this.getEthAmountFromGrise(selectedStakeData.stakeValue);
    if (ethAmount > this.contractService.totalBalance) {
      this.ethValidationText = 'Insufficient Balance';
      return true;
    }

    return false;
  }

  getSelectedValues(): PersonalStakeData {
    if (this.selectedPeriod == 'W') {
      this.weekly.stakeType = 0;
      this.weekly.days = this.weekly.periodValue * 7;
      return this.weekly;
    } else if (this.selectedPeriod == 'M') {
      this.monthly.stakeType = 1;
      this.monthly.days = this.monthly.periodValue * 28;
      return this.monthly;
    } else if (this.selectedPeriod == 'Y') {
      this.yearly.stakeType = 2;
      this.yearly.days = this.yearly.periodValue * 12 * 28;
      return this.yearly;
    }
    return new PersonalStakeData();
  }

  createGriseStake() {
    if (this.checkValueWithGriseBalance()) {
      return;
    }

    const selectedStakeData = this.getSelectedValues();
    if (selectedStakeData.periodValue > 0 && selectedStakeData.stakeValue > 0) {
      this.stakingTokenContractService.createStakeGrise(selectedStakeData.stakeValue, selectedStakeData.stakeType, selectedStakeData.days);
    }
  }

  createEthStake() {
    if (this.checkValueWithEthBalance()) {
      return;
    }

    const selectedStakeData = this.getSelectedValues();
    if (selectedStakeData.periodValue > 0 && selectedStakeData.stakeValue > 0) {
      const etherLargeAmount = this.getEthLargeAmountFromGrise(selectedStakeData.stakeValue);
      this.stakingTokenContractService.createStakeWithETH(selectedStakeData.stakeValue, selectedStakeData.stakeType, selectedStakeData.days, etherLargeAmount);
    }
  }

  getEthAmountFromGrise(tokenAmount: number): number {
    let etherAmount = tokenAmount * 1.04;
    etherAmount = (etherAmount * this.etherExchangeRate.reverseRate * 1.04);
    return etherAmount;
  }

  getEthLargeAmountFromGrise(tokenAmount: number): string {
    let etherLargeAmount = tokenAmount * 1.04;
    etherLargeAmount = (etherLargeAmount * this.etherExchangeRate.reverseRateWithoutDecimal * 1.04);
    return etherLargeAmount.toString();
  }

  loadMore() {
    if (this.reachMaxRecords) {
      return;
    }

    if (this.stakeTransactions.length == 0) {
      this.pageNo = 0;
    } else {
      this.pageNo++;
    }

    this.getStakeTransactions();
  }

  getStakeTransactions() {
    const pageStartRecord = (this.pageNo * this.perPageRecords);
    this.stakingTokenContractService.getStakesPagination(pageStartRecord, this.perPageRecords).then(stakeIds => {
      if (stakeIds != null) {
        stakeIds.forEach((stakeId: string) => {
          const existStakeTransaction = this.stakeTransactions.filter(s => s.stakeId == stakeId);
          if (existStakeTransaction.length == 0) {
            this.stakeTransactions.push({ stakeId });
            this.updateStakeDataById(stakeId);
          }
          else {
            this.reachMaxRecords = true;
          }
        });
        if (this.stakeTransactions.length % this.perPageRecords != 0) {
          this.reachMaxRecords = true;
        } else if (this.stakeTransactions.length == 0) {
          this.reachMaxRecords = true;
        }
      }
      else {
        this.reachMaxRecords = true;
      }
    });
  }

  updateStakeDataById(stakeId: string) {
    const stakeIds: string[] = [stakeId];
    Promise.all(
      stakeIds.map(async (stakeId: string) => {
        const stakeBasicData = await this.stakingTokenContractService.checkStakeByID(stakeId);
        const stakeRewardData = await this.stakingTokenContractService.checkStakeRewards(stakeId);

        return {
          stakeId,
          stakeBasicData: stakeBasicData!,
          stakeRewardData: stakeRewardData!
        };
      })
    ).then((newStakeTransactions: StakeTransactionData[]) => {
      if (newStakeTransactions.length > 0) {
        const existStakeTransaction = this.stakeTransactions.filter(s => s.stakeId == stakeId);
        if (existStakeTransaction.length > 0) {
          existStakeTransaction[0].stakeBasicData = newStakeTransactions[0].stakeBasicData;
          existStakeTransaction[0].stakeRewardData = newStakeTransactions[0].stakeRewardData;

          existStakeTransaction[0].stakeCreatedOn = this.sharedService.getDateAdd(this.sharedService.launchTime, existStakeTransaction[0].stakeBasicData?.startDay);
          existStakeTransaction[0].stakeLockUpOn = this.sharedService.getDateAdd(this.sharedService.launchTime, existStakeTransaction[0].stakeBasicData?.finalDay);
          const currentDay = this.sharedService.getDateDiff(new Date(this.sharedService.launchTime), new Date());
          const finalDay = existStakeTransaction[0].stakeBasicData ? existStakeTransaction[0].stakeBasicData.finalDay : 0;
          const lockDays = existStakeTransaction[0].stakeBasicData ? existStakeTransaction[0].stakeBasicData.lockDays : 0;

          existStakeTransaction[0].stakeLockUpDaysLeft = finalDay - currentDay;
          if (existStakeTransaction[0].stakeLockUpDaysLeft <= 0) {
            existStakeTransaction[0].stakeLockUpDaysLeft = 0;
          }
          if (lockDays != 0) {
            existStakeTransaction[0].stakeProgress = (lockDays - existStakeTransaction[0].stakeLockUpDaysLeft) / lockDays * 100;
          } else {
            existStakeTransaction[0].stakeProgress = 0;
          }
          if (existStakeTransaction[0].stakeProgress >= 100) {
            existStakeTransaction[0].stakeProgress = 100;
          }
          if (existStakeTransaction[0].stakeBasicData?.stakeType == 0) {
            existStakeTransaction[0].stakeTypeName = 'Short-term Stake';
          } else if (existStakeTransaction[0].stakeBasicData?.stakeType == 1) {
            existStakeTransaction[0].stakeTypeName = 'Medium-term Stake';
          } else if (existStakeTransaction[0].stakeBasicData?.stakeType == 2) {
            existStakeTransaction[0].stakeTypeName = 'Long-term Stake';
          }
          if (existStakeTransaction[0].stakeBasicData?.scrapeDay != 0) {
            existStakeTransaction[0].stakeScrapeOn = this.sharedService.getDateAdd(this.sharedService.launchTime, existStakeTransaction[0].stakeBasicData?.scrapeDay);
          }
          if (existStakeTransaction[0].stakeBasicData?.closeDay != 0) {
            existStakeTransaction[0].stakeCloseOn = this.sharedService.getDateAdd(this.sharedService.launchTime, existStakeTransaction[0].stakeBasicData?.closeDay);
          }
        }
      }
    });
  }

  getTotalScrapeReward(stakeTransaction: StakeTransactionData): number {
    if (stakeTransaction.stakeRewardData) {
      const scrapeReward = stakeTransaction.stakeRewardData.penaltyRewardAmount
        + stakeTransaction.stakeRewardData.transcRewardAmount
        + stakeTransaction.stakeRewardData.reservoirRewardAmount
        + stakeTransaction.stakeRewardData.inflationRewardAmount;
      return scrapeReward;
    }
    return 0;
  }

  checkScarpeReward(stakeTransaction: StakeTransactionData): boolean {
    const totalScrapeReward = this.getTotalScrapeReward(stakeTransaction);
    if (totalScrapeReward != 0) {
      return true;
    }
    return false;
  }

  scrapeReward(stakeTransaction: StakeTransactionData) {
    if (!this.checkScarpeReward(stakeTransaction)) {
      return;
    }

    const totalScrapeReward = this.getTotalScrapeReward(stakeTransaction);
    let haveMultiReward = true;
    if (stakeTransaction.stakeRewardData) {
      if (totalScrapeReward == stakeTransaction.stakeRewardData.penaltyRewardAmount) { haveMultiReward = false; }
      if (totalScrapeReward == stakeTransaction.stakeRewardData.transcRewardAmount) { haveMultiReward = false; }
      if (totalScrapeReward == stakeTransaction.stakeRewardData.reservoirRewardAmount) { haveMultiReward = false; }
      if (totalScrapeReward == stakeTransaction.stakeRewardData.inflationRewardAmount) { haveMultiReward = false; }
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '525px',
      data: { dialogType: 1, transaction: stakeTransaction, totalScrapeReward, haveMultiReward }
    });

    dialogRef.afterClosed().subscribe((result: StakeTransactionData) => {
      if (result) {
        this.stakingTokenContractService.scrapeReward(result.stakeId);
      }
    });
  }

  endStake(stakeTransaction: StakeTransactionData) {
    if (stakeTransaction.stakeBasicData?.isMature) {
      this.stakingTokenContractService.endStake(stakeTransaction.stakeId);
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: { dialogType: 0, transaction: stakeTransaction }
      });

      dialogRef.afterClosed().subscribe((result: StakeTransactionData) => {
        if (result) {
          this.stakingTokenContractService.endStake(result.stakeId);
        }
      });
    }
  }
}
