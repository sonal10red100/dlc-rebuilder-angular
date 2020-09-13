import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  template: `
    <a [routerLink]="['/']">Home</a>
    <a [routerLink]="['/about']">About</a>
    <div class="outer-outlet">
      <router-outlet></router-outlet>
    </div>
    `
})
export class HomeComponent implements OnInit {
  loading: boolean;
  loading_reconst: boolean;
  loading_open_in_logisim: boolean;
  lst_msg: boolean;
  msg: string;
  flag: boolean = false;
  no_open: boolean;
  head: Array<any>;
  cols: number;
  truth_table_popup: boolean;
  no_exp: boolean;
  boolean_exp: any;
  no_rimage: boolean;
  proceed: boolean;
  no_detection: boolean;
  missing_components: boolean;
  components: Array<any>;
  predictions: Array<any>;
  lst: Array<any>;
  no_detect: boolean;
  popup: boolean;
  imageSrc: string;
  imagePath: any;
  r_imagePath: any;
  cap_imagePath: any;
  output: JSON;
  output2: JSON;
  output3: JSON;
  output4: JSON;
  output5: JSON;
  obj: any;
  obj2: any;
  obj3: any;
  obj4: any;
  obj5: any;
  base64_img: string;
  fileToUpload: File = null;

  constructor(private http: HttpClient, private _sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit() {
    $(document).ready(function () { 
    $('.detect_comp').click(function () {
      var $thumb = $('.inp_sketch');
      this.iSrc = $thumb.find('img').attr('src')
      
    });
    }); 
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  detectComponents() {
    if (this.imageSrc) {
      console.log(this.imageSrc)
      this.obj = {
        "col1": { "imageSrc": this.imageSrc }
      }
    }
    else if (this.cap_imagePath) {
      console.log(this.cap_imagePath['changingThisBreaksApplicationSecurity'])
      this.obj = {
        "col1": { "imageSrc": this.cap_imagePath['changingThisBreaksApplicationSecurity'] }
      }
    }
    this.output = <JSON>this.obj;
    this.loading = true
    return this.http.post('http://localhost:5000/detect', this.output, { responseType: 'json' })
      .subscribe(data => {
        this.loading = false
        console.log(data)
        //console.log(data['result']['detected_image']);
        //console.log(data['result']['predictions']);

        this.predictions = data['result']['predictions']
        
        if (data['result']['no_detection'] == 'true') {
          this.no_detection = true;
          console.log(this.no_detection)
        }
        else {
          this.no_detection = false;
          console.log(this.no_detection)
        }
        console.log(this.flag)
        this.base64_img = data['result']['detected_image']
        this.base64_img = this.base64_img.substring(1, this.base64_img.length-1)
        this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          + this.base64_img);
        //console.log(this.imagePath)
    }, error => {
      throwError(error);
    })
  }

  reconstructCircuit() {
    console.log('yesss')
    this.obj2 = {
      "col1": { "predictions": this.predictions }
    }
    this.output2 = <JSON>this.obj2;
    this.loading_reconst = true
    return this.http.post('http://localhost:5000/reconstruct', this.output2, { responseType: 'json' })
      .subscribe(data => {
        this.loading_reconst = false
        console.log(data)
        if (data['result']['missing_components'] == 'true') {
          this.missing_components = true
        }
        else {
          this.components = data['result']['components']
          this.missing_components = false
          this.base64_img = data['result']['r_image']
          this.base64_img = this.base64_img.substring(1, this.base64_img.length - 1)
          this.r_imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
            + this.base64_img);
          console.log('heyaa')
          console.log(this.r_imagePath)
        }

      }, error => {
        throwError(error);
      })

  }


  logical_expression() {
    console.log('expppp')
    this.obj3 = {
      "col1": { "components": this.components }
    }
    this.output3 = <JSON>this.obj3;
    
    return this.http.post('http://localhost:5000/logical_exp', this.output3, { responseType: 'json' })
      .subscribe(data => {
        
        this.boolean_exp = data['result']['exp']
        console.log(this.boolean_exp)

      }, error => {
        throwError(error);
      }) 
  }

  truth_table() {
    this.truth_table_popup = true
    console.log('okk')
    this.obj4 = {
      "col1": { "expression": this.boolean_exp }
    }
    this.output4 = <JSON>this.obj4;
    return this.http.post('http://localhost:5000/truth_table', this.output4, { responseType: 'json' })
      .subscribe(data => {
        this.cols = data['result']['cols']
        this.lst = data['result']['lst']
        this.head = this.lst[0]
        this.lst = this.lst.slice(1, this.lst.length)
        for (let i = 0; i < this.lst.length; i++) {
          if (this.lst[i]['X'] == true) {
            this.lst[i]['X'] = 1
          }
          else if (this.lst[i]['X'] == false) {
            this.lst[i]['X'] = 0
          }

        }
        console.log(this.cols)
        console.log(this.lst[0])
        console.log(this.lst)

      }, error => {
        throwError(error);
      })

  }


  open_in_logisim() {
    console.log('opennnn')
    this.obj5 = {
      "col1": { "components": this.components }
    }
    this.output5 = <JSON>this.obj5;
    this.loading_open_in_logisim = true
    return this.http.post('http://localhost:5000/open_in_logisim', this.output5, { responseType: 'json' })
      .subscribe(data => {
        this.loading_open_in_logisim = false
        this.msg = data['result']['msg']
        console.log(this.msg)

        this.lst_msg=true


      }, error => {
        throwError(error);
      })

  }

  capture_image() {
    console.log('captureeee')
    return this.http.get('http://localhost:5000/capture_image')
      .subscribe(data => {
       
        this.base64_img= data['result']['captured_img']
        console.log(data)
        this.base64_img = this.base64_img.substring(1, this.base64_img.length - 1)
        this.cap_imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          + this.base64_img);
        console.log(this.cap_imagePath)


      }, error => {
        throwError(error);
      })
    
  }

  onFileChange(event: any) {
    this.cap_imagePath=null
    const reader = new FileReader();
    console.log(event.target.files.length)
    if (event.target.files && event.target.files[0]) {
      
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {

        this.imageSrc = reader.result as string;
        

      };

    }
  }






}
