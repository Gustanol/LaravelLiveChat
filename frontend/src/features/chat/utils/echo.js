import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

const echo = new Echo({
  broadcaster: 'pusher',
  key: 'app-key',
  wsHost: 'soketiserver.onrender.com',
  wsPort: 6001,
  wssPort: 6001,
  forceTLS: false,
  encrypted: true,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  cluster: 'mt1'
})

export default echo