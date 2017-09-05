// import Sudoer from 'electron-sudo'
// let options = {name: 'Car17 Tracker'}
// let sudoer = new Sudoer(options)

let ip = require('ip')
let Cap = require('cap').Cap
let decoders = require('cap').decoders
let PROTOCOL = decoders.PROTOCOL
let data
let pattern = ['signInSuccess',
  'welcome',
  'userName',
  'AddToHand',
  '~newTurn',
  'turnTimerSet',
  'dr:you',
  'dr:deck',
  'dr:opponent',
  'dr:gameMembers',
  'setQuantity',
  'createGameCard',
  'iam',
  'startGame',
  'END_GAME',
  'startPracticeGame',
  'startFindGame',
  'stopFindGame',
  'mulliganConfirm',
  'pickedDeckId',
  'pickDeck',
  'createDeck',
  'confirmDeck',
  'deckIn',
  'deckOut',
  'DeckIns',
  'saveDeck'
]

let pcap = {
  loggedIn: false,
  buffer: null,
  cap: null,

  // LISTEN FOR TCP REQUESTS FOR DETERMINED PATTERNS
  start () {
    let c = new Cap()

    let device = Cap.findDevice(ip.address())
    let filter = 'tcp port 2201 or 2202'
    let bufSize = 10 * 1024 * 1024
    let buffer = Buffer.alloc(65535)
    let linkType = c.open(device, filter, bufSize, buffer)

    c.setMinBytes && c.setMinBytes(0)

    this.cap = {
      linkType,
      buffer,
      decoders,
      PROTOCOL,
      c
    }

    return this
  },
  handle (nbytes, trunc) {
    if (this.cap.linkType === 'ETHERNET') {
      let ret = this.cap.decoders.Ethernet(this.cap.buffer)
      if (ret.info.type === this.cap.PROTOCOL.ETHERNET.IPV4) {
        ret = decoders.IPV4(this.cap.buffer, ret.offset)
        if (ret.info.protocol === this.cap.PROTOCOL.IP.TCP) {
          let datalen = ret.info.totallen - ret.hdrlen
          ret = decoders.TCP(this.cap.buffer, ret.offset)
          datalen -= ret.hdrlen
          data = this.cap.buffer.toString('binary', ret.offset, ret.offset + datalen)

          let found = false
          for (let p of pattern) {
            if (data.indexOf(p) > 0) {
              found = true
            }
          }

          return (found) ? data : ''
        }
      }
    }
  },
  // RETURNS HANDLED PACKET
  // STORE IN BUFFER INITIAL DATA UNTIL LOGIN PROCEDURE ENDS
  prepare (nbytes, trunc) {
    data = this.handle(nbytes, trunc)

    // login again with tracker opened. restart login procedure
    if (data.indexOf('dr:orbs') > 0) {
      this.loggedIn = false
    }

    if (this.loggedIn === false) {
      this.buffer += data
      if (this.buffer.indexOf('$signInSuccess') > 0) {
        this.loggedIn = true
        data = this.buffer
        this.buffer = null
      }
    }

    if (this.loggedIn === true) {
      return this.cleanData(data)
    } else {
      return ''
    }
  },
  cleanData (data) {
    return data.toString()
  }
}

export default pcap
