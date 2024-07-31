import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../services/stock.service';


@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule ,CommonModule],
  providers: [StockService],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatContainer') private chatContainer: ElementRef | undefined;
  
  stockExchanges: app.models.StockExchangeModel[] = [];
  messages: (app.models.Message | app.models.ChatbotMessage)[] = [];
  selectedStockExchange: string | undefined;
  lastMessage: app.models.Message | undefined;
  userId: string = "1";

  constructor(
    private stocksService: StockService,
    private cdr: ChangeDetectorRef
  ) { 
    
  }

  ngOnInit(): void {
    const welcomeText: app.models.ChatbotMessage = {
      author: "bot",
      text: "Hello! Welcome to LSEG Chatbot! I am here to help you!",
      timestamp: new Date(),
      selections: [],
      isDisabled: false,
      hasError: false
    }
    this.messages.push(welcomeText);
    this.getStockExchangeList();
  }

  /// GETS 
  getStockExchangeList() {
    this.stocksService.getStockExchangeList().subscribe(result=> { 
      this.stockExchanges = result;

     this.displayStockExchangeMessage();
    }, error => { 
      if (this.lastMessage) {
        this.lastMessage.hasError = true;
      }
    })
  }
  
  getStocksByStockExchangeId(){
    if(this.selectedStockExchange) { 
      this.stocksService.getStocksByStockExchangeId(this.selectedStockExchange).subscribe(result => { 
        const selections: app.models.Selection[] = result.map(stock => ({
          name: stock.name,
          code: stock.code,
          id: stock.stockId,
          selectionType: "STOCK",
        }));
        const chatbotMesage: app.models.ChatbotMessage = { 
          author: "bot",
          text: "Please select a stock",
          isDisabled: false,
          timestamp: new Date(),
          selections: selections,
          hasError: false
        }
        this.messages.push(chatbotMesage);
      }, error => { 
        if (this.lastMessage) {
          this.lastMessage.hasError = true;
        }
      });
    }
  }
 
  getStockById(stockId: string) { 
    this.stocksService.getStockById(stockId).subscribe(stock => { 
      const selections: app.models.Selection[] = [
        {
          name: "Go back",
          code: "GO_BACK",
          id: undefined,
          selectionType: "GO_BACK"
        },
        {
          name: "Main menu",
          code: "MENU",
          id: undefined,
          selectionType: "MAIN_MENU"
        },
  
      ]
      const chatbotMesage: app.models.ChatbotMessage = { 
        author: "bot",
        text: `Stock price of ${stock.name} is ${stock.price}`,
        isDisabled: false,
        timestamp: new Date(),
        selections: selections,
        hasError: false
      }
      this.messages.push(chatbotMesage);
    });
  }
  
  /// DISPLAY: 
  onSelectionClick(selection: app.models.Selection, message: app.models.ChatbotMessage): void {

    this.lastMessage = {
      author: "user",
      text: `${selection.name} (${selection.code})`,
      timestamp: new Date(),
      hasError: false
    };

    if(selection.id) { 
      var entityTypeCode = selection.selectionType;
      this.getNextChatbotMessage(selection.selectionType, selection.id);
      this.stocksService.recordEntityActivity(this.userId, selection.id, entityTypeCode).subscribe(result => { 
      });
    } 

    if(this.lastMessage && this.lastMessage.hasError == false) { 
      message.isDisabled = true;
    }
    this.messages.push(this.lastMessage);

    if(selection.selectionType == "MAIN_MENU" || selection.selectionType == "GO_BACK") { 
      this.displayNextChatbotMessage(selection.selectionType);
    }

    this.scrollToBottom();
  }

  getNextChatbotMessage(selectionType: string, id: string) { 
    if(selectionType == "STOCK_EXCHANGE") { 
      this.selectedStockExchange = id;
      this.getStocksByStockExchangeId();
    } 

    if(selectionType == "STOCK") { 
     this.getStockById(id);
    }

    setTimeout(() => {
      this.scrollToBottom();
    }, 1000);
  }

  displayNextChatbotMessage(selectionType: string) { 
    if(selectionType == "MAIN_MENU") { 
      this.displayStockExchangeMessage();
    }

    if(selectionType == "GO_BACK") { 
      this.getStocksByStockExchangeId();
    }
  }

  displayStockExchangeMessage() { 
    const selections: app.models.Selection[] = this.stockExchanges.map(exchange => ({
      name: exchange.name,
      code: exchange.code,
      id: exchange.stockExchangeId,
      selectionType: "STOCK_EXCHANGE",
    }));

    const firstMessage: app.models.ChatbotMessage = {
      author: "bot",
      text: "Please select a Stock Exchange.",
      timestamp: new Date(),
      selections: selections,
      isDisabled: false,
      hasError: false
    }

    this.messages.push(firstMessage);
  }
  
  scrollToBottom(): void {
    if (this.chatContainer) {
      const container = this.chatContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
      this.cdr.detectChanges()
    }
  }

  /// GUARDS
  isStockModel(item: any): item is app.models.StockModel {
      return (item as app.models.StockModel).stockExchangeId === undefined;
  }

  isChatbotMessage(message: app.models.Message | app.models.ChatbotMessage): message is app.models.ChatbotMessage {
    return 'selections' in message;
  }
}
