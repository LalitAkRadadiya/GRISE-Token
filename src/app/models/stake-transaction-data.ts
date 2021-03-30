import { StakeTransactionBasicData } from './stake-transaction-basic-data';
import { StakeTransactionRewardData } from './stake-transaction-reward-data';

export class StakeTransactionData {
    stakeId: string;
    stakeBasicData?: StakeTransactionBasicData;
    stakeRewardData?: StakeTransactionRewardData;
    stakeCreatedOn?: Date;
    stakeLockUpOn?: Date;
    stakeLockUpDaysLeft?: number;
    stakeProgress?: number;
    stakeTypeName?: string;
    stakeScrapeOn?: Date;
    stakeCloseOn?: Date;
}
