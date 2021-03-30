import { Component, OnInit } from '@angular/core';
import { RefundHistoryData } from 'src/app/models/refund-history-data';
import { RefundContractService } from 'src/app/services/refund-contract.service';

@Component({
  selector: 'app-refund-history',
  templateUrl: './refund-history.component.html',
  styleUrls: ['./refund-history.component.scss']
})
export class RefundHistoryComponent implements OnInit {

  refundHistoryData: RefundHistoryData;

  constructor(private refundContractService: RefundContractService) { }

  ngOnInit(): void {
    this.refundContractService.isClaimGasFeeRefundUpdated.subscribe(() =>
      this.refundContractService.getRefundHistoryData().then(value => this.refundHistoryData = value!)
    );
  }

  claimGasFeeRefund() {
    if (this.refundHistoryData?.myRefundAmount > 0) {
      this.refundContractService.claimGasFeeRefund();
    }
  }

}
