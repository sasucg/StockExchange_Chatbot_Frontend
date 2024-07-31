import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';


@Injectable()
export class StockService {
  constructor(private http: HttpClient) {
  }
  apiUrl: string = 'http://localhost:5174/api/Chatbot/stockExchange';

  getStockExchangeList(): Observable<app.models.StockExchangeModel[]> {
    return this.http.get<app.models.StockExchangeModel[]>(`${this.apiUrl}`)
      .pipe(
        map((response: any) => response)
      );
  }

  getStocksByStockExchangeId(stockExchangeId: string): Observable<app.models.StockModel[]> {
    return this.http.get<app.models.StockModel[]>(`${this.apiUrl}/${stockExchangeId}/stocks`)
      .pipe(
        map((response: any) => response)
      );
  }

  getStockById(stockId: string): Observable<app.models.StockModel> {
    return this.http.get<app.models.StockModel>(`${this.apiUrl}/stocks/${stockId}`)
      .pipe(
        map((response: any) => response)
      );
  }

  recordEntityActivity(userId: string, entityId: string, entityTypeCode: string): Observable<any> {
    debugger;
    const url = `${this.apiUrl}`;
    const body = {
      userId: userId,
      entityId: entityId,
      entityTypeCode: entityTypeCode,
    };
    return this.http.post<any>(url, body);
  }


}