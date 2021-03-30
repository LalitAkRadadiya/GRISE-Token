import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { GraphTableData } from 'src/app/models/graph-table-data';
import { GraphDataService } from 'src/app/services/graph-data.service';
import { SharedService } from 'src/app/services/shared.service';
import { StakingTokenContractService } from 'src/app/services/staking-token-contract.service';
import { environment as env } from './../../../../environments/environment';
import { GriseTokenContractService } from './../../../services/grise-token-contract.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, OnDestroy {

  tokenDayDataAddress = env.tokenDayDataAddress;
  marketCapPairAddress = env.marketCapPairAddress;

  lineChartData: ChartDataSets[] = [];
  lineChartLabels: Label[] = [];
  lineChartOptions = {
    scales: {
      yAxes: [{ ticks: { fontColor: 'white' } }],
      xAxes: [{ ticks: { fontColor: 'white' } }]
    },
    legend: { labels: { fontColor: 'white' }, data: { fontColor: 'white' } },
    responsive: true,
  };
  lineChartColors: Color[] = [{ borderColor: 'white', backgroundColor: 'grey', borderWidth: 2 }];
  lineChartPlugins = [];

  ethPrice: number;
  tokenDayDatas: any[];
  marketCapData: any;
  usdGraphTableData = new GraphTableData();
  ethGraphTableData = new GraphTableData();
  tokenLocked: number;
  tokenCirculating: number;
  totalStakedToken: number;
  totalGriseSupply: number;
  intervalId: any;
  initialDayPriceUSD: number;

  constructor(private graphDataService: GraphDataService,
    private sharedService: SharedService,
    private stakingTokenContractService: StakingTokenContractService,
    private griseTokenContractService: GriseTokenContractService) { }

  ngOnInit(): void {
    this.getInitialDayData();
    this.refreshData();
    // this.setRefreshDataTimer();

    // this.graphDataService.getTotalLiquidity("0x6b175474e89094c44da98b954eedeac495271d0f").subscribe(data => {
    //   console.log(data);
    // });
  }

  refreshData() {
    this.griseTokenContractService.getTotalSupply().then(totalSupply => this.totalGriseSupply = totalSupply);
    this.stakingTokenContractService.getTotalStakedToken().then(stakedToken => this.totalStakedToken = stakedToken);
    this.getEthPrice();
    this.getChartData();
  }

  setRefreshDataTimer() {
    this.intervalId = setInterval(() => {
      this.refreshData();
    }, 30000);
  }

  getEthPrice() {
    this.graphDataService.getEthPrice().subscribe(priceData => {
      this.ethPrice = priceData.data.bundle.ethPrice;
    });
  }

  getInitialDayData() {
    const initialTimeStamp = env.initialTimeStamp;
    this.graphDataService.getTokenInititalDayDatas(this.tokenDayDataAddress, initialTimeStamp).subscribe(initData => {
      if (initData.data) {
        this.initialDayPriceUSD = +initData.data.tokenDayDatas[0].priceUSD;
      }
    });
  }

  getChartData() {
    const today = this.sharedService.getDateWithoutTime(new Date());
    const startDateTimestamp = this.sharedService.getDateAdd(today.getTime(), -7).getTime() / 1000;
    this.graphDataService.getTokenDayDatas(this.tokenDayDataAddress, startDateTimestamp).subscribe(chartData => {
      if (chartData.data) {
        this.tokenDayDatas = chartData.data.tokenDayDatas;
        const priceUSDList = this.tokenDayDatas.map(data => data.priceUSD);
        const dateList = this.tokenDayDatas.map(data => new Date(data.date * 1000).toDateString());

        this.lineChartLabels = [];
        this.lineChartData = [];
        this.lineChartLabels.push(...dateList);
        this.lineChartData.push({ data: priceUSDList, label: 'Price USD' });

        this.getMarketCapData();
      }
    });
  }

  getMarketCapData() {
    this.graphDataService.getMarketCapData(this.marketCapPairAddress).subscribe(marketData => {
      if (marketData.data) {
        this.marketCapData = marketData.data.pairs[0];
        this.calcUSDTableData();
      }
    });
  }

  calcUSDTableData() {
    if (this.tokenDayDatas != undefined && this.marketCapData != undefined) {
      this.usdGraphTableData.initialPrice = this.initialDayPriceUSD;
      this.usdGraphTableData.currentPrice = +this.tokenDayDatas[this.tokenDayDatas.length - 1].priceUSD;
      this.usdGraphTableData.roiOnInitalPrice = (this.usdGraphTableData.currentPrice - this.usdGraphTableData.initialPrice) / this.usdGraphTableData.initialPrice;
      this.usdGraphTableData.factorOnInitialPrice = this.usdGraphTableData.currentPrice / this.usdGraphTableData.initialPrice;

      this.tokenLocked = +this.marketCapData.reserve0;
      this.tokenCirculating = Math.abs(this.totalGriseSupply - this.tokenLocked);

      this.usdGraphTableData.totalMarketCap = (this.tokenLocked + this.tokenCirculating + this.totalStakedToken) * this.usdGraphTableData.currentPrice;
      this.usdGraphTableData.circulatingSupply = (this.tokenCirculating + this.totalStakedToken) * this.usdGraphTableData.currentPrice;
      this.calcETHTableData();
    }
  }

  calcETHTableData() {
    if (this.usdGraphTableData) {
      this.ethGraphTableData.initialPrice = this.usdGraphTableData.initialPrice / this.ethPrice;
      this.ethGraphTableData.currentPrice = this.usdGraphTableData.currentPrice / this.ethPrice;
      this.ethGraphTableData.roiOnInitalPrice = (this.ethGraphTableData.currentPrice - this.ethGraphTableData.initialPrice) / this.ethGraphTableData.initialPrice;
      this.ethGraphTableData.factorOnInitialPrice = this.ethGraphTableData.currentPrice / this.ethGraphTableData.initialPrice;
      this.ethGraphTableData.totalMarketCap = this.usdGraphTableData.totalMarketCap / this.ethPrice;
      this.ethGraphTableData.circulatingSupply = this.usdGraphTableData.circulatingSupply / this.ethPrice;
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
