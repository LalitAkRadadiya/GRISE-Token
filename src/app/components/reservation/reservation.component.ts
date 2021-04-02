import { ContractService } from './../../services/contract.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SlotData, SlotType } from 'src/app/models/slot-data';
import { LiquidityContractService } from 'src/app/services/liquidity-contract.service';
import { SharedService } from 'src/app/services/shared.service';
import { LocalDataUpdateService } from './../../services/local-data-update.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit, OnDestroy {

  filterType = 0;
  filterSlots: SlotData[];
  minValueRequired = 0.1;
  nftdetail : any;
  nftDetailEnable = false;
  nftButton(val : any){
    console.log('val', val);
    this.nftdetail = this.sharedService.allSlots[val-1].nftDetail;
  }
  nftCloseButton(){
    this.nftDetailEnable = false;
  }
  constructor(private sharedService: SharedService,
              private liquidityContractService: LiquidityContractService,
              private localDataUpdateService: LocalDataUpdateService,
              private contractService: ContractService) { }

  ngOnInit(): void {
    this.localDataUpdateService.isSlotsReservationDataUpdated.subscribe((isUpdated) => {
      if (isUpdated) {
        this.sharedService.updateSlotsTimer();
        this.sharedService.updateSlotsReservation();
        this.filterSlots = [];
        if (this.filterType == 1) {
          this.fixedSlots();
        } else if (this.filterType == 2) {
          this.randomSlots();
        } else {
          this.allSlots();
        }
      }
    });
  }

  allSlots() {
    this.filterSlots = this.sharedService.allSlots;
    this.filterType = 0;
  }

  fixedSlots() {
    this.filterSlots = this.sharedService.allSlots.filter(val => val.type == SlotType.Fixed);
    this.filterType = 1;
  }

  randomSlots() {
    this.filterSlots = this.sharedService.allSlots.filter(val => val.type == SlotType.Random);
    this.filterType = 2;
  }

  checkValueWithBalance(slot: SlotData, form: NgForm): boolean {
    if (slot.isExpired) {
      return true;
    }
    if (slot.slotLeft == 0) {
      return true;
    }
    if (slot.validationText) { slot.validationText = ''; }
    if (!form.valid) {
      return true;
    }
    if (form.controls.slotAmount == undefined) {
      return true;
    }
    const amount: number = form.controls.slotAmount.value;
    if (amount == 0) {
      return true;
    }
    if (amount < this.minValueRequired && slot.myContribution == 0) {
      return true;
    }
    if (amount > this.contractService.totalBalance) {
      slot.validationText = 'Insufficient Balance';
      return true;
    }

    return false;
  }

  reserveClick(slot: SlotData, form: NgForm) {
    if (this.checkValueWithBalance(slot, form)) {
      return;
    }

    const amount: number = form.controls.slotAmount.value;
    if (amount > 0) {
      const slotNos: number[] = [slot.id];
      this.liquidityContractService.addReservation(slotNos, amount);
      form.reset();
    }
  }

  ngOnDestroy() {
    this.sharedService.stopSlotsTimer();
  }
}
