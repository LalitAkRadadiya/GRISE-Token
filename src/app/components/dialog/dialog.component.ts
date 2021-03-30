import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OtherTokenBalanceData } from 'src/app/models/other-token-balance-data';
import { LocalDataUpdateService } from 'src/app/services/local-data-update.service';
import { SharedService } from 'src/app/services/shared.service';
import { SlotData, SlotType } from '../../models/slot-data';
import { LiquidityContractService } from '../../services/liquidity-contract.service';
import { environment as env } from './../../../environments/environment';
import { SpinnerService } from './../../helper/spinner/spinner.service';
import { ContractService } from './../../services/contract.service';
import { MinAbiDataContractService } from './../../services/minabi-data-contract.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  selectedCoin: string;
  amount: number;
  allSelected = false;
  fixedSelected = false;
  randomSelected = false;
  workingSlots: SlotData[];
  filterSlots: SlotData[];
  allOtherCoins = env.allOtherCoins;
  minValueRequired: number;
  valuePlaceHolder: string;
  selectedCoinBalaceData: OtherTokenBalanceData;
  totalSelectedSlots = 0;
  insufficientBalanceText: string;
  @ViewChild('f') form: NgForm;

  constructor(private sharedService: SharedService,
              private liquidityContractService: LiquidityContractService,
              private localDataUpdateService: LocalDataUpdateService,
              private minAbiDataContractService: MinAbiDataContractService,
              private contractService: ContractService,
              private toastr: ToastrService,
              private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.setDefaultCoinData('ETH');
    this.workingSlots = this.sharedService.allSlots.filter(s => !s.isExpired);
    this.filterSlots = this.workingSlots;
    this.sharedService.updateSlotsTimer();

    this.localDataUpdateService.isSlotsReservationDataUpdated.subscribe(() => {
      this.sharedService.updateSlotsReservation();
      setTimeout(() => {
        const selCoin = this.allOtherCoins.filter(c => c.name == this.selectedCoin);
        if (selCoin.length > 0) { this.getSelectedCoinBalanceData(selCoin[0]); }
      }, 1000);
    });
  }

  getSelectedCoin(coin: any) {
    if (this.selectedCoin == coin.name) {
      return;
    }

    this.getSelectedCoinBalanceData(coin);
  }

  getSelectedCoinBalanceData(coin: any) {
    if (coin.tokenAddress) {
      this.spinnerService.show();
      this.minAbiDataContractService.getOtherTokenBalance(coin.tokenAddress).then(otherTokenBalanceData => {
        if (otherTokenBalanceData) {
          this.selectedCoin = coin.name;
          this.selectedCoinBalaceData = otherTokenBalanceData;
          this.minValueRequired = +(this.selectedCoinBalaceData.regularRate * 0.11).toFixed(2);
          this.setPlaceHolderValueText();
          this.spinnerService.hide();
        }
      });
    } else {
      this.setDefaultCoinData(coin.name);
    }
  }

  setDefaultCoinData(coinName: string) {
    this.selectedCoin = coinName;
    this.selectedCoinBalaceData = {
      tokenLargeBalance: this.contractService.totalBalance * (10 ** 18),
      decimalPlaces: 18,
      tokenShortBalance: +this.contractService.totalBalance,
      regularRate: 1,
      reverseRate: 1
    };
    this.minValueRequired = 0.1;
    this.setPlaceHolderValueText();
  }

  setPlaceHolderValueText() {
    this.setTotalSelectedSlotsCount();
    const minValue = this.minValueRequired * this.totalSelectedSlots;
    this.valuePlaceHolder = `Min [${minValue.toFixed(2)}] Required`;
  }

  setTotalSelectedSlotsCount() {
    if (this.workingSlots != undefined) {
      this.totalSelectedSlots = this.workingSlots.filter(val => val.isSelected && !val.isExpired).length;
    }
    this.totalSelectedSlots = this.totalSelectedSlots == 0 ? 1 : this.totalSelectedSlots;
  }

  selectDeselectAll() {
    this.allSelected = !this.allSelected;
    this.fixedSelected = false;
    this.randomSelected = false;
    this.workingSlots.forEach(slot => {
      slot.isSelected = this.allSelected;
    });
    this.setPlaceHolderValueText();
  }

  selectDeselectFixed() {
    this.fixedSelected = !this.fixedSelected;
    this.allSelected = false;
    this.randomSelected = false;
    this.workingSlots.forEach(slot => {
      if (this.fixedSelected && slot.type != SlotType.Fixed) {
        slot.isSelected = false;
      } else {
        slot.isSelected = this.fixedSelected;
      }
    });
    this.setPlaceHolderValueText();
  }

  selectDeselectRandom() {
    this.randomSelected = !this.randomSelected;
    this.allSelected = false;
    this.fixedSelected = false;
    this.workingSlots.forEach(slot => {
      if (this.randomSelected && slot.type != SlotType.Random) {
        slot.isSelected = false;
      } else {
        slot.isSelected = this.randomSelected;
      }
    });
    this.setPlaceHolderValueText();
  }

  singleSelect(slot: any) {
    const selectedSlot = this.workingSlots.find(s => s.id == slot.id);
    if (selectedSlot) {
      selectedSlot.isSelected = !selectedSlot.isSelected;
    }
    this.setPlaceHolderValueText();
  }

  checkValueWithBalance(): boolean {
    if (this.insufficientBalanceText) { this.insufficientBalanceText = ''; }
    if (this.form && !this.form.valid) {
      return true;
    }
    if (this.amount < (this.minValueRequired * this.totalSelectedSlots)) {
      return true;
    }
    if (this.amount > this.selectedCoinBalaceData.tokenShortBalance) {
      this.insufficientBalanceText = 'Insufficient Balance';
      return true;
    }

    return false;
  }

  reserveClick() {
    if (this.checkValueWithBalance()) {
      return;
    }
    // if (this.amount > this.selectedCoinBalaceData.tokenShortBalance) {
    //   this.toastr.warning('Insufficient Balance.');
    //   return;
    // }

    const slotNos: number[] = [];
    this.workingSlots.filter(val => val.isSelected && !val.isExpired).forEach(slot => {
      slotNos.push(slot.id);
    });

    if (slotNos.length > 0) {
      const coinData = this.allOtherCoins.filter(c => c.name == this.selectedCoin);
      if (coinData.length > 0) {
        const coinTokenAddress = coinData[0].tokenAddress;
        if (coinTokenAddress) {
          const coinAmount = (this.amount * (10 ** this.selectedCoinBalaceData.decimalPlaces)).toString();

          this.minAbiDataContractService.getTransactionApproval(coinTokenAddress, coinAmount);
          const subscription = this.localDataUpdateService.isTransactionApproved.subscribe((isApproved) => {
            if (isApproved) {
              this.liquidityContractService.addReservationWithToken(coinTokenAddress, slotNos, coinAmount);
              this.localDataUpdateService.updateTransactionApproved(false);
              subscription.unsubscribe();
            }
          });
        } else {
          this.liquidityContractService.addReservation(slotNos, this.amount);
        }
        this.form.reset();
        this.reset();
      }
    } else {
      this.toastr.info('You must select a slot.');
      return;
    }
  }

  reset() {
    this.sharedService.deselectAllSlots();
    this.allSelected = false;
    this.fixedSelected = false;
    this.randomSelected = false;
  }

  ngOnDestroy() {
    this.sharedService.stopSlotsTimer();
    this.sharedService.deselectAllSlots();
  }

}
