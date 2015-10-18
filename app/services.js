var myServices = angular.module('myServices', []);

myServices.service('chatService', function($http, $q, $timeout){
    var chatService = this;
    chatService.serverConfiguration = {};
    chatService.activeChat = null;
    chatService.activeChatEvents = [];
    chatService.minimized = false;

    chatService.startChat = function(participantInfo, workgroup, server) {
        chatService.baseURL = 'webtools/' + server + '/websvcs/'; // 'http://morbo:8114/websvcs/';
        chatService.activeChatEvents = [];
        
        var data = {
            "supportedContentTypes": "text/plain",
            "participant":participantInfo,
            "transcriptRequired": false,
            "emailAddress": "",
            "target": workgroup,
            "targettype": "Workgroup"
        };
        var request = $http.post(chatService.baseURL + 'chat/start', data);

        return (request.success(saveChatInfo));
    };

    chatService.minimizeChat = function() {
        chatService.minimized = !chatService.minimized;
    };

    chatService.closeChat = function() {
        if(chatService.activeChat != null)
            chatService.endChat();
        document.getElementsByClassName('i3chat')[0].style.display = 'none';
    };

    chatService.endChat = function() {
        var request = $http.post(chatService.baseURL + 'chat/exit/' + chatService.activeChat.participantID);
        
        request.success(function() {
            chatService.activeChat = null;
            console.log('Ending Chat...');
        });
    };

    chatService.sendMessage = function(messageText) {
        var data = {
            "message" : messageText,
            "contentType":"text/plain"
        };
        var request = $http.post(chatService.baseURL + 'chat/sendMessage/' + chatService.activeChat.participantID, data);

        request.success(function() {
            console.log('Sending Message...');
        });
    };

    chatService.poll = function(){
        if(chatService.activeChat === null || typeof(chatService.activeChat) === 'undefined') {
            return;
        }
        var request = $http.get(chatService.baseURL + 'chat/poll/' + chatService.activeChat.participantID);

        request.success(function(data) {
            if (data.chat.events.length > 0) {
                chatService.activeChatEvents = chatService.activeChatEvents.concat(data.chat.events);
                scrollDown();
            }
            $timeout(chatService.poll, data.chat.pollWaitSuggestion);
        });
    };
    
    chatService.setTyping = function(isTyping) {
        var data = {
            typingIndicator: isTyping
        };
        var request = $http.post(chatService.baseURL + 'chat/setTypingState/' + chatService.activeChat.participantID, data);
        
        request.success(function() {
            console.log('Set the typing indicator: ' + isTyping);
        });
    };

    // ---
    // PRIVATE METHODS.
    // ---
    function saveChatInfo(data){
        if (data.chat.status.type == "success") {
            chatService.activeChat = data.chat;
            chatService.poll();
        } else {
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

    function scrollDown() {
        var el = $('.message-holder');
        el.animate({ scrollTop: el[0].scrollHeight}, 1000);
    }
});
