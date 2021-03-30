import { environment as env } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GraphDataService {

    graphAPIBaseUrl = env.graphAPIBaseUrl;

    constructor(private httpClient: HttpClient) { }

    getEthPrice(): Observable<any> {
        return this.httpClient.post(this.graphAPIBaseUrl,
            {
                query: `{ bundle(id: 1) { ethPrice }}`
            });
    }

    getTotalLiquidity(address: string): Observable<any> {
        return this.httpClient.post(this.graphAPIBaseUrl,
            {
                query: `{ token(id: \"${address}\") { derivedETH totalLiquidity } }`
            });
    }

    getTokenInititalDayDatas(address: string, fromDate: number): Observable<any> {
        return this.httpClient.post(this.graphAPIBaseUrl,
            {
                query: `{ tokenDayDatas(where: { token: \"${address}\", date: ${fromDate} }) { date priceUSD } }`
            });
    }

    getTokenDayDatas(address: string, fromDate: number): Observable<any> {
        return this.httpClient.post(this.graphAPIBaseUrl,
            {
                query: `{ tokenDayDatas(where: { token: \"${address}\", date_gt: ${fromDate} }) { date priceUSD token{derivedETH} } }`
            });
    }

    getMarketCapData(address: string): Observable<any> {
        return this.httpClient.post(this.graphAPIBaseUrl,
            {
                query: `{ pairs(where: { id: \"${address}\" }) { id totalSupply reserve0 reserve1 token0{name,totalSupply} token1{name} } }`
            });
    }
}
