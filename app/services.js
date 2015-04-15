var myServices = angular.module('myServices',[]);


myServices.service('chatService',function($http,$q,$timeout){
  var chatService = this;
  chatService.baseURL = 'http://servername:5556/I3Root/Server1/websvcs/';
  chatService.serverConfiguration = {};
  
  chatService.activeChat = null;
	chatService.activeChatEvents = [];
	
	
   chatService.load = function(){
		var request = $http.get(chatService.baseURL + 'serverConfiguration');
		
		return (request.success(handleLoad));
   
   };
   
   chatService.startChat = function(participantInfo,workgroup){
   chatService.activeChatEvents = [];
   data = {
	"supportedContentTypes": "text/plain",
	"participant":participantInfo,
	"transcriptRequired": false,
	"emailAddress": "",
	"target": workgroup,
	"targettype": "Workgroup",
	"clientToken": "deprecated"



   };
	var request = $http.post(chatService.baseURL + 'chat/start',data);
	
	
	
	return (request.success(saveChatInfo));
   
   
   };
	
	chatService.endChat = function(){
	
		var request = $http.post(chatService.baseURL + 'chat/exit/' + chatService.activeChat.participantID);
		request.success(function(){
			chatService.activeChat = null;
			console.log('Ending Chat...');
		
		});
	};
	
	chatService.sendMessage = function(message_text){
	
		data = {
		"message" : message_text,
		"contentType":"text/plain"
		
		};
		var request = $http.post(chatService.baseURL + 'chat/sendMessage/' + chatService.activeChat.participantID,data);
		
		request.success(function(){
			console.log('Sending Message...');
		});
		
	};
	
	chatService.getAgentsAvailable = function(){
		var data = {
		"queueName" : "Accounting",
		"queueType" : "Workgroup",
		"participant":{
			"name": "Admin",
			"credentials":null
		
		}
		};
		
		var request = $http.post(chatService.baseURL + 'queue/query',data);
		request.success(function(data){
			console.log(data);
		
		
		});
		


	
	}
	chatService.poll = function(){
		if(chatService.activeChat == null || typeof(chatService.activeChat) === 'undefined')
			return;
		//console.log('Polling for ' + chatService.activeChat.participantID);
		var request = $http.get(chatService.baseURL + 'chat/poll/'+ chatService.activeChat.participantID);
		
		request.success(function(data){
		
			//console.log(data);
			if(data.chat.events.length > 0){
				//console.log('GASP SOMETHING HAPPENED');
				chatService.activeChatEvents = chatService.activeChatEvents.concat(data.chat.events);
			}
			$timeout(chatService.poll,data.chat.pollWaitSuggestion);
		});
	}


  // ---
  // PRIVATE METHODS.
  // ---
	function saveChatInfo(data){
	
		
	
		if(data.chat.status.type == "success"){
			chatService.activeChat = data.chat;
			chatService.poll();
		}else{
			console.error(data.chat.status.reason);
		}
		return data.chat.status.type;
	
	}

  // I transform the error response, unwrapping the application dta from
  // the API response payload.

  function handleError(response) {

    // The API response from the server should be returned in a
    // nomralized format. However, if the request was not handled by the
    // server (or what not handles properly - ex. server error), then we
    // may have to normalize it on our end, as best we can.
    if (!angular.isObject(response.data) ||
      !response.data.message) {

        return ($q.reject("An unknown error occurred."));

      }

      // Otherwise, use expected error message.
      return ($q.reject(response.data.message));

    }


    // I transform the successful response, unwrapping the application data
    // from the API response payload.

    function handleSuccess(response) {

      return (response.data);

    }
	
	 function handleLoad(data) {
		chatService.serverConfiguration = data[0].serverConfiguration;
      return ('success');

    }
  

});
