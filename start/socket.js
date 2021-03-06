'use strict'
const LndService = use('App/Services/LndService')
const Ws = use('Ws')
const Logger = use('Logger')
const lnService = require('ln-service')


let websocket = null
Ws.channel('invoice', 'WsInvoiceController')

const initWS = async () => {

  // Since BTCPay Server closes WS every 90 seconds it must be looped recursively
  try {
      // Instantiate LN daemon
      const lnd = await LndService.getLndInstance()
      websocket = lnService.subscribeToInvoices({
          lnd
      })

      websocket.on('error', async err => {
          // recursive call
          try {
              await initWS()
          } catch (err) {
              Logger.error(err)
          }
      })


      // When Invoice is created
      websocket.on('data', async data => {

          // If invoice is paid
          if (data.is_confirmed) {

          // Invoice payment notification
          Logger.info('Invoice Paid')

          } else {
              // Invoice creation notification
              Logger.notice('Invoice created')
          }
      })
} catch (err){
    Logger.error(err)
}

// Since BTCPay Server closes WS every 90 seconds it must be looped recursively
try {
    initWS()
    } catch (error) {
    Logger.error(error)
    }
}