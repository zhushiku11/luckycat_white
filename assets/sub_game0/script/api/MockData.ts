import MOCK_DATA from 'db://assets/doge/framework/network/MockHelper';
import { api } from './api';


Object.defineProperty(MOCK_DATA, api.newUserReward, {
    value: {
        SbmAcg: {
            SbmRnw: 0.9,
        },
        SbmUso: {
            SbmMny: 1.5,
        }
    }
})

Object.defineProperty(MOCK_DATA, api.withdrawPlatform, {
    value: {
        SbmWr: [
            {
                SbmWro: 0.00025,
                SbmAdy: 0,
                SbmBen: 0,
                SbmEnd: 9,
            },
            {
                SbmWro: 0.0003,
                SbmAdy: 1,
                SbmBen: 10,
                SbmEnd: 49,
            },
            {
                SbmWro: 0.00035,
                SbmAdy: 2,
                SbmBen: 50,
                SbmEnd: 149,
            },
            {
                SbmWro: 0.0004,
                SbmAdy: 3,
                SbmBen: 150,
                SbmEnd: 99999999,
            },
        ],
        SbmWwf: [
            {
                SbmMe: "paypal",
                SbmMlt: 0.1,
            }
        ],
        SbmUso: {
            SbmEwl: 0.55,
            SbmLgd: 10,
            SbmBaci: 2.0,
            SbmMny: 2.0,
            SbmRts: -1,
            SbmImg: 1,
        }
    }

})

Object.defineProperty(MOCK_DATA, api.withdrawInfo, {
    value: {
        sm_one: 10,
        sm_one_rate: 5,
        sm_two: 30,
        sm_two_rate: 10,
        sm_three: 50,
        sm_three_rate: 20,
        next_day: 86459
    }
})

Object.defineProperty(MOCK_DATA, api.uploadLevel, {
    value: {}
})