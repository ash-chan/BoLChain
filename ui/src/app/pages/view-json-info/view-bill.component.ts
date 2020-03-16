import { Component, OnInit, Pipe } from '@angular/core';
import { TokenApiService } from '../../services/tokens/token-api.service';
import { ToastrService } from 'ngx-toastr';
import {BillsApiService} from '../../services/bills/bills-api.service';
import { ActivatedRoute } from '@angular/router';


/**
 * Component for listing all ERC-721 tokens
 */
@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.css'],
  providers: [BillsApiService, TokenApiService],
})

export class ViewBillComponent implements OnInit {
  /**
   * Flag for http request
   */
  isRequesting =  false;
  docName: string;
  cidToView: string;
  billJson: any;

  constructor(
    private billsApiService: BillsApiService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // this.docName = decodeURIComponent(this.route.snapshot.paramMap.get('docName'));
    this.cidToView = this.route.snapshot.paramMap.get('cid');
    this.billJson = this.billsApiService.retrieveFromIpfs(this.cidToView)
      .subscribe(data => {
        console.log(data);
        this.billJson = data;
        this.docName = this.billJson[0].file_name;
      });
    console.log(this.cidToView);
    console.log(this.billJson);
  }



}
