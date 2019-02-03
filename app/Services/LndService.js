'use strict'

const lnService = require('ln-service')
const Env = use('Env')
const decodePaymentRequest = require('ln-service/decodePaymentRequest')

let lndInstance = null

class LndService {
    
    async getLndInstance(){
        if(lndInstance == null){
            lndInstance = await lnService.lightningDaemon({
                socket: this.getNodeAddress(),
                macaroon: Env.get('LND_MACAROON'),
            });
        }
        return lndInstance
    }

    getNodeAddress(){
        return `${Env.get('LND_HOST')}:${Env.get('LND_PORT')}`
    }

    async payment(pr){
    try {
        const lnd = await getLndInstance()
        // Returns the logged in user instance
        const user = await auth.getUser()
        const decodedPayReq = await decodePaymentRequest({ lnd, request: pr })
        if (decodedPayReq.tokens > user.balance) {
            return response.message({ error: "Not enough found" })
        }
        if (decodedPayReq.is_expired) {
            return response.message({ error: "Invoice is expired" })
        }
        const invoicePaid = await payInvoice({ lnd, request: pr });

    }catch(error){
        Logger.error(error)
    }
}

}

module.exports = new LndService()