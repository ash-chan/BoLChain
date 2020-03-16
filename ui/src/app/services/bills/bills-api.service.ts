import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { config } from '../../shared/config';
import {FileUploader} from 'ng2-file-upload';

const UPLOAD_URL = 'http://localhost:4000/upload';
const LIST_FILES_URL = 'http://localhost:4000/list-files';
const LIST_PARSERS_URL = 'http://localhost:4000/docparser/list-parsers';
const UPLOAD_AND_PARSE_URL = 'http://localhost:4000/docparser/upload-and-parse';
const CREATE_TABLE_URL = 'http://localhost:4000/storage/create-table';
const ADD_DOC_INTO_DB_URL = 'http://localhost:4000/storage/add-entry';
const SHOW_DOCS_URL = 'http://localhost:4000/storage/show-docs';
const GET_PARSED_JSON_URL = 'http://localhost:4000/docparser/get-parsed-json';
const HASH_JSON_URL = 'http://localhost:4000/swarm/hash-json';
const UPDATE_DB_WITH_HASH_URL = 'http://localhost:4000/storage/update-with-hash';
const STORE_IN_IPFS_URL = 'http://localhost:4000/ipfs/add-json';
const RETRIEVE_FROM_IPFS_URL = 'http://localhost:4000/ipfs/show-json';

/**
 * Token API services, which accomodated all ERC-721 related methods.
 */
@Injectable()
export class BillsApiService {

  assetHash: string;

  constructor(private http: HttpClient) {}

  public uploader: FileUploader = new FileUploader({
    url: UPLOAD_URL,
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
    let uploadData = this.http.post(UPLOAD_URL, formData).pipe(tap(data => {
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
    let filesData = this.http.get(LIST_FILES_URL)
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
    let parsersData = this.http.get(LIST_PARSERS_URL)
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
    let jsonAfterParsing = this.http.get(UPLOAD_AND_PARSE_URL + '/' + parserId + '/' + encoded_filePath);
    console.log(jsonAfterParsing);
    return jsonAfterParsing;
  }

  initTable() {
    let initTableResp = this.http.get(CREATE_TABLE_URL);
    console.log("table created")
    return initTableResp;
  }

  storeIntoDB(curUser: string, parserID: string, parserLabel: string, docName: string, docID: string) {
    let initTableResp = this.http.get(CREATE_TABLE_URL).toPromise().then(data =>{
      let encodedParserLabel = encodeURIComponent(parserLabel);
      console.log(encodedParserLabel);
      let encodedDocName = encodeURIComponent(docName);
      console.log(encodedDocName);

      console.log(ADD_DOC_INTO_DB_URL + '/' + curUser + '/' + encodedDocName + '/' + docID + '/'
        + encodedParserLabel + '/' + parserID + '/' + 'fakejson' + '/');

      let storeTestResult = this.http.get(ADD_DOC_INTO_DB_URL + '/' + curUser + '/'
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
    return this.http.get(SHOW_DOCS_URL + '/' + user)
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
    return this.http.get(GET_PARSED_JSON_URL + '/' + parserId + '/' + documentId)
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
    return this.http.get(HASH_JSON_URL + '/' + parserId + '/' + documentId)
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
    return this.http.get(UPDATE_DB_WITH_HASH_URL + '/' + parserId + '/' + documentId + '/' + storageMethod + '/' + hash)
      .pipe(tap(data => {
        console.log("updateDBWithHash done");
      }),
        catchError(err => {
          console.log('Unable to retrieve parsed Json', err);
          return err;
        })
      );
  }

  storeInIpfs(parserId: string, documentId: string) {
    return this.http.get(STORE_IN_IPFS_URL + '/' + parserId + '/' + documentId)
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
    return this.http.get(RETRIEVE_FROM_IPFS_URL + '/' + cid)
      .pipe(tap(data => {
        console.log("retrieveFromIpfs done");
      }),
        catchError(err => {
          console.log('Unable to store into IPFS', err);
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
        .get(UPLOAD_URL)
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
