import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'itemIcon',
  standalone: true
})
export class ItemIconPipe implements PipeTransform {

  transform(type: string): string {
    return type === 'quran' ? '📖' : '📚';
  }

}
