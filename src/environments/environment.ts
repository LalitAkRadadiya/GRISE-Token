// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  graphAPIBaseUrl: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  tokenDayDataAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
  marketCapPairAddress: '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11',
  initialTimeStamp: 1614556800,
  allOtherCoins: [
    { name: 'ETH', tokenAddress: '' },
    { name: 'Dai', tokenAddress: '0xaD6D458402F60fD3Bd25163575031ACDce07538D' },
    { name: 'Uniswap', tokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' },
    { name: 'Compound', tokenAddress: '0x1Fe16De955718CFAb7A44605458AB023838C2793' }
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
