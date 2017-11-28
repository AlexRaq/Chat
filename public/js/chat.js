;(function ($){

    class Chat{
        constructor() {
            this.socket = io();
            this._connected = this.socket.connected;
            this._form = $('.message-wrap form');
            this._input_message = $('.input-message');
            this._typing_block = $('.typing');
            this._chat_container = $('.chat-wrap');
            this._user_name = localStorage.userName || 'azaza';
            this._error_block = $('.alert-danger')
            this._start_typing = false;
            this._time_start_typing = 0;
        }
        init(){
                let self = this;
                console.log(this._form);
                this.clientEvent(self);
                this.socketEvent(self);
            }

         clientEvent(self){
             this._form.on('submit', function (e) {
                 e.preventDefault();
                 if(!self._input_message.val()) return self.showError('vi ne vveli vsyakuyu dich', self)
                 self.socket.emit('chat message', self._input_message.val());

             });
             this._input_message.on('input', function(){
                 self.socket.emit('chat write_message')
             });
             this

         }
         socketEvent(self){
             this.socket.on('chat message', function (message) {
                 console.log(message);
                 self._input_message.val('');
                 self.addMessage(message)
             });
             this.socket.on('chat write_message', function(){
                 console.log('writing')
                 self._start_typing = true;
                 self._time_start_typing = Date.now();
                 self.addChatTyping();
                 self.updateTyping(self);
             })
             this.socket.on('chat connection', function(){
                 console.log('user connected');
                 self.onConnect()
             });
             this.socket.on('chat stop_write', function(){
                 console.log('user stop_write');
                 self.removeChatTyping();

             });

         }

         onConnect(){
             let str = `<div class="alert alert-primary" role="alert">
                          New user connected ${this._user_name}
                       </div>`;

             this._chat_container.append(str);
         }

         addMessage(msg){
             let msgElement = `
                <div class="message">
                    <div class="userName">${this._user_name}</div>
                    <div class="userMessage">${msg}</div>
                </div> 
               `;
             this._chat_container.append(msgElement);
         }
        showError(error, self){
             this._error_block.text(error)
             this._error_block.fadeIn();
             setTimeout(function(){
                 self._error_block.fadeOut();
             }, 2000)
        }
        addChatTyping(){
            this._typing_block.fadeIn();

        }
        removeChatTyping(){
            this._typing_block.fadeOut();
        }
        updateTyping(self){
            setTimeout(function(){
                let time = Date.now();
                let timeDiff = time - self._time_start_typing;
                if(timeDiff >= 500 && self._start_typing){
                    self.socket.emit('chat stop_write');
                    self._start_typing = false;
                }
            }, 500)
        }
    }
    let chat = new Chat();
    chat.init();
})(jQuery);