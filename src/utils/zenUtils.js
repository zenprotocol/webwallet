import { Decimal } from 'decimal.js'

import { ZEN_ASSET_HASH, ZEN_TO_KALAPA_RATIO, ZENP_MAX_DECIMALS } from '../constants/constants'
import { minimumDecimalPoints, numberWithCommas } from '../utils/helpers'

export const isZenAsset = (asset: string) => asset === ZEN_ASSET_HASH
export const zenToKalapas = zen => Decimal.mul(zen, ZEN_TO_KALAPA_RATIO).toNumber()
export const kalapasToZen = kalapas => Decimal.div(kalapas, ZEN_TO_KALAPA_RATIO).toNumber()

/* eslint-disable function-paren-newline */
export const zenBalanceDisplay = kalapas =>
  numberWithCommas(
    minimumDecimalPoints(
      kalapasToZen(kalapas).toFixed(ZENP_MAX_DECIMALS),
      2,
    ),
  )
/* eslint-enable function-paren-newline */

export const normalizeTokens = (number: number, isZen: ?boolean) => {
  const newNumber = number / ZEN_TO_KALAPA_RATIO
  if (isZen) {
    const formattedNumber = newNumber.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })
    return formattedNumber
  }
  return number.toLocaleString()
}
