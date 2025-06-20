// echo.js - Configuração corrigida
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

const echo = new Echo({
  broadcaster: 'pusher',
  key: 'base64:IV08o1yU7BGPbwulB/S5lLyfFNAWBKS1ggvcVHviV2E=',
  wsHost: '216.24.57.4',
  wsPort: 6001,
  forceTLS: true,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  cluster: 'mt1' 
})

export default echo