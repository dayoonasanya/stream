import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {
  transform(value: string): string {
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'Administrator',
      'INVESTOR': 'Investor',
      'STARTUP': 'Startup',
      'ORGANIZATION': 'Organization'
    };
    
    
    return roleMap[value] || 'Unknown Role';
  }
}
