import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenApiService } from '../../services/tokens/token-api.service';
import { AccountsApiService } from '../../services/accounts/accounts-api.service';
import {BillsApiService} from '../../services/bills/bills-api.service';

/**
 * Mint public token component, which is used for rendering the page of mint ERC-721 token.
 */
@Component({
  selector: 'app-mint-public-token',
  templateUrl: './mint-public-token.component.html',
  providers: [TokenApiService, AccountsApiService, BillsApiService],
  styleUrls: ['./mint-public-token.component.css']
})
export class MintPublicTokenComponent implements OnInit {

  /**
   * For ERC-721 token name
   */
  tokenURI: string;
  /**
   * Flag for http request
   */
  isRequesting = false;

  /**
   * Non Fungeble Token name , read from ERC-721 contract.
   */
  nftName: string;

  billDetails: any;
  curUser: any = {};
  user: any;
  selectedBill: any = '';
  uriDataIntegrity = '123';

  constructor(
    private toastr: ToastrService,
    private tokenApiService: TokenApiService,
    private accountService: AccountsApiService,
    private billsService: BillsApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUser();
    this.nftName = localStorage.getItem('nftName');
  }

  /**
   * Method to mint ERC-721 token.
   */
  mintToken() {
      this.isRequesting = true;
      this.tokenURI = this.selectedBill[0].hash;
      console.log(this.selectedBill[0]);
      this.tokenApiService.mintNFToken(this.tokenURI, this.uriDataIntegrity).subscribe(tokenDetails => {
        this.isRequesting = false;
        this.toastr.success('Token Minted is Successfully');
        this.tokenURI = undefined;
        this.router.navigate(['/overview'], { queryParams: { selectedTab: 'publictokens' } });
      }, error => {
        this.isRequesting = false;
        this.toastr.error('Please try again', 'Error');
    });
  }

  /**
   * Method to set new coin list in select box, on removing.
   * @param item {Object} Item to be removed.
   */
  onRemove(item) {
    console.log('selected items', this.selectedBill, item);
    const newList = this.selectedBill.filter((it) => {
      return item._id !== it._id;
    });
    this.selectedBill = newList;
    console.log('selected new items', this.selectedBill);
  }
  /**
   * Method to retrive current user;
   *
   */
  getUser() {
    this.accountService.getUser().subscribe(
      data => {
        console.log('data', data);
        this.user = data['data'];
        this.curUser = data['data'];
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
    this.billsService.getUserBills(this.user.name).subscribe(
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

}
