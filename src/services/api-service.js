// @flow
import axios from 'axios'

import chain, { MAINNET } from './chain'

const mainnetInstance = axios.create({
  baseURL: 'https://remote-node.zp.io/api/',
  headers: {'Access-Control-Allow-Origin': '*'}
})

const testnetInstance = axios.create({
  baseURL: 'https://testnet-remote-node.zp.io/api/',
  headers: {'Access-Control-Allow-Origin': '*'}
})

const mainnetBlockExplorer = axios.create({
  baseURL: 'https://zp.io/api/votes/',
  headers: {'Access-Control-Allow-Origin': '*'}

})

const testnetBlockExplorer = axios.create({
  baseURL: 'https://staging-testnet.zp.io/api/votes/',
  headers: {'Access-Control-Allow-Origin': '*'}
})

const getInstance = () => chain.current === MAINNET ? mainnetInstance : testnetInstance

const getBE = (chain) => chain === MAINNET ? mainnetBlockExplorer : testnetBlockExplorer

// const crowdsaleServerAddress = getCrowdsaleServerAddress()

type Hash = string;

type Address = string;

type ActiveContract = {
  contractId: Hash,
  address: Address,
  expire: number,
  code: string
};

export async function getActiveContracts(): Promise<ActiveContract[]> {
  const response = await getInstance().get('activecontracts')
  return response.data
}

type BlockChainInfo = {
  chain: string,
  blocks: number,
  headers: number,
  difficulty: number,
  medianTime: number
};
export async function getNetworkStatus(): Promise<BlockChainInfo> {
  const response = await getInstance().get('info')
  return response.data
}

export async function getCurrentInterval(chain) {
  const response = await getBE(chain).get('relevant')
  return response.data
}

export async function getCandidates(chain) {
  const response = await getBE(chain).get('candidates')
  return response.data.data
}

export async function getNextInterval() {
  const response = await getBE().get('next')
  return response.data
}

export async function getContractHistory(chain: string, contractId: string, skip, take) {
  const endpoint = chain === MAINNET ? 'https://remote-node.zp.io' : 'https://testnet-remote-node.zp.io'
  const data = {
    skip,
    take,
    contractId,
  }
  const response = await axios.post(`${endpoint}/addressdb/contract/history/`, data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data
}

// CROWDSALE APIS //

/* eslint-disable camelcase */
export async function getCheckCrowdsaleTokensEntitlement(
  pubkey_base_64: string,
  pubkey_base_58: string,
) {
  return false
  // console.log('crowdsaleServerAddress', crowdsaleServerAddress)

  // const url = `${crowdsaleServerAddress}/check_crowdsale_tokens_entitlement?pubkey_base_64=${pubkey_base_64}&pubkey_base_58=${pubkey_base_58}`

  // const response = await getInstance().get(url)
  // console.log('getCheckCrowdsaleTokensEntitlement response', response)
  // return response.data
}

export async function postRedeemCrowdsaleTokens(data: *) {
  // const response = await getInstance().post(`${crowdsaleServerAddress}/redeem_crowdsale_tokens`, data, {
  //   headers: { 'Content-Type': 'application/json' },
  // })

  // return response.data
}
/* eslint-enable camelcase */
