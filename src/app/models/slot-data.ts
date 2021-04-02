export enum SlotType {
    Fixed = 1,
    Random = 2
}

export class SlotData {
    id: number;
    name: string;
    type: SlotType;
    color: string;
    day?: number;
    hours?: number;
    startDate?: Date;
    endDate?: Date;
    option?: string;
    slotLeft?: number;
    totalInvest?: number;
    myContribution?: number;
    mySharePercent?: string;
    timeLeft?: string;
    progressDone?: number;
    isSelected: boolean;
    isExpired: boolean;
    validationText?: string;
    nftDetail? : string;
}
