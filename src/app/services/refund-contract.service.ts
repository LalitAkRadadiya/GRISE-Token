import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import * as RefundSponsor from '../../abis/liquidity/RefundSponsor.json';
import { SpinnerService } from '../helper/spinner/spinner.service';
import { RefundHistoryData } from '../models/refund-history-data';
import { ContractService } from './contract.service';

@Injectable({ providedIn: 'root' })
export class RefundContractService {

    private claimGasFeeRefundUpdate = new BehaviorSubject<boolean>(false);
    isClaimGasFeeRefundUpdated = this.claimGasFeeRefundUpdate.asObservable();

    constructor(private contractService: ContractService,
                private toastr: ToastrService,
                private spinnerService: SpinnerService) { }

    async getRefundHistoryData() {
        try {
            const refundSponsorContract = await this.contractService.getContractObject(RefundSponsor);
            if (refundSponsorContract) {
                // let sponsoredAmount = await refundSponsorContract.methods.sponsoredAmount(refundSponsorContract._address).call();
                const sponsoredAmount = await this.contractService.getAccountBalance(refundSponsorContract._address);
                let myRefundAmount = await refundSponsorContract.methods.myRefundAmount().call({ from: this.contractService.accountNo });

                myRefundAmount = this.contractService.convertAmountInBigUnit(myRefundAmount);

                const griseReservationData: RefundHistoryData = {
                    sponsoredAmount,
                    myRefundAmount
                };
                return griseReservationData;
            }
        } catch (ex) { }
        return null;
    }

    async claimGasFeeRefund() {
        try {
            const refundSponsorContract = await this.contractService.getContractObject(RefundSponsor);
            if (refundSponsorContract) {
                this.spinnerService.show();
                refundSponsorContract.methods.requestGasRefund()
                    .send({ from: this.contractService.accountNo })
                    .then((response: any) => {
                        // console.log("transaction successful.", response);
                        this.claimGasFeeRefundUpdate.next(true);
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
}
