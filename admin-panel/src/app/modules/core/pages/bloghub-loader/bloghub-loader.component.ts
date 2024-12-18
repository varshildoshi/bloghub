import { Component, Input, OnInit } from '@angular/core';
import { loader_config } from './bloghub-loader-config';

@Component({
  selector: 'app-bloghub-loader',
  templateUrl: './bloghub-loader.component.html',
  styleUrls: ['./bloghub-loader.component.scss']
})
export class BloghubLoaderComponent implements OnInit {

  @Input() loading;

  spinnerConfig = loader_config;

  constructor() {
  }

  ngOnInit(): void {
  }

}
