import { environment as env } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

declare let Web3: any;
declare let window: any;

@Injectable({ providedIn: 'root' })
export class ContractService {

    isLogin = false;
    accountNo = 0;
    totalBalance = 0;
    totalGriseBalance = 0;
    referralAccountNo: string;
    blankReferralAccountNo: string;
    sponsorAccountNo: string;
    liquidityAccountNo: string;
    griseAccountNo: string;

    constructor(private toastrService: ToastrService) {
        this.loadWeb3();
        this.blankReferralAccountNo = '0x0000000000000000000000000000000000000000';
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
        else {
            this.toastrService.error('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    }

    async getContractObject(currentAbis: any): Promise<any> {
        try {
            const web3 = window.web3;

            if (web3 != undefined && web3 != null) {
                const networkId = await web3.eth.net.getId();
                const networks: { [key: string]: any } = currentAbis.default.networks;
                const contractData = networks[networkId];
                if (contractData) {
                    return new web3.eth.Contract(currentAbis.default.abi, contractData.address);
                    // setHomeContract(hdc);
                } else {
                    this.toastrService.error('Contract not deployed to detected network.');
                }
            }
        } catch (ex) {
            this.toastrService.error(ex);
        }
        return null;
    }

    convertAmountInBigUnit(smallUnit: number): number {
        const web3 = window.web3;

        if (web3 != undefined && web3 != null) {
            return +web3.utils.fromWei(smallUnit, 'Ether');
        }
        return smallUnit;
    }

    convertAmountInSmallUnit(bigUnit: number) {
        const web3 = window.web3;

        if (web3 != undefined && web3 != null) {
            return web3.utils.toWei(bigUnit.toString(), 'Ether');
        }
        return bigUnit;
    }

    async getAccountInfo() {
        try {
            const web3 = window.web3;

            if (web3 != undefined && web3 != null) {
                const acc = await web3.eth.getAccounts();
                const balance = await web3.eth.getBalance(acc[0]);
                this.accountNo = acc[0];
                this.totalBalance = +await web3.utils.fromWei(balance);
                return true;
            }
        } catch (ex) { }
        return false;
    }

    async getAccountBalance(accountNo: string) {
        try {
            const web3 = window.web3;

            if (web3 != undefined && web3 != null) {
                let balance = await web3.eth.getBalance(accountNo);
                balance = await web3.utils.fromWei(balance);
                return +balance;
            }
        } catch (ex) { }
        return 0;
    }

    async connectToWallet() {
        this.isLogin = await this.getAccountInfo();
    }
}
