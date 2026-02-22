import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'itemIcon',
})
export class ItemIconPipe implements PipeTransform {

  transform(type: string): string {
    switch (type) {
      case 'quran': return '📖';
      case 'hadith': return '📚';
      case 'library': return '📄';
      default: return '📖';
    }
  }

}
