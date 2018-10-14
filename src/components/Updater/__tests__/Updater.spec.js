import React from 'react'
import { shallow } from 'enzyme'

import Updater from '../Updater'
import updateModal from '../UpdateModal'
import { checkForUpdates } from '../Update'

jest.mock('../Update', () => ({
  checkForUpdates: jest.fn(),
}))

jest.mock('../UpdateModal', () => jest.fn())
jest.spyOn(window, 'setTimeout')

afterEach(() => {
  checkForUpdates.mockReset()
  updateModal.mockReset()
  window.setTimeout.mockClear()
})

describe('Updater', () => {
  describe.skip('when checkForUpdates returns some string', () => {
    describe('and UpdateModal is canceled', () => {
      beforeEach(() => {
        checkForUpdates.mockReturnValue(Promise.resolve('some link'))
        updateModal.mockReturnValue(Promise.resolve(true))
        shallow(<Updater />)
      })

      it('calls UpdateModal with some link', () => {
        expect(updateModal).toHaveBeenCalledWith('some link')
      })
    })

    describe('and download is clicked on UpdateModal', () => {
      beforeEach(() => {
        checkForUpdates.mockReturnValue(Promise.resolve('some link'))
        updateModal.mockReturnValue(Promise.resolve())
        shallow(<Updater />)
      })

      it('does not call setTimeout', () => {
        expect(window.setTimeout).not.toHaveBeenCalled()
      })
    })
  })

  describe('when checkForUpdates returns undefined', () => {
    beforeEach(() => {
      checkForUpdates.mockReturnValue(Promise.resolve())
      shallow(<Updater />)
    })

    it('does not call UpdateModal', () => {
      expect(updateModal).not.toHaveBeenCalled()
    })

    it('calls setTimeout with some function and poll interval', () => {
      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000 * 60)
    })
  })
})
