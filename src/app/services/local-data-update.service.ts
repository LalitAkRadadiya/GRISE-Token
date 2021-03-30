import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocalDataUpdateService {

    totalSlots = 50;
    slotMaxHours = 4;
    maxSlotsPerSlot = 147;

    private initSlotsReservationData = new BehaviorSubject<boolean>(false);
    private slotsReservationData = new BehaviorSubject<boolean>(false);
    private personalPeriodStakeSlotLeftData = new BehaviorSubject<boolean>(false);
    private stakePaginationData = new BehaviorSubject<string>('');
    private stakeTransactionsData = new BehaviorSubject<boolean>(false);
    private claimTokenHolderTransactionRewardData = new BehaviorSubject<boolean>(false);
    private transactionApproval = new BehaviorSubject<boolean>(false);
    private walletBalanceData = new BehaviorSubject<boolean>(false);
    private exchangeRateData = new BehaviorSubject<boolean>(false);
    private claimableAmountData = new BehaviorSubject<boolean>(false);
    isInitSlotsReservationDataUpdated = this.initSlotsReservationData.asObservable();
    isSlotsReservationDataUpdated = this.slotsReservationData.asObservable();
    isPersonalPeriodStakeSlotLeftDataUpdated = this.personalPeriodStakeSlotLeftData.asObservable();
    isStakePaginationDataUpdated = this.stakePaginationData.asObservable();
    isStakeTransactionsDataUpdated = this.stakeTransactionsData.asObservable();
    isClaimTokenHolderTransactionRewardDataUpdated = this.claimTokenHolderTransactionRewardData.asObservable();
    isTransactionApproved = this.transactionApproval.asObservable();
    isWalletBalanceDataUpdated = this.walletBalanceData.asObservable();
    isExchangeRateDataUpdated = this.exchangeRateData.asObservable();
    isClaimableAmountDataUpdated = this.claimableAmountData.asObservable();

    constructor() { }

    forceInitSlotsReservationData(data: boolean) {
        this.initSlotsReservationData.next(data);
    }
    forceUpdateSlotsReservationData(data: boolean) {
        this.slotsReservationData.next(data);
    }
    forceUpdatePersonalPeriodStakeSlotLeftData(data: boolean) {
        this.personalPeriodStakeSlotLeftData.next(data);
    }
    forceUpdateStakePaginationData(data: string) {
        this.stakePaginationData.next(data);
    }
    forceUpdateStakeTransactionsData(data: boolean) {
        this.stakeTransactionsData.next(data);
    }
    forceUpdateClaimTokenHolderTransactionRewardData(data: boolean) {
        this.claimTokenHolderTransactionRewardData.next(data);
    }
    updateTransactionApproved(data: boolean) {
        this.transactionApproval.next(data);
    }
    forceUpdateWalletBalanceData(data: boolean) {
        this.walletBalanceData.next(data);
    }
    forceUpdateExchangeRateData(data: boolean) {
        this.exchangeRateData.next(data);
    }
    forceUpdateClaimableAmountData(data: boolean) {
        this.claimableAmountData.next(data);
    }
}
