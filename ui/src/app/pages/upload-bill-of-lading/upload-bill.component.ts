import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload';
import { BillsApiService } from '../../services/bills/bills-api.service';


const UPLOAD_URL = 'http://localhost:4000/upload'

/**
 * Mint public token component, which is used for rendering the page of mint ERC-721 token.
 */
@Component({
  selector: 'app-upload-bill-of-lading',
  templateUrl: './upload-bill.component.html',
  providers: [BillsApiService],
  styleUrls: ['./upload-bill.component.css']
})

export class UploadBillComponent implements OnInit {

  /**
   * For ERC-721 token name
   */
  filesToUpload: Array<File> = [];
  /**
   * Flag for http request
   */
  isRequesting = false;

  /**
   * Non Fungeble Token name , read from ERC-721 contract.
   */
  docName: string;

  constructor(
    private toastr: ToastrService,
    private billsApiService: BillsApiService,
    private router: Router
  ) { }

  public uploader: FileUploader = new FileUploader({
    url: UPLOAD_URL,
    itemAlias: 'doc'
  });

  ngOnInit() {
    this.docName = 'Bill of Lading';
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, status: any) => {
      console.log('Uploaded File Details:', item);
      this.toastr.success('File successfully uploaded!');
    };
  }

  upload() {
    this.billsApiService.upload(this.filesToUpload);
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    //this.product.photo = fileInput.target.files[0]['name'];
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
