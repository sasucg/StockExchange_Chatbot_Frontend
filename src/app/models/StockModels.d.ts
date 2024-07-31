declare namespace app.models { 
    export interface StockExchangeModel { 
        stockExchangeId: string;
        name: string;
        code: string,
    }

    export interface StockModel { 
        stockExchangeId: string;
        stockId: string;
        name: string;
        code: string,
        price: number;
    }

}