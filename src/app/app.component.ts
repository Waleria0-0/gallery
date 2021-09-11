import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatRadioChange } from '@angular/material/radio';
import { ButtonsConfig, ButtonsStrategy, CurrentImageConfig, Image } from '@ks89/angular-modal-gallery';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  filteredImages: Image[] = [];
  buttonsConfigSimple: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.SIMPLE
  };
  currentImageConfig: CurrentImageConfig = {
    downloadable: true,
    invertSwipe: true,
    loadingConfig: {
      enable: true, type: 2
    }
  };
  images: Image[] = [];
  currentPage = 0;
  page = 0;
  size = 25;
  galleryType: string = 'Photos';
  galleries: string[] = ['Photos', 'Arts'];
  galleryPath = 'photos';

  @ViewChild('paginator', {static: false}) paginator: MatPaginator;

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getData();
  }

  changeGallery(event: MatRadioChange) {
    this.images = [];
    this.currentPage = 0;
    this.paginator.firstPage();
    this.paginator.pageSize = 25;

    if (this.galleryType.localeCompare('Photos')) {
      this.galleryPath = 'photos';
    } else {
      this.galleryPath = 'arts';
    }

    this.getData();
  }

  getData() {
    this.httpClient.get<Array<string>>('assets/data/' + this.galleryPath + '.json').subscribe(result => {
      for (var i = 0; i < result.length; i++) {
        this.images.push(new Image(i, { img: './assets/' + this.galleryPath + '/' + result[i] }))
      }

      this.filterData({ pageIndex: this.page, pageSize: this.size });
    });
  }

  filterData(obj: { pageIndex: number; pageSize: number; }) {
    var index = 0;
    var startingIndex = obj.pageIndex * obj.pageSize;
    var endingIndex = startingIndex + obj.pageSize;

    this.filteredImages = this.images.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });

    if (this.currentPage < obj.pageIndex) {
      document.body.scrollTop = document.documentElement.scrollTop = 1140;
    } 

    this.currentPage = obj.pageIndex;
  }
}
