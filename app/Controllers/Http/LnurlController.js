'use strict'
const createInvoice = require('ln-service/createInvoice')
const decodePaymentRequest = require('ln-service/decodePaymentRequest')   
const LndService = use('App/Services/LndService')
const bech32 = require('bech32')
const crypto = require('crypto')
const Logger = use('Logger')
const getWalletInfo = require('ln-service/getWalletInfo')


const NonceHashMap = {}
const k1HashMap = {}

// see https://github.com/btcontract/lnurl-rfc/blob/master/spec.md
class LnurlController {

    // route: /withdraw/
async requestWithdrawal ({auth, response}) {
    try {
            // create random nonce for the user
            const nonce = Math.floor(Math.random() * 1000000) // TODO: stronger source of randomness
            // const nonce = crypto.randomBytes()

            // add item to hashmap
            NonceHashMap[Hash.make(nonce)] = auth.user.id 
                
            return response.json({
                data: bech32.encode('LNURL', 'https://satoshis.games/withdraw/confirmation?q='+nonce.toUpperCase())
            })
    }catch(error){
        Logger.error(error)
        return response.json({error})
    }
}

// route: /withdraw/confirmation
async confirmWithdrawal ({response, request}) {
        
        const { q } = request.all()

        if (Hash.make(q) in NonceHashMap){

            const existingUserId = NonceHashMap[Hash.make(q)]

            delete NonceHashMap[Hash.make(q)]; // Invalidate a QR

            const secondLevelNonce = Math.floor(Math.random() * 1000000) // TODO: stronger source of randomness

            k1HashMap[Hash.make(secondLevelNonce)] = existingUserId

            // Return json object with the resources needed for the withdrawal
            return response.json({
                callback: "https://satoshis.games/withdrawal/execute",
                k1: secondLevelNonce,
                maxWithdrawable: 2000, // msat
                defaultDescription: "withdraw from satoshis.games",
                tag: "withdrawRequest",
            })
        }
}

// route: /withdraw/execute
async executeWithrawal ({request}) {
        
        const { k1 } = request.all() 

        const { pr } = request.all()
        
        // verify the user who made the 1st request has the k1 secret to withdraw his funds
        // otherwise anyone could scan the qr code quicker and steal those funds
        if (Hash.make(k1) in k1HashMap){

            const existingUserId = k1HashMap[Hash.make(k1)]

            delete k1HashMap[Hash.make(k1)];
            this.makePayment({pr})

            response.ok()
        } else {
        return json({ status: "ERROR", reason: "Second level nonce not found" })
        }
    }
 
    async makePayment ({pr, response, auth}) {
        try {
            const lnd = await LndService.getLndInstance()
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

module.exports = LnurlController
