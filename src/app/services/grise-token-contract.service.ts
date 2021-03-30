import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import * as GriseToken from '../../abis/token/GriseToken.json';
import { SpinnerService } from '../helper/spinner/spinner.service';
import { LaunchTimeData } from '../models/launch-time-data';
import { ContractService } from './contract.service';

@Injectable({ providedIn: 'root' })
export class GriseTokenContractService {

    private claimTokenHolderTransactionRewardData = new BehaviorSubject<boolean>(false);
    isClaimTokenHolderTransactionRewardDataUpdated = this.claimTokenHolderTransactionRewardData.asObservable();

    constructor(private contractService: ContractService,
        private toastr: ToastrService,
        private spinnerService: SpinnerService) { }

    async assignGriseAccountNo() {
        try {
            const griseTokenContract = await this.contractService.getContractObject(GriseToken);
            if (griseTokenContract) {
                this.contractService.griseAccountNo = griseTokenContract._address;
            }
        } catch (ex) { }
    }

    // async getGrise() {
    //     try {
    //         const web3 = window.web3;

    //         if (web3 != undefined && web3 != null) {
    //             const networkId = await web3.eth.net.getId();
    //             const networks: { [key: string]: any } = GriseToken.networks;
    //             const griseTokenData = networks[networkId];
    //             if (griseTokenData) {
    //                 const griseContract = new web3.eth.Contract(GriseToken.abi, griseTokenData.address);
    //                 // setHomeContract(hdc);

    //                 const griseName = await griseContract.methods.name().call();
    //                 const griseSymbol = await griseContract.methods._getNow().call();
    //                 console.log('Name', griseName, ' => Symbol', griseSymbol);
    //             }
    //         }
    //     } catch (ex) { }
    // }

    async getLaunchTime() {
        try {
            const griseTokenContract = await this.contractService.getContractObject(GriseToken);
            if (griseTokenContract) {
                const launchTime = await griseTokenContract.methods.getLaunchTime().call();
                const lpLaunchTime = await griseTokenContract.methods.getLPLaunchTime().call();
                const launchTimeData: LaunchTimeData = {
                    launchTime: +launchTime * 1000,
                    lpLaunchTime: +lpLaunchTime * 1000
                }
                return launchTimeData;
            }
        } catch (ex) { }
        return null;
    }

    async getGriseBalance() {
        try {
            const griseTokenContract = await this.contractService.getContractObject(GriseToken);
            if (griseTokenContract) {
                let griseBalance = await griseTokenContract.methods.balanceOf(this.contractService.accountNo).call();
                griseBalance = this.contractService.convertAmountInBigUnit(griseBalance);
                this.contractService.totalGriseBalance = griseBalance;
                return griseBalance;
            }
        } catch (ex) { }
        return null;
    }

    async getTokenHolderTransactionReward() {
        try {
            const griseTokenContract = await this.contractService.getContractObject(GriseToken);
            if (griseTokenContract) {
                let tokenHolderTransactionReward = await griseTokenContract.methods.viewTokenHolderTranscReward().call({ from: this.contractService.accountNo });
                tokenHolderTransactionReward = this.contractService.convertAmountInBigUnit(tokenHolderTransactionReward);
                return tokenHolderTransactionReward;
            }
        } catch (ex) { }
        return null;
    }

    async getTimeToClaimWeeklyReward() {
        try {
            const griseTokenContract = await this.contractService.getContractObject(GriseToken);
            if (griseTokenContract) {
                const timeToClaimWeeklyReward = await griseTokenContract.methods.timeToClaimWeeklyReward().call();
                return timeToClaimWeeklyReward;
            }
        } catch (ex) { }
        return null;
    }

    async claimTokenHolderTransactionReward() {
        try {
            const griseTokenContract = await this.contractService.getContractObject(GriseToken);
            if (griseTokenContract) {
                this.spinnerService.show();
                griseTokenContract.methods.claimTokenHolderTranscReward()
                    .send({ from: this.contractService.accountNo })
                    .then((response: any) => {
                        // console.log("transaction successful.", response);
                        this.claimTokenHolderTransactionRewardData.next(true);
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

    async timeToClaimWeeklyReward() {
        try {
            const griseTokenContract = await this.contractService.getContractObject(GriseToken);
            if (griseTokenContract) {
                const daysLeft = await griseTokenContract.methods.timeToClaimWeeklyReward().call();
                return daysLeft;
            }
        } catch (ex) { }
        return null;
    }

    async timeToClaimMonthlyReward() {
        try {
            const griseTokenContract = await this.contractService.getContractObject(GriseToken);
            if (griseTokenContract) {
                const daysLeft = await griseTokenContract.methods.timeToClaimMonthlyReward().call();
                return daysLeft;
            }
        } catch (ex) { }
        return null;
    }

    async getTotalSupply() {
        try {
            const griseTokenContract = await this.contractService.getContractObject(GriseToken);
            if (griseTokenContract) {
                let totalSupply = await griseTokenContract.methods.totalSupply().call();
                totalSupply = this.contractService.convertAmountInBigUnit(totalSupply);
                return totalSupply;
            }
        } catch (ex) { }
        return null;
    }
}
