import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as StakingToken from '../../abis/stake/StakingToken.json';
import { SpinnerService } from '../helper/spinner/spinner.service';
import { StakeCountData } from '../models/stake-count-data';
import { StakeSlotLeftData } from '../models/stake-slot-left-data';
import { StakeTransactionBasicData } from '../models/stake-transaction-basic-data';
import { StakeTransactionRewardData } from '../models/stake-transaction-reward-data';
import { ContractService } from './contract.service';
import { LocalDataUpdateService } from './local-data-update.service';

@Injectable({ providedIn: 'root' })
export class StakingTokenContractService {

    constructor(private contractService: ContractService,
                private toastr: ToastrService,
                private localDataUpdateService: LocalDataUpdateService,
                private spinnerService: SpinnerService) { }

    async getStakeSlotsLeftData() {
        try {
            const stakingTokenContract = await this.contractService.getContractObject(StakingToken);
            if (stakingTokenContract) {
                const slotLefts = await stakingTokenContract.methods.getSlotLeft().call();

                const stakeSlotLeftData: StakeSlotLeftData = {
                    stSlotLeft: +slotLefts.STSlotLeft,
                    mt3MonthSlotLeft: +slotLefts.MT3MonthSlotLeft,
                    mt6MonthSlotLeft: +slotLefts.MT6MonthSlotLeft,
                    mt9MonthSlotLeft: +slotLefts.MT9MonthSlotLeft,
                    ltSlotLeft: +slotLefts.LTSlotLeft,
                    mtSlotLeft: 0,
                    totalSlotLeft: 0
                };
                stakeSlotLeftData.mtSlotLeft = stakeSlotLeftData.mt3MonthSlotLeft + stakeSlotLeftData.mt6MonthSlotLeft + stakeSlotLeftData.mt9MonthSlotLeft;
                stakeSlotLeftData.totalSlotLeft = stakeSlotLeftData.stSlotLeft + stakeSlotLeftData.mtSlotLeft + stakeSlotLeftData.ltSlotLeft;
                return stakeSlotLeftData;
            }
        } catch (ex) { }
        return null;
    }

    async getStakeCountData() {
        try {
            const stakingTokenContract = await this.contractService.getContractObject(StakingToken);
            if (stakingTokenContract) {
                const stakeCounts = await stakingTokenContract.methods.getStakeCount().call();

                const stakeCountData: StakeCountData = {
                    stStakeCount: +stakeCounts.STStakeCount,
                    mt3MonthStakeCount: +stakeCounts.MT3MonthStakeCount,
                    mt6MonthStakeCount: +stakeCounts.MT6MonthStakeCount,
                    mt9MonthStakeCount: +stakeCounts.MT9MonthStakeCount,
                    ltStakeCount: +stakeCounts.LTStakeCount,
                    mtStakeCount: 0,
                    totalStakeCount: 0
                };
                stakeCountData.mtStakeCount = stakeCountData.mt3MonthStakeCount + stakeCountData.mt6MonthStakeCount + stakeCountData.mt9MonthStakeCount;
                stakeCountData.totalStakeCount = stakeCountData.stStakeCount + stakeCountData.mtStakeCount + stakeCountData.ltStakeCount;
                return stakeCountData;
            }
        } catch (ex) { }
        return null;
    }

    async createStakeGrise(amount: number, stakeType: number, days: number) {
        try {
            const stakingTokenContract = await this.contractService.getContractObject(StakingToken);
            if (stakingTokenContract) {
                this.spinnerService.show();
                const etherAmount = this.contractService.convertAmountInSmallUnit(amount);

                stakingTokenContract.methods.createStake(etherAmount, stakeType, days)
                    .send({ from: this.contractService.accountNo })
                    .then((response: any) => {
                        // console.log("transaction successful.", response);
                        this.localDataUpdateService.forceUpdateStakeTransactionsData(true);
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

    async createStakeWithETH(amount: number, stakeType: number, days: number, etherAmount: string) {
        try {
            const stakingTokenContract = await this.contractService.getContractObject(StakingToken);
            if (stakingTokenContract) {
                this.spinnerService.show();
                const tokenAmount = this.contractService.convertAmountInSmallUnit(amount);

                stakingTokenContract.methods.createStakeWithETH(tokenAmount, stakeType, days)
                    .send({ from: this.contractService.accountNo, value: etherAmount })
                    .then((response: any) => {
                        // console.log("transaction successful.", response);
                        this.localDataUpdateService.forceUpdateStakeTransactionsData(true);
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

    async getStakesPagination(pageNo: number, perPageRecords: number) {
        try {
            const stakingTokenContract = await this.contractService.getContractObject(StakingToken);
            if (stakingTokenContract) {
                const stakeIds = await stakingTokenContract.methods.stakesPagination(this.contractService.accountNo, pageNo, perPageRecords).call();
                return stakeIds;
            }
        } catch (ex) { }
        return null;
    }

    async checkStakeByID(stakeId: string) {
        try {
            const stakingTokenContract = await this.contractService.getContractObject(StakingToken);
            if (stakingTokenContract) {
                const stakeData = await stakingTokenContract.methods.checkStakeByID(this.contractService.accountNo, stakeId).call();
                stakeData.stakedAmount = this.contractService.convertAmountInBigUnit(stakeData.stakedAmount);
                stakeData.penaltyAmount = this.contractService.convertAmountInBigUnit(stakeData.penaltyAmount);

                const stakeBasicData: StakeTransactionBasicData = {
                    startDay: stakeData.startDay,
                    lockDays: stakeData.lockDays,
                    finalDay: stakeData.finalDay,
                    scrapeDay: stakeData.scrapeDay,
                    closeDay: stakeData.closeDay,
                    stakeType: stakeData.stakeType,
                    isActive: stakeData.isActive,
                    isMature: stakeData.isMature,
                    stakedAmount: stakeData.stakedAmount,
                    penaltyAmount: stakeData.penaltyAmount
                };
                return stakeBasicData;
            }
        } catch (ex) { }
        return null;
    }

    async checkStakeRewards(stakeId: string) {
        try {
            const stakingTokenContract = await this.contractService.getContractObject(StakingToken);
            if (stakingTokenContract) {
                const stakeData = await stakingTokenContract.methods.checkStakeRewards(this.contractService.accountNo, stakeId).call();
                stakeData.transcRewardAmount = this.contractService.convertAmountInBigUnit(stakeData.transcRewardAmount);
                stakeData.penaltyRewardAmount = this.contractService.convertAmountInBigUnit(stakeData.penaltyRewardAmount);
                stakeData.reservoirRewardAmount = this.contractService.convertAmountInBigUnit(stakeData.reservoirRewardAmount);
                stakeData.inflationRewardAmount = this.contractService.convertAmountInBigUnit(stakeData.inflationRewardAmount);

                const stakeRewardData: StakeTransactionRewardData = {
                    transcRewardAmount: stakeData.transcRewardAmount,
                    penaltyRewardAmount: stakeData.penaltyRewardAmount,
                    reservoirRewardAmount: stakeData.reservoirRewardAmount,
                    // inflationRewardAmount: stakeData.inflationRewardAmount
                    inflationRewardAmount: 0
                };
                return stakeRewardData;
            }
        } catch (ex) { }
        return null;
    }

    async scrapeReward(stakeId: string) {
        try {
            const stakingTokenContract = await this.contractService.getContractObject(StakingToken);
            if (stakingTokenContract) {
                this.spinnerService.show();
                stakingTokenContract.methods.scrapeReward(stakeId)
                    .send({ from: this.contractService.accountNo })
                    .then((response: any) => {
                        // console.log("transaction successful.", response);
                        this.localDataUpdateService.forceUpdateStakePaginationData(stakeId);
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

    async endStake(stakeId: string) {
        try {
            const stakingTokenContract = await this.contractService.getContractObject(StakingToken);
            if (stakingTokenContract) {
                this.spinnerService.show();
                stakingTokenContract.methods.endStake(stakeId)
                    .send({ from: this.contractService.accountNo })
                    .then((response: any) => {
                        // console.log("transaction successful.", response);
                        this.localDataUpdateService.forceUpdateStakePaginationData(stakeId);
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

    async getTotalStakedToken() {
        try {
            const stakingTokenContract = await this.contractService.getContractObject(StakingToken);
            if (stakingTokenContract) {
                let totalStakedToken = await stakingTokenContract.methods.getTotalStakedToken().call();
                totalStakedToken = this.contractService.convertAmountInBigUnit(totalStakedToken);
                return totalStakedToken;
            }
        } catch (ex) { }
        return null;
    }
}
