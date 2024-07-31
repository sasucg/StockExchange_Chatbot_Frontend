declare namespace app.models { 
    export interface Message {
        author: string;
        timestamp: Date;
        text: string;
        hasError: boolean;
    }

    export interface ChatbotMessage extends Message { 
        selections: app.models.Selection[] | undefined; 
        isDisabled: boolean;
    }

    export interface Selection { 
        selectionType: string;
        name: string;
        code: string;
        id: string | undefined;
    }
}