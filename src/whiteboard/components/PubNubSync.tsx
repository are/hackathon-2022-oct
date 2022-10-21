import React, { useEffect, useState } from 'react'
import { MdPerson } from 'react-icons/md'

import { styled } from 'goober'
import PubNub from 'pubnub'

const pubnub = new PubNub({
  subscribeKey: 'sub-c-31730c0b-823f-4e44-95ad-86b02f8b674f',
  publishKey: 'pub-c-64e9ebcd-1f4f-4025-b90e-ef11e3c4919a',
  uuid: 'wb-test' + Math.random().toString(16).substring(2),
})

import { useWhiteboard } from '../context'

const Counter = styled('div')`
  display: flex;
  flex-direction: row;
  height: 32px;

  margin-left: 10px;
  margin-right: 20px;
  font-size: 25px;
  line-height: 38px;
  text-align: center;
  padding-bottom: 6px;
`

export function PubNubSync() {
  const [count, setCount] = useState(0)

  const { properties, setProperty, commit } = useWhiteboard(
    {
      name: 'PubNubSync',
      onCommit(operation) {
        pubnub.publish({
          channel: 'my-wb-test-channel',
          message: { type: 'drawing', cmd: operation },
          sendByPost: true,
        })
      },
    },
    []
  )

  useEffect(() => {
    const listener = {
      message(event) {
        if (event.publisher !== pubnub.getUUID() && event.message.type === 'drawing') {
          commit(event.message.cmd, true)
        }
      },
      presence(event) {
        setCount(event.occupancy)
      },
    }

    pubnub.subscribe({ channels: ['my-wb-test-channel'], withPresence: true })

    pubnub.addListener(listener)

    return () => {
      pubnub.removeListener(listener)
      pubnub.unsubscribeAll()
    }
  }, [])

  return (
    <Counter>
      <span style={{ marginRight: 5 }}> {count}</span>
      <MdPerson size={24} style={{ marginTop: 7 }} />
    </Counter>
  )
}
