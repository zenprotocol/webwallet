// @flow

import bech32 from 'bech32'

const validPrefixes = ['zen', 'tzn', 'czen', 'ctzn']

export const isDev = () => process.env.NODE_ENV === 'development'

export const truncateString = (string: ?string) => {
  if (string) {
    return string.length > 12
      ? `${string.substr(8,6)}...${string.substr(string.length - 6)}`
      : string
  }
}

export const stringToNumber = (str: ?string) => str && parseFloat(str.replace(/,/g, ''))

export const isValidAddress = (address: ?string, type?: 'contract' | 'pubKey' = 'pubKey'): boolean => {
  try {
    const { prefix, words } = bech32.decode(address)
    const pkHash = bech32.fromWords(words.slice(1))
    const isPrefixValid = (validPrefixes.indexOf(prefix) > -1)
    return type === 'contract'
      ? pkHash.length === 36 && isPrefixValid
      : pkHash.length === 32 && isPrefixValid
  } catch (err) {
    // uncomment for debugging, this throws many errors from the bech32 package
    // console.error('validateAddress err', err)
    return false
  }
}

export const getNamefromCodeComment = (code: string) => {
  const startRegex = /NAME_START:/
  const endRegex = /:NAME_END/

  const startIsPresent = startRegex.test(code)
  const endIsPresent = endRegex.test(code)

  if (startIsPresent && endIsPresent) {
    const indexOfStart = code.indexOf('NAME_START:') + 11
    const indexOfEnd = code.indexOf(':NAME_END')
    const length = indexOfEnd - indexOfStart
    const name = code.substr(indexOfStart, length).trim()
    return name
  }
  return false
}

export const minimumDecimalPoints = (num: string | number, decimalPoints: number): string => {
  num = Number(num)
  return num.toFixed(Math.max(decimalPoints, (num.toString().split('.')[1] || []).length))
}

export const numberWithCommas = (x: number | string): string => {
  const parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}
