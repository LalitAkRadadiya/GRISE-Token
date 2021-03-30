import { LocalDataUpdateService } from './local-data-update.service';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as LiquidityTransformer from '../../abis/liquidity/LiquidityTransformer.json';
import { LiquidityEventData } from '../models/liquidity-event-data';
import { PersonalReferralData } from '../models/personal-referral-data';
import { GriseReservationData } from './../models/grise-resevation-data';
import { ContractService } from './contract.service';
import { SpinnerService } from '../helper/spinner/spinner.service';
import { ClaimableAmountData } from '../models/claimable-amount-data';

@Injectable({ providedIn: 'root' })
export class LiquidityContractService {

    constructor(private contractService: ContractService,
        private toastr: ToastrService,
        private localDataUpdateService: LocalDataUpdateService,
        private spinnerService: SpinnerService) { }

    async assignLiquidityAccountNo() {
        try {
            const liquidityTransformerContract = await this.contractService.getContractObject(LiquidityTransformer);
            if (liquidityTransformerContract) {
                this.contractService.liquidityAccountNo = liquidityTransformerContract._address;
            }
        } catch (ex) { }
    }

    async getCurrentLPDay() {
        try {
            const liquidityTransformerContract = await this.contractService.getContractObject(LiquidityTransformer);
            if (liquidityTransformerContract) {
                let currentLPDay = await liquidityTransformerContract.methods._currentLPDay().call();
                currentLPDay = (currentLPDay <= this.localDataUpdateService.totalSlots) ? +currentLPDay : -1;
                return currentLPDay;
            }
        } catch (ex) { }
        return -1;
    }

    async getLiquidityEventData() {
        try {
            const liquidityTransformerContract = await this.contractService.getContractObject(LiquidityTransformer);
            if (liquidityTransformerContract) {
                let totalInvestment = await liquidityTransformerContract.methods.totalInvestment().call();
                const uniqueInvestorCount = await liquidityTransformerContract.methods.uniqueInvestorCount().call();
                const referralAccountCount = await liquidityTransformerContract.methods.referralAccountCount().call();
                let currentLPDay = await liquidityTransformerContract.methods._currentLPDay().call();
                totalInvestment = this.contractService.convertAmountInBigUnit(totalInvestment);
                currentLPDay = (currentLPDay <= this.localDataUpdateService.totalSlots) ? currentLPDay : -1;

                const liquidityEventData: LiquidityEventData = {
                    totalInvestment,
                    uniqueInvestorCount,
                    referralAccountCount,
                    currentLPDay
                };
                return liquidityEventData;
            }
        } catch (ex) { }
        return null;
    }

    async getGriseReservationData(slotNo: number) {
        try {
            const liquidityTransformerContract = await this.contractService.getContractObject(LiquidityTransformer);
            if (liquidityTransformerContract) {
                const currentLPDay = await liquidityTransformerContract.methods._currentLPDay().call();
                const slotsUsed = await liquidityTransformerContract.methods.dailySlots(slotNo).call();
                let totalInvestment = await liquidityTransformerContract.methods.dailyTotalInvestment(slotNo).call();
                let myContribution = await liquidityTransformerContract.methods.myInvestmentAmount(slotNo).call({ from: this.contractService.accountNo });
                let myShare = await liquidityTransformerContract.methods.myClaimAmount(slotNo).call({ from: this.contractService.accountNo });

                totalInvestment = this.contractService.convertAmountInBigUnit(totalInvestment);
                myContribution = this.contractService.convertAmountInBigUnit(myContribution);
                myShare = this.contractService.convertAmountInBigUnit(myShare);

                const griseReservationData: GriseReservationData = {
                    currentLPDay,
                    slotsUsed,
                    totalInvestment,
                    myContribution,
                    myShare
                };
                return griseReservationData;
            }
        } catch (ex) { }
        return null;
    }

    async addReservation(slotNos: number[], amount: number) {
        try {
            const liquidityTransformerContract = await this.contractService.getContractObject(LiquidityTransformer);
            if (liquidityTransformerContract) {
                this.spinnerService.show();
                const referralAccountNo = this.getReferralAccountNo();
                const etherAmount = this.contractService.convertAmountInSmallUnit(amount);

                liquidityTransformerContract.methods.reserveGrise(slotNos, referralAccountNo)
                    .send({ value: etherAmount, from: this.contractService.accountNo })
                    .then((response: any) => {
                        // console.log("transaction successful.", response);
                        this.localDataUpdateService.forceUpdateSlotsReservationData(true);
                        this.localDataUpdateService.forceUpdateWalletBalanceData(true);
                        this.toastr.success('Transaction successful.');
                        this.spinnerService.hide();
                    })
                    .catch((error: any) => {
                        // console.log("error", error);
                        this.toastr.error('Transaction failed. Try again!');
                        this.spinnerService.hide();
                    });
            }
        } catch (ex) { }
    }

    async addReservationWithToken(tokenAddress: string, slotNos: number[], coinAmount: string) {
        try {
            const liquidityTransformerContract = await this.contractService.getContractObject(LiquidityTransformer);
            if (liquidityTransformerContract) {
                this.spinnerService.show();
                const referralAccountNo = this.getReferralAccountNo();

                liquidityTransformerContract.methods.reserveGriseWithToken(tokenAddress, coinAmount, slotNos, referralAccountNo)
                    .send({ from: this.contractService.accountNo })
                    .then((response: any) => {
                        // console.log("transaction successful.", response);
                        this.localDataUpdateService.forceUpdateSlotsReservationData(true);
                        this.localDataUpdateService.forceUpdateWalletBalanceData(true);
                        this.toastr.success('Transaction successful.');
                        this.spinnerService.hide();
                    })
                    .catch((error: any) => {
                        // console.log("error", error);
                        this.toastr.error('Transaction failed. Try again!');
                        this.spinnerService.hide();
                    });
            }
        } catch (ex) { }
    }

    getReferralAccountNo(): string {
        let referralAccountNo = this.contractService.referralAccountNo;
        if (referralAccountNo == this.contractService.accountNo.toString()) {
            referralAccountNo = this.contractService.blankReferralAccountNo;
        }

        return referralAccountNo;
    }

    async getPersonalReferralData() {
        try {
            const liquidityTransformerContract = await this.contractService.getContractObject(LiquidityTransformer);
            if (liquidityTransformerContract) {
                let personalReferralData: PersonalReferralData;
                const accountNo = this.contractService.accountNo;
                if (accountNo) {
                    let referralAmount = await liquidityTransformerContract.methods.referralAmount(accountNo).call();
                    const referralTokens = await liquidityTransformerContract.methods.referralTokens(accountNo).call();

                    referralAmount = this.contractService.convertAmountInBigUnit(referralAmount);
                    personalReferralData = {
                        referralAmount,
                        referralTokens
                    };
                } else {
                    personalReferralData = {
                        referralAmount: 0,
                        referralTokens: 0
                    };
                }
                return personalReferralData;
            }
        } catch (ex) { }
        return null;
    }

    async getClaimableAmount() {
        try {
            const liquidityTransformerContract = await this.contractService.getContractObject(LiquidityTransformer);
            if (liquidityTransformerContract) {
                // let test1 = await liquidityTransformerContract.methods.investmentsOnAllDays().call();
                // console.log(test1);
                let claimableAmount = await liquidityTransformerContract.methods.myClaimAmountAllDays().call({ from: this.contractService.accountNo });
                let claimableAmountOtherData = await liquidityTransformerContract.methods.g().call();

                claimableAmount = this.contractService.convertAmountInBigUnit(claimableAmount);
                claimableAmountOtherData.totalReferralTokens = this.contractService.convertAmountInBigUnit(claimableAmountOtherData.totalReferralTokens);
                claimableAmountOtherData.totalTransferTokens = this.contractService.convertAmountInBigUnit(claimableAmountOtherData.totalTransferTokens);
                claimableAmountOtherData.totalWeiContributed = this.contractService.convertAmountInBigUnit(claimableAmountOtherData.totalWeiContributed);

                const claimableAmountData: ClaimableAmountData = {
                    claimableAmount: claimableAmount,
                    generatedDays: +claimableAmountOtherData.generatedDays,
                    preparedReferrals: +claimableAmountOtherData.preparedReferrals,
                    totalReferralTokens: claimableAmountOtherData.totalReferralTokens,
                    totalTransferTokens: claimableAmountOtherData.totalTransferTokens,
                    totalWeiContributed: claimableAmountOtherData.totalWeiContributed,
                };
                return claimableAmountData;
            }
        } catch (ex) { }
        return null;
    }

    async claimGriseToken() {
        try {
            const liquidityTransformerContract = await this.contractService.getContractObject(LiquidityTransformer);
            if (liquidityTransformerContract) {
                this.spinnerService.show();
                liquidityTransformerContract.methods.getMyTokens()
                    .send({ from: this.contractService.accountNo })
                    .then((response: any) => {
                        // console.log("transaction successful.", response);
                        this.localDataUpdateService.forceUpdateClaimableAmountData(true);
                        this.toastr.success('Transaction successful.');
                        this.spinnerService.hide();
                    })
                    .catch((error: any) => {
                        // console.log("error", error);
                        this.toastr.error('Transaction failed. Try again!');
                        this.spinnerService.hide();
                    });
            }
        } catch (ex) { }
    }    

    async getSupplyOnAllDays() {
        try {
            const liquidityTransformerContract = await this.contractService.getContractObject(LiquidityTransformer);
            if (liquidityTransformerContract) {
                let supplyOnAllDays = await liquidityTransformerContract.methods.supplyOnAllDays().call();
                
                const rtnSupplyOnAllDays: number[] = [];
                supplyOnAllDays.forEach((invertOnDay: any) => {
                    rtnSupplyOnAllDays.push(this.contractService.convertAmountInBigUnit(invertOnDay));                
                });
                return rtnSupplyOnAllDays;
            }
        } catch (ex) { }
        return null;
    }
}
