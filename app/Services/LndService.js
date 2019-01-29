'use strict'

const lnService = require('ln-service')
const Env = use('Env')

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

}

module.exports = new LndService()