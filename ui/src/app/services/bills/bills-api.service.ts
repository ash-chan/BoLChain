import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { config } from '../../shared/config';
import {FileUploader} from 'ng2-file-upload';

import * as URL from './url-routes';

/**
 * Token API services, which accomodated all ERC-721 related methods.
 */
@Injectable()
export class BillsApiService {

  assetHash: string;

  constructor(private http: HttpClient) {}

  public uploader: FileUploader = new FileUploader({
    url: URL.UPLOAD_URL,
    itemAlias: 'doc'
  });

  upload(filesToUpload) {
    const formData: any = new FormData();
    const files: Array<File> = filesToUpload;
    console.log(files);

    for(let i =0; i < files.length; i++){
      formData.append("uploads[]", files[i], files[i]['name']);
    }
    console.log('form data variable :   '+ formData.toString());
    let uploadData = this.http.post(URL.UPLOAD_URL, formData).pipe(tap(data => {
        console.log(data);
      }),
      catchError(err => {
        console.log('Unable to retrieve list of documents', err);
        return err;
      })

    );
    return uploadData;
      // .map(files => files.json())
      // .subscribe(files => console.log('files', files))
  }

  listFiles() {
    let filesData = this.http.get(URL.LIST_FILES_URL)
      .pipe(tap(data => {
          console.log(data);
        }),
        catchError(err => {
          console.log('Unable to retrieve list of documents', err);
          return err;
        })
      );
    return filesData;
  }

  listParsers() {
    let parsersData = this.http.get(URL.LIST_PARSERS_URL)
      .pipe(tap(data => {
        console.log(data);
      }),
      catchError(err => {
        console.log('Unable to retrieve list of parsers', err);
        return err;
      })
    );
    return parsersData;
  }


  uploadAndParse(parserId: string, filePath: string) {
    let encoded_filePath = encodeURIComponent(filePath);
    console.log(encoded_filePath);
    let jsonAfterParsing = this.http.get(URL.UPLOAD_AND_PARSE_URL + '/' + parserId + '/' + encoded_filePath);
    console.log(jsonAfterParsing);
    return jsonAfterParsing;
  }

  initTable() {
    let initTableResp = this.http.get(URL.CREATE_TABLE_URL);
    console.log("table created")
    return initTableResp;
  }

  storeIntoDB(curUser: string, parserID: string, parserLabel: string, docName: string, docID: string) {
    let initTableResp = this.http.get(URL.CREATE_TABLE_URL).toPromise().then(data =>{
      let encodedParserLabel = encodeURIComponent(parserLabel);
      console.log(encodedParserLabel);
      let encodedDocName = encodeURIComponent(docName);
      console.log(encodedDocName);

      console.log(URL.ADD_DOC_INTO_DB_URL + '/' + curUser + '/' + encodedDocName + '/' + docID + '/'
        + encodedParserLabel + '/' + parserID + '/' + 'fakejson' + '/');

      let storeTestResult = this.http.get(URL.ADD_DOC_INTO_DB_URL + '/' + curUser + '/'
        + encodedDocName + '/' + docID + '/' + encodedParserLabel + '/' + parserID + '/'
        + 'fakejson' + '/').subscribe(() => {
          console.log("storeIntoDB done");
      });
    });

    //   .pipe(tap(data => {
    //     console.log('successfully pushed to internal database after parsing');
    //     console.log(data);
    //   }),
    //   catchError(err => {
    //     console.log('Failed to add into DB', err);
    //     return err;
    //   })
    // );
  }


  getUserBills(user: string) {
    return this.http.get(URL.SHOW_DOCS_URL + '/' + user)
      .pipe(tap(data => {
        console.log(data);
      }),
        catchError(err => {
          console.log('Unable to retrieve docs from database', err);
          return err;
        })
      );
  }

  getParsedJson(parserId: string, documentId: string) {
    return this.http.get(URL.GET_PARSED_JSON_URL + '/' + parserId + '/' + documentId)
      .pipe(tap(data => {
          console.log(data);
        }),
        catchError(err => {
          console.log('Unable to retrieve parsed Json', err);
          return err;
        })
      );
  }

  // Return the hash
  hashJson(parserId: string, documentId: string) {
    return this.http.get(URL.HASH_JSON_URL + '/' + parserId + '/' + documentId)
      .pipe(tap(data => {
          console.log(data);
        }),
        catchError(err => {
          console.log('Unable to retrieve parsed Json', err);
          return err;
        })
      );
  }

  updateDBwithHash(parserId: string, documentId: string, storageMethod: string, hash: string) {
    return this.http.get(URL.UPDATE_DB_WITH_HASH_URL + '/' + parserId + '/' + documentId + '/' + storageMethod + '/' + hash)
      .pipe(tap(data => {
        console.log("updateDBWithHash done");
      }),
        catchError(err => {
          console.log('Unable to retrieve parsed Json', err);
          return err;
        })
      );
  }

  storeInSwarm(parserId: string, documentId: string) {
    return this.http.get(URL.STORE_IN_SWARM_URL + '/' + parserId + '/' + documentId)
      .pipe(tap(data => {
        console.log("storeInSwarm done");
      }),
        catchError(err => {
          console.log('Unable to store into Swarm', err);
          return err;
        })
      );
  }
  storeInIpfs(parserId: string, documentId: string) {
    return this.http.get(URL.STORE_IN_IPFS_URL + '/' + parserId + '/' + documentId)
      .pipe(tap(data => {
          console.log("storeInIpfs done");
        }),
        catchError(err => {
          console.log('Unable to store into IPFS', err);
          return err;
        })
      );
  }

  retrieveFromIpfs(cid: string) {
    return this.http.get(URL.RETRIEVE_FROM_IPFS_URL + '/' + cid)
      .pipe(tap(data => {
        console.log("retrieveFromIpfs done");
      }),
        catchError(err => {
          console.log('Unable to store into IPFS', err);
          return err;
        })
      );
  }

  storeInMfs(parserId: string, documentId: string) {
    return this.http.get(URL.STORE_IN_MFS_URL + '/' + parserId + '/' + documentId)
      .pipe(tap(data => {
          console.log("storeInIpfs done");
        }),
        catchError(err => {
          console.log('Unable to store into MFS', err);
          return err;
        })
      );
  }

  getCidFromId(tokenId) {
    return this.http.get(config.database.root + 'nft/' + tokenId)
      .pipe(tap(data => {
          console.log(data);
          console.log("getCIDfromID done");
        }),
        catchError(err => {
          console.log('Unable to get CID', err);
          return err;
        })
      );
  }

  getTokenById(tokenId, cidToView) {
    return this.http.get(config.database.root + 'nft/' + tokenId)
      .pipe(tap(data => {
          console.log("getTokenbyId done");
        }),
        catchError(err => {
          console.log('Unable to calculate BoL Hash', err);
          return err;
        })
      );

    // let currentNFT = this.http.get(config.database.root + tokenId)
    //   .subscribe(nftInfo => {
    //     console.log(nftInfo);
    //     let tokenuriDataIntegrity = nftInfo.data.uriDataIntegrity;
    //     if (hashToCheck === tokenuriDataIntegrity) {
    //       console.log('123')
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   });
  }

  calculateUriDataIntegrity(cidToView: string) {
    this.retrieveFromIpfs(cidToView)
      .subscribe(bolJson => {
        let billString = JSON.stringify(bolJson);
      });
    return this.http.get(URL.CALCULATE_JSON_HASH_URL + '/' + cidToView)
      .pipe(tap(data => {
          console.log("calculateuriDataIntegrity done");
        }),
        catchError(err => {
          console.log('Unable to calculate BoL Hash', err);
          return err;
        })
      );
  }

  /**
   * Method to upload file
   *
   */
  uploadFile() {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, status: any) => {
      console.log('Uploaded File Details:', item);
      // this.toastr.success('File successfully uploaded!');
      return this.http
        .get(URL.UPLOAD_URL)
        .map(response => response);
    };
    // const httpOptions = {
    //   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    // };
    // const url = 'localhost:4000/upload';
    // const body = new FormData();
    // body.append('fileKey', fileToUpload);
    // return this.http
    //   .post(url, body)
    //   .pipe(tap(data => console.log(`File uploaded `)), catchError(this.handleError('uploadFile', [])));
  }
  // postFile(fileToUpload: File): Observable<boolean> {
  //   const endpoint = 'localhost:4000/upload';
  //   const formData: FormData = new FormData();
  //   formData.append('fileKey', fileToUpload, fileToUpload.name);
  //   return this.http
  //     .post(endpoint, formData)
  //     .map(() => { return true; })
  //     .catch((e) => this.handleError(e));
  // }


  /**
   * Method to handle error on HTTp request.
   * @param operation {String}
   * @param result {Object}
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return error;
    };
  }


}
