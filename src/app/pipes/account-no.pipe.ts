import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formattedAccountNo'
})
export class AccountNoPipe implements PipeTransform {
    transform(accountNo: number): string {
        const strAccountNo = accountNo.toString();
        let formattedAccountNo = strAccountNo;

        if (strAccountNo.length >= 13) {
            formattedAccountNo = strAccountNo.substr(0, 7);
            formattedAccountNo += '...';
            formattedAccountNo += strAccountNo.substr(strAccountNo.length - 5);
        }

        return formattedAccountNo;
    }
}
