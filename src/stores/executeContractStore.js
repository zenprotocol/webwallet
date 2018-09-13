import { observable, action, runInAction, computed } from 'mobx'
import { fromYaml, serialize } from '@zen/zenjs/build/src/Data'

import wallet from '../services/wallet'
import { zenToKalapas, isZenAsset } from '../utils/zenUtils'

class ExecuteContractStore {
    @observable address = ''
    @observable amountDisplay = ''
    @observable returnAddress = true
    @observable command = ''
    @observable messageBody = ''
    @observable status = ''
    @observable inProgress = false
    @observable asset = ''

    constructor(activeContractsStore) {
        this.activeContractsStore = activeContractsStore
    }

    @action
    async run(password) {
        this.inProgress = true
        const payloadData = { ...this.payloadData, password }
        const { address, command, messageBody, options, spends } = payloadData
        console.log(payloadData)
        try {
            await wallet.instance.executeContract(address, command, messageBody, options.returnAddress, spends)
            runInAction(() => {
                this.inProgress = false
                this.resetForm()
                this.status = 'success'
                setTimeout(() => {
                    this.status = ''
                }, 15000)
            })
        } catch (err) {
            console.error('err', err.message, err)
            runInAction(() => {
                this.inProgress = false
                this.status = 'error'
                // TODO :: refactor after API responses are stable
                if (err && err.response && err.response.data) {
                    this.errorMessage = err.response.data
                }
                setTimeout(() => {
                    this.status = ''
                }, 15000)
            })
        }
    }

    @action
    updateAddress(address) {
        this.address = address
        this.amountDisplay = ''
    }

    @action
    updateAmountDisplay(amountDisplay) {
        this.amountDisplay = amountDisplay
    }

    @action
    updateMessageBody(messageBody) {
        this.messageBody = messageBody
    }

    @action
    toggleReturnAddress = () => {
        this.returnAddress = !this.returnAddress
    }

    @computed
    get messageBodyError() {
        if (!this.messageBody) {
            return ''
        }
        try {
            fromYaml('main', this.messageBody)
            return ''
        } catch (err) {
            console.error('error parsing message body', err)
            return 'Body must be valid yaml syntax'
        }
    }

    @action
    resetForm = () => {
        this.inProgress = false
        this.asset = ''
        this.address = ''
        this.returnAddress = false
        this.amountDisplay = ''
        this.command = ''
        this.messageBody = ''
        this.errorMessage = ''
        this.status = ''
    }

    get amount() {
        return Number(this.amountDisplay)
    }

    get amountToSend() {
        return isZenAsset(this.asset) ? zenToKalapas(this.amount) : this.amount
    }

    get payloadData() {
        const data = {
            address: this.address,
            options: { returnAddress: this.returnAddress },
        }
        if (this.asset) {
            data.spends = [{ asset: this.asset, amount: this.amountToSend }]
        }
        if (this.command) {
            data.command = this.command
        }
        if (this.messageBody) {
            data.messageBody = serialize(fromYaml('main', this.messageBody))
        }
        return data
    }

}

export default ExecuteContractStore
