import { HeaderService } from './../../services/header/header.service';
import { OnInit, Component } from '@angular/core';


@Component({
  selector: 'app-supporting-materials',
  templateUrl: './supporting-materials.component.html',
  styleUrls: ['./supporting-materials.component.scss']
})
export class SupportingMaterialsComponent implements OnInit {

  constructor(private headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.checkPage('supportingMaterials');
  }

}
