import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload';
import { BillsApiService } from '../../services/bills/bills-api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AccountsApiService} from '../../services/accounts/accounts-api.service';



const UPLOADURL = 'http://localhost:4000/upload';
const LIST_FILES_URL = 'http://localhost:4000/list-files';


interface Filer {
  id: string;
  fileName: string;
}

interface Parser {
  id: string;
  label: string;
}

interface Bill {
  user: string;
  docName: string;
  docID: string;
  parserLabel: string;
  parserID: string;
  hash: string;
}

/**
 * Mint public token component, which is used for rendering the page of mint ERC-721 token.
 */

@Component({
  selector: 'app-store-bill-in-swarm',
  templateUrl: './store-bill.component.html',
  providers: [BillsApiService, AccountsApiService],
  styleUrls: ['./store-bill.component.css']
})



export class StoreBillComponent implements OnInit {
  /**
   * Flag for http request
   */

  user: any = {};
  listOfFiles: any = [];
  listOfParsers: any = [];
  selectedFile: Filer = {id: '', fileName: ''};
  selectedParser: Parser = {id: '', label: ''};
  selectedBill: Bill = {user: '', docName: '', docID: '', parserLabel: '', parserID: '', hash: ''}
  billDetails: any;
  storageDetails = ['IPFS', 'Eth Swarm', 'MFS'];
  selectedStorage = '';

  /**
   * Flag for http request
   */
  isRequesting = false;


  constructor(
    private toastr: ToastrService,
    private billsApiService: BillsApiService,
    private accountsApiService: AccountsApiService,
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.getUser();
    // Retrieve list of files from API call
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
        this.getUserBills();
      },
      error => {
        console.log('error in user get', error);
      }
    );
  }


  // getBillCount() {
  //   const bills = this.billsService.getUserBills();
  // }

  getUserBills() {
    this.billsApiService.getUserBills(this.user.name).subscribe(
      data => {
        // console.log('data', data);
        this.billDetails = data['data'];
        console.log(this.billDetails);
      },
      error => {
        console.log('error in user get', error);
      }
    );
  }

  fileSelected(file: any) {
    this.selectedFile = file;
    console.log(this.selectedFile);
  }

  parserSelected(parser: any) {
    this.selectedParser = parser;
    console.log(this.selectedParser);
  }

  billSelected(event: any, bill: any) {
    this.selectedBill = bill;
    console.log(this.selectedBill);
  }

  storeBill() {
    this.isRequesting = true;
    let parserId = this.selectedBill.parserID;
    let documentId = this.selectedBill.docID;


    console.log(parserId, documentId);

    let cidDetails = this.billsApiService.storeInIpfs(parserId, documentId)
      .subscribe((data: any) => {
            console.log(data.path);
            console.log(this.selectedStorage);
            let cidPath = data.path;
            this.billsApiService.updateDBwithHash(parserId, documentId, this.selectedStorage, cidPath)
              .subscribe(() => {
                this.toastr.success('Document Added into IPFS Successfully');
                this.router.navigate(['/overview'], { queryParams: { selectedTab: 'coins' } });
                console.log("storeBill run");
                this.isRequesting = false;
                return data;
              });
          }, error => {
            this.toastr.error('Please try again', 'Error');
            this.isRequesting = false;
          }
        );
    console.log("cidDetails");
    console.log(cidDetails);
    // let hashDetails = this.billsApiService.hashJson(parserId, docId)
    //   .subscribe((hashData: any) => {
    //       console.log(hashData);
    //       this.toastr.success('Document Uploaded into Swam Successfully');
    //       this.router.navigate(['/overview'], { queryParams: { selectedTab: 'coins' } });
    //       this.billsApiService.updateDBwithHash(parserId, docId, hashData);
    //       console.log("updateDBwithHash run");
    //       return hashData;
    //     }, error => {
    //       this.toastr.error('Please try again', 'Error');
    //     }
    //   );

  }
  // getParsedJson() {
  //   let parserId = this.selectedParser.id;
  //   let documentId = this.selected
  //   this.billsApiService.getParsedJson(parserId, documentId)
  //     .subscribe((parsedJson) => {
  //         console.log(parsedJson);
  //         this.parsedJson = parsedJson;
  //       }
  //     );
  // }


}
