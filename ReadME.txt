Application will navigate through StockExchanges and Stocks 
and it will SAVE user click history for those 2 entities.

Main Frontend components:

-> Chatbot Component	- used to display chatbot
-> Stock Service 	- used to request data from service
-> Models: 
	-> StockModels	-> StockExchangeModel & StockModel
	-> MessageModel -> used to display a user message 
	-> ChatbotMessage -> by extending MessageModel -> used to display chatbot message with selections
	-> Selection -> used to display available selections of a chatbot message
