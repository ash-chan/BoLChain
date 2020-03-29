import { Component, OnInit, Pipe } from '@angular/core';
import { TokenApiService } from '../../services/tokens/token-api.service';
import { ToastrService } from 'ngx-toastr';
import {BillsApiService} from '../../services/bills/bills-api.service';
import { ActivatedRoute } from '@angular/router';
import { config } from '../../shared/config';
import {catchError, tap} from "rxjs/operators";


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
  cidToView: any;
  billJson: any;
  tokenId: string;
  currentNFT: any;
  calculateduriDataIntegrity: any;
  hashesAreSame: boolean = false;
  jsonKeys:any;

  constructor(
    private billsApiService: BillsApiService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // this.docName = decodeURIComponent(this.route.snapshot.paramMap.get('docName'));
    this.tokenId = this.route.snapshot.paramMap.get('token_id');
    console.log(this.tokenId);
    this.billsApiService.getCidFromId(this.tokenId)
      .subscribe(cid => {
        let curNFT:any = cid;
        this.cidToView = curNFT.data.uri;
        console.log(cid);
        this.billsApiService.retrieveFromIpfs(this.cidToView)
          .subscribe(billJson => {
            console.log(billJson);
            this.billJson = billJson;
            this.jsonKeys = Object.keys(billJson[0]);
            console.log(this.jsonKeys);
            this.docName = this.billJson[0].file_name;
          });
      });
  }

  verifyuriDataIntegrity(tokenId: string, cidToView: string) {
    this.billsApiService.getTokenById(tokenId, cidToView)
      .subscribe(curNFT => {
        this.currentNFT = curNFT;
        console.log(this.currentNFT);
        this.billsApiService.calculateuriDataIntegrity(cidToView)
          .subscribe(uriDataIntegrity => {
            this.calculateduriDataIntegrity = uriDataIntegrity;
            console.log(this.calculateduriDataIntegrity);
            if (this.calculateduriDataIntegrity === this.currentNFT.data.uriDataIntegrity) {
              this.toastr.success('Verified Integrity of JSON stored in URI ');
            } else {
              this.toastr.success('Verified Integrity of JSON stored in URI ');
            }
          });

      });


    // console.log(res);
    // return res;
    // this.http.get(config.database.root + '/nft/' + tokenId)
    //   .pipe(tap(data => {
    //       console.log("calculateuriDataIntegrity done");
    //       console.log(data);
    //       // let tokenHash = data.
    //       // if hashToCheck ==
    //         }),
    //     catchError(err => {
    //       console.log('Unable to calculate BoL Hash', err);
    //       return err;
    //     })
    //   );
  }

  calculateuriDataIntegrity(billString: string) {


  }



}
