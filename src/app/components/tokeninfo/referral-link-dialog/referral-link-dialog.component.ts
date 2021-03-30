import { ContractService } from './../../../services/contract.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-referral-link-dialog',
  templateUrl: './referral-link-dialog.component.html',
  styleUrls: ['./referral-link-dialog.component.scss']
})
export class ReferralLinkDialogComponent implements OnInit {

  referralUrl: string;
  urlCopied = false;

  constructor(public dialogRef: MatDialogRef<ReferralLinkDialogComponent>,
              private contractService: ContractService) { }

  ngOnInit() {
    const parsedUrl = new URL(window.location.href);
    const baseUrl = parsedUrl.origin;
    this.referralUrl = baseUrl + '/home?referralCode=' + this.contractService.accountNo;
  }

  copyUrl() {
    this.urlCopied = true;
  }

  onClose() {
    this.dialogRef.close();
  }
}
