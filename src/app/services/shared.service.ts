import { LocalDataUpdateService } from './local-data-update.service';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { PersonalPeriodStakeSetup } from '../models/personal-period-stake-setup';
import { SlotData } from '../models/slot-data';
import { SlotType } from './../models/slot-data';
import { GriseTokenContractService } from './grise-token-contract.service';
import { LiquidityContractService } from './liquidity-contract.service';
import { StakingTokenContractService } from './staking-token-contract.service';

@Injectable({ providedIn: 'root' })
export class SharedService {
    // startTimeJS = new Date('Mar 12, 2021 08:00:00').getTime();
    launchTime = 0;
    startTime = 0;
    endTime = 0;
    allSlots: SlotData[];
    intervalId: any;
    allPersonalPeriodStakes: PersonalPeriodStakeSetup[];

    constructor(private liquidityContractService: LiquidityContractService,
        private stakingTokenContractService: StakingTokenContractService,
        private griseTokenContractService: GriseTokenContractService,
        private localDataUpdateService: LocalDataUpdateService) {
        this.getLaunchTime();
    }

    getLaunchTime() {
        this.griseTokenContractService.getLaunchTime().then(launchTimeData => {
            if (launchTimeData) {
                this.launchTime = launchTimeData.launchTime;
                this.startTime = launchTimeData.lpLaunchTime;
                //this.startTime = (launchTimeData.launchTime) + (1000 * 60 * 60 * this.localDataUpdateService.slotMaxHours);
                this.endTime = this.startTime + ((1000 * 60 * 60 * this.localDataUpdateService.slotMaxHours) * this.localDataUpdateService.totalSlots);
                this.localDataUpdateService.forceInitSlotsReservationData(true);
            }
        });
    }

    getTimeLeft(toTime?: number): string {
        if (!toTime) {
            return '';
        }

        const now = new Date().getTime();
        const distance = toTime - now;
        if (distance <= 0) {
            return 'EXPIRED';
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        return days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
    }

    getCurrentTimeProgess(fromTime?: number, toTime?: number): number {
        if (!fromTime || !toTime) {
            return 0;
        }
        const now = new Date().getTime();
        const distanceFrom = now - fromTime;
        if (distanceFrom <= 0) {
            return 0;
        }

        if (toTime - now <= 0) {
            return 100;
        }

        return Math.round(distanceFrom / (toTime - fromTime) * 100);
    }

    initSlots() {
        const startdate = new Date(this.startTime);

        this.allSlots = [];
        this.allSlots = [
            { id: 1, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 2, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 3, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 4, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 5, name: '2150 - 16850', type: SlotType.Random, color: '#e5b255', isSelected: false, isExpired: false },
            { id: 6, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 7, name: '3650 - 11850', type: SlotType.Random, color: '#ed5b5b', isSelected: false, isExpired: false },
            { id: 8, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 9, name: '3650 - 11850', type: SlotType.Random, color: '#ed5b5b', isSelected: false, isExpired: false },
            { id: 10, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 11, name: '3650 - 11850', type: SlotType.Random, color: '#ed5b5b', isSelected: false, isExpired: false },
            { id: 12, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 13, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 14, name: '2150 - 16850', type: SlotType.Random, color: '#e5b255', isSelected: false, isExpired: false },
            { id: 15, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 16, name: '3650 - 11850', type: SlotType.Random, color: '#ed5b5b', isSelected: false, isExpired: false },
            { id: 17, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 18, name: '3650 - 11850', type: SlotType.Random, color: '#ed5b5b', isSelected: false, isExpired: false },
            { id: 19, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 20, name: '2150 - 16850', type: SlotType.Random, color: '#e5b255', isSelected: false, isExpired: false },
            { id: 21, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 22, name: '2150 - 16850', type: SlotType.Random, color: '#e5b255', isSelected: false, isExpired: false },
            { id: 23, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 24, name: '2150 - 16850', type: SlotType.Random, color: '#e5b255', isSelected: false, isExpired: false },
            { id: 25, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 26, name: '2150 - 16850', type: SlotType.Random, color: '#e5b255', isSelected: false, isExpired: false },
            { id: 27, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 28, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 29, name: '3650 - 11850', type: SlotType.Random, color: '#ed5b5b', isSelected: false, isExpired: false },
            { id: 30, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 31, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 32, name: '2150 - 16850', type: SlotType.Random, color: '#e5b255', isSelected: false, isExpired: false },
            { id: 33, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 34, name: '3650 - 11850', type: SlotType.Random, color: '#ed5b5b', isSelected: false, isExpired: false },
            { id: 35, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 36, name: '3650 - 11850', type: SlotType.Random, color: '#ed5b5b', isSelected: false, isExpired: false },
            { id: 37, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 38, name: '2150 - 16850', type: SlotType.Random, color: '#e5b255', isSelected: false, isExpired: false },
            { id: 39, name: '2150 - 16850', type: SlotType.Random, color: '#e5b255', isSelected: false, isExpired: false },
            { id: 40, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 41, name: '3650 - 11850', type: SlotType.Random, color: '#ed5b5b', isSelected: false, isExpired: false },
            { id: 42, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 43, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 44, name: '2150 - 16850', type: SlotType.Random, color: '#e5b255', isSelected: false, isExpired: false },
            { id: 45, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 46, name: '3650 - 11850', type: SlotType.Random, color: '#ed5b5b', isSelected: false, isExpired: false },
            { id: 47, name: '2150 - 16850', type: SlotType.Random, color: '#e5b255', isSelected: false, isExpired: false },
            { id: 48, name: '3650 - 11850', type: SlotType.Random, color: '#ed5b5b', isSelected: false, isExpired: false },
            { id: 49, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false },
            { id: 50, name: '6000', type: SlotType.Fixed, color: 'rgb(99 39 218)', isSelected: false, isExpired: false }
        ];

        let start = moment(startdate);
        start = start.add(start.hours() * -1, 'hours');
        this.allSlots.forEach(slot => {
            const slotStartDate = new Date(this.startTime + ((1000 * 60 * 60 * this.localDataUpdateService.slotMaxHours) * (slot.id - 1)));
            const slotEndDate = new Date(this.startTime + ((1000 * 60 * 60 * this.localDataUpdateService.slotMaxHours) * (slot.id)));

            let end = moment(slotStartDate);
            end = end.add(end.hours() * -1, 'hours');
            const diffDays = end.diff(start, 'days') + 1;

            slot.day = diffDays;
            slot.startDate = slotStartDate;
            slot.endDate = slotEndDate;
            slot.hours = this.localDataUpdateService.slotMaxHours;
            // slot.option = ' #46494f';
            slot.progressDone = 0;
        });
    }

    updateSlotsTimer() {
        this.intervalId = setInterval(() => {
            this.allSlots.forEach(slot => {
                if (slot.timeLeft != 'EXPIRED' && !slot.isExpired) {
                    slot.timeLeft = this.getTimeLeft(slot.endDate?.getTime());
                    slot.progressDone = this.getCurrentTimeProgess(slot.startDate?.getTime(), slot.endDate?.getTime());
                }
                if (slot.timeLeft == 'EXPIRED') {
                    slot.isExpired = true;
                }
                if (slot.id == this.localDataUpdateService.totalSlots && slot.isExpired) {
                    clearInterval(this.intervalId);
                }
            });
        }, 1000);
    }

    stopSlotsTimer() {
        clearInterval(this.intervalId);
    }

    updateSlotsReservation() {
        this.allSlots.forEach(slot => {
            this.liquidityContractService.getGriseReservationData(slot.id).then(griseReservationData => {
                if (griseReservationData) {
                    slot.slotLeft = this.localDataUpdateService.maxSlotsPerSlot - griseReservationData.slotsUsed;
                    slot.totalInvest = griseReservationData.totalInvestment;
                    slot.myContribution = griseReservationData.myContribution;
                    // slot.mySharePercent = (slot.myContribution == 0) ? 0 : (slot.myContribution / slot.totalInvest) * 100;
                    slot.mySharePercent = (slot.myContribution == 0) ? "0 %" : (griseReservationData.myShare == 0) ? ((slot.myContribution / slot.totalInvest) * 100).toFixed(2).concat(" %") : (griseReservationData.myShare).toString().concat(" GRISE");
                }
            });
        });

        this.liquidityContractService.getSupplyOnAllDays().then(allDaysdata => {
            if (allDaysdata) {
                allDaysdata.forEach((allDaydata, index) => {
                    if (allDaydata > 0) {
                        this.allSlots[index - 1].name = allDaydata.toString();
                    }
                });
            }
        });
    }

    deselectAllSlots() {
        this.allSlots.forEach(slot => {
            slot.isSelected = false;
        });
    }

    initPersonalPeriodStakes() {
        this.allPersonalPeriodStakes = [
            { periodType: 'W', additionalValue: '', stakeStep: 50, slotLeft: 0 },
            { periodType: 'M', additionalValue: '3', stakeStep: 225, slotLeft: 0 },
            { periodType: 'M', additionalValue: '6', stakeStep: 100, slotLeft: 0 },
            { periodType: 'M', additionalValue: '9', stakeStep: 150, slotLeft: 0 },
            { periodType: 'Y', additionalValue: '', stakeStep: 100, slotLeft: 0 }
        ];
    }

    updatePersonalPeriodStakeSlotLeft() {
        this.stakingTokenContractService.getStakeSlotsLeftData().then(slotLefts => {
            if (slotLefts) {
                this.allPersonalPeriodStakes.forEach(stakes => {
                    switch (stakes.periodType + stakes.additionalValue) {
                        case 'W': { stakes.slotLeft = slotLefts.stSlotLeft; break; }
                        case 'M3': { stakes.slotLeft = slotLefts.mt3MonthSlotLeft; break; }
                        case 'M6': { stakes.slotLeft = slotLefts.mt6MonthSlotLeft; break; }
                        case 'M9': { stakes.slotLeft = slotLefts.mt9MonthSlotLeft; break; }
                        case 'Y': { stakes.slotLeft = slotLefts.ltSlotLeft; break; }
                    }
                });
                this.localDataUpdateService.forceUpdatePersonalPeriodStakeSlotLeftData(true);
            }
        });
    }

    getDateAdd(fromDt: number, days?: number): Date {
        return moment(new Date(fromDt)).add(days, 'days').toDate();
    }

    getDateNumberDiff(fromDt: number, toDt: number): number {
        return this.getDateDiff(new Date(fromDt), new Date(toDt));
    }

    getDateDiff(fromDt: Date, toDt: Date): number {
        const fromDate = moment(fromDt);
        const toDate = moment(toDt);
        return toDate.diff(fromDate, 'days') + 1;
    }

    getDateWithoutTime(fromDt: Date): Date {
        fromDt.setHours(0);
        fromDt.setMinutes(0);
        fromDt.setSeconds(0);
        fromDt.setMilliseconds(0);
        return fromDt;
    }
}
