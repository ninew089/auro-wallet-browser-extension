
import {NET_CONFIG_TYPE} from '../constant/walletType'
const UPDATE_NET_CONFIG = "UPDATE_NET_CONFIG"

const UPDATE_NETWORK_CHAINID_CONFIG = "UPDATE_NETWORK_CHAINID_CONFIG"

export const NET_CONFIG_DEFAULT = "DEFAULT"
export const NET_CONFIG_ADD = "ADD"

/**
 * update net config
 * @param {*} data 
 */
export function updateNetConfig(data) {
    return {
        type: UPDATE_NET_CONFIG,
        data
    };
}


/**
 * update net config
 * @param {*} data 
 */
 export function updateNetChainIdConfig(data) {
    return {
        type: UPDATE_NETWORK_CHAINID_CONFIG,
        data
    };
}

function getNetConfigData(state, config) {
    let netList = config.netList
    let currentConfig = config.currentConfig
    let selectList = []
    let currentNetName = ""


    currentNetName = currentConfig.name
    for (let index = 0; index < netList.length; index++) {
        const netConfig = netList[index];
        selectList.push({
            "value": netConfig.url,
            "label": netConfig.name
        })
    }
    return {
        netList,
        currentConfig,
        selectList,
        currentNetName
    }
}

const initState = {
    netList: [],
    currentConfig: {},
    currentNetConfig: {},
    netSelectList: [],
    currentNetName: "",
    networkConfig:[]
};

const network = (state = initState, action) => {
    switch (action.type) {
        case UPDATE_NET_CONFIG:
            let data = getNetConfigData(state, action.data)
            return {
                ...state,
                netList: data.netList,
                currentConfig: data.currentConfig,
                netSelectList: data.selectList,
                currentNetName: data.currentNetName,
                currentNetConfig: action.data,
            }
        case UPDATE_NETWORK_CHAINID_CONFIG:
            let chainIdList = action.data
            let netConfigList = state.netList
            let mainNetChainConfig = chainIdList.filter((config)=>{
                return config.type === "0" 
            })  
            let mainNetChainId = mainNetChainConfig.length > 0 ? mainNetChainConfig[0].chain_id:""
            let devNetChainConfig = chainIdList.filter((config)=>{
                return config.type === "1" 
            })  
            let devNetChainId = devNetChainConfig.length > 0 ? devNetChainConfig[0].chain_id:""
            
            let berkeleyNetChainConfig = chainIdList.filter((config)=>{
                return config.type === "11" 
            })  
            let berkeleyChainId = berkeleyNetChainConfig.length > 0 ? berkeleyNetChainConfig[0].chain_id:""

            let newNetConfigList = []
            for (let index = 0; index < netConfigList.length; index++) {
                let config = {...netConfigList[index]};
                if(config.type === NET_CONFIG_DEFAULT){
                    if(config.netType === NET_CONFIG_TYPE.Mainnet){
                        config.chainId = mainNetChainId
                    }else if(config.netType === NET_CONFIG_TYPE.Devnet){
                        config.chainId = devNetChainId
                    }else if(config.netType === NET_CONFIG_TYPE.Berkeley){
                        config.chainId = berkeleyChainId
                    }
                }
                newNetConfigList.push(config)
                
            }
            return {
                ...state,
                networkConfig: action.data,
                netList:newNetConfigList
            }
        default:
            return state;
    }
};

export default network;
