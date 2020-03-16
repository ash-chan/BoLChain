import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload';
import { BillsApiService } from '../../services/bills/bills-api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AccountsApiService} from '../../services/accounts/accounts-api.service';


interface Filer {
  id: string;
  fileName: string;
}

interface Parser {
  id: string;
  label: string;
}

/**
 * Mint public token component, which is used for rendering the page of mint ERC-721 token.
 */

@Component({
  selector: 'app-parse-bill-of-lading',
  templateUrl: './parse-bill.component.html',
  providers: [BillsApiService, AccountsApiService],
  styleUrls: ['./parse-bill.component.css']
})



export class ParseBillComponent implements OnInit {
  /**
   * Flag for http request
   */

  user: any = {};
  listOfFiles: any = [];
  listOfParsers: any = [];
  selectedFile: Filer = {id: '', fileName: ''};
  selectedParser: Parser = {id: '', label: ''};


  constructor(
    private toastr: ToastrService,
    private billsApiService: BillsApiService,
    private accountsApiService: AccountsApiService,
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    // Retrieve list of files from API call
    this.getUser();
    this.billsApiService.listFiles()
      .subscribe((filesData) => {
          console.log(filesData);
          this.listOfFiles = filesData;
        }
      );

    this.billsApiService.listParsers()
      .subscribe((parsersData) => {
          console.log(parsersData);
          this.listOfParsers = parsersData;
        }
      );
  }

  getUser() {
    this.accountsApiService.getUser().subscribe(
      data => {
        console.log('data', data);
        this.user = data['data'];

      },
      error => {
        console.log('error in user get', error);
      }
    );
  }

  fileSelected(event: any, file: any) {
    this.selectedFile = file;
    console.log(this.selectedFile);
  }

  parserSelected(event: any, parser: any) {
    this.selectedParser = parser;
    console.log(this.selectedParser);
  }

  parseBill() {
    let parserId = this.selectedParser.id;
    let parserLabel = this.selectedParser.label;
    let docName = this.selectedFile.fileName;
    let filePath = './uploads/' + docName;
    let curUser = this.user.name;

    console.log(filePath, parserId, parserLabel);

    let docDetails = this.billsApiService.uploadAndParse(parserId, filePath)
      .subscribe((parsersData: any) => {
          console.log(parsersData);
          this.toastr.success('Document Uploaded and Parsed Successfully');
          this.router.navigate(['/overview'], { queryParams: { selectedTab: 'coins' } });
          this.billsApiService.storeIntoDB(curUser, parserId, parserLabel, docName, parsersData.id);
          console.log("storeIntoDB run")
          return parsersData;
          }, error => {
          this.toastr.error('Please try again', 'Error');
        }
      );

  }



  // handleFileInput(files: FileList) {
  //      this.fileToUpload = files.item(0);
  // }
  //
  // uploadFileToActivity() {
  //   this.billsApiService.uploadFile(this.fileToUpload).subscribe(data => {
  //     this.isRequesting = false;
  //     this.toastr.success('Bill Uploaded Successfully');
  //     // this.tokenURI = undefined;
  //     this.router.navigate(['/overview'], { queryParams: { selectedTab: 'publictokens' } });
  //   }, error => {
  //     this.isRequesting = false;
  //     this.toastr.error('Please try again', 'Error');
  //   });
  // }


}
