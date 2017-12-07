import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../_services/config.service';
import { Config } from '../_models/config.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public config: Config;

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.configService.getConfig().subscribe(config => {
      this.config = config;
    });
  }

}
