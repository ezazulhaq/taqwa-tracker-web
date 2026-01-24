import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AppIconComponent } from '../app-icon/app-icon.component';
import { HomeIcons } from '../../model/home.model';
import { module_icons, tool_icons, game_icons } from '../../shared/module/module.contant';
import { TitleComponent } from '../../shared/title/title.component';

@Component({
  selector: 'app-all-apps',
  imports: [
    AppIconComponent,
    TitleComponent
  ],
  templateUrl: './all-apps.component.html',
  styleUrl: './all-apps.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-bg'
  }
})
export class AllAppsComponent {

  modules: HomeIcons[] = module_icons;
  tools: HomeIcons[] = tool_icons;
  games: HomeIcons[] = game_icons;

}
