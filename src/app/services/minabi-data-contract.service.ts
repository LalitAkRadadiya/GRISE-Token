import { Injectable } from '@angular/core';
import { ChainId, Fetcher, Route, WETH } from '@uniswap/sdk';
import { SpinnerService } from '../helper/spinner/spinner.service';
import { ExchangeRateData } from '../models/exchage-rate-data';
import { OtherTokenBalanceData } from '../models/other-token-balance-data';
import { environment as env } from './../../environments/environment';
import { ContractService } from './contract.service';
import { LocalDataUpdateService } from './local-data-update.service';

declare let Web3: any;
declare let window: any;

@Injectable({ providedIn: 'root' })
export class MinAbiDataContractService {

    minABI = [
        // balanceOf
        {
            constant: true,
            inputs: [{ name: '_owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ name: 'balance', type: 'uint256' }],
            type: 'function'
        },
        // decimals
        {
            constant: true,
            inputs: [],
            name: 'decimals',
            outputs: [{ name: '', type: 'uint8' }],
            type: 'function'
        },
        // approve
        {
            constant: true,
            inputs: [{ name: '', type: 'address' }, { name: '', type: 'uint256' }],
            name: 'approve',
            outputs: [{ name: '', type: 'bool' }],
            type: 'function'
        }
    ];

    chainId = ChainId.ROPSTEN;

    constructor(private contractService: ContractService,
                private localDataUpdateService: LocalDataUpdateService,
                private spinnerService: SpinnerService) { }

    setChainId() {
        this.chainId = env.production ? ChainId.MAINNET : ChainId.ROPSTEN;
    }

    async getTokenExchangeRate(tokenAddress: string) {
        try {
            this.spinnerService.show();
            const otherCoin = await Fetcher.fetchTokenData(this.chainId, tokenAddress);
            const weth = WETH[this.chainId];
            const pair = await Fetcher.fetchPairData(otherCoin, weth);
            const route = new Route([pair], weth);
            const regularRate = +route.midPrice.toSignificant(6);
            const reverseRate = +route.midPrice.invert().toSignificant(6);
            const reverseRateWithoutDecimal = this.contractService.convertAmountInSmallUnit(reverseRate);

            const exchangeRateData: ExchangeRateData = {
                regularRate,
                reverseRate,
                reverseRateWithoutDecimal
            };
            this.spinnerService.hide();
            return exchangeRateData;
        } catch (ex) { }
        this.spinnerService.hide();
        return null;
    }

    async getOtherTokenBalance(tokenAddress: string) {
        try {
            window.web3 = new Web3(window.ethereum);
            const web3 = window.web3;
            if (typeof (web3) != 'undefined' && web3 != null) {
                const minABIContract = new web3.eth.Contract(this.minABI, tokenAddress);
                const tokenLargeBalance = await minABIContract.methods.balanceOf(this.contractService.accountNo).call();
                const decimalPlaces = await minABIContract.methods.decimals().call();
                const tokenShortBalance = tokenLargeBalance / (10 ** decimalPlaces);
                const exchangeRateData = await this.getTokenExchangeRate(tokenAddress);

                const otherTokenBalanceData: OtherTokenBalanceData = {
                    tokenLargeBalance: +tokenLargeBalance,
                    decimalPlaces: +decimalPlaces,
                    tokenShortBalance,
                    regularRate: exchangeRateData ? exchangeRateData.regularRate : 1,
                    reverseRate: exchangeRateData ? exchangeRateData.reverseRate : 1
                };
                return otherTokenBalanceData;
            }
        } catch (ex) { }
        return null;
    }

    async getTransactionApproval(tokenAddress: string, transactionAmount: string) {
        try {
            window.web3 = new Web3(window.ethereum);
            const web3 = window.web3;
            // Get ERC20 Token contract instance
            if (typeof (web3) != 'undefined' && web3 != null) {
                const minABIContract = new web3.eth.Contract(this.minABI, tokenAddress);
                this.spinnerService.show();
                minABIContract.methods.approve(this.contractService.liquidityAccountNo, transactionAmount)
                    .send({ from: this.contractService.accountNo })
                    .then((response: any) => {
                        // console.log("transaction successful.", response);
                        this.localDataUpdateService.updateTransactionApproved(true);
                        this.spinnerService.hide();
                    })
                    .catch((error: any) => {
                        // console.log("error", error);
                        this.spinnerService.hide();
                    });
            }
        } catch (ex) { }
        return null;
    }
}
