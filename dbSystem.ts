import { createState, Downgraded } from '@hookstate/core'
import { UserId } from '@xrengine/common/src/interfaces/UserId'
import { useState } from '@hookstate/core'
import { Engine } from '@xrengine/engine/src/ecs/classes/Engine'
import { World } from '@xrengine/engine/src/ecs/classes/World'
import { createReceptor } from  './receptor'
import { client } from '@xrengine/client-core/src/feathers'
import { handleCommand } from './commandHandler'

export const DBState = createState({
    players: [] as Array<{
        userId: UserId,
        isConnected: boolean
    }>
})

export type DBStateType = typeof DBState

// Attach logging
DBState.attach(() => ({
    id: Symbol('Logger'),
    init: () => ({
      onSet(arg) {
        console.log('DB STATE \n' + JSON.stringify(DBState.attach(Downgraded).value, null, 2))
      }
    })
}))

export function accessDBState() {
    return DBState.attach(Downgraded).value
}
export function useDBState() {
    return useState(DBState) as any as typeof DBState
}

globalThis.DBState = DBState
console.log('initializing db system script')

client.service('message').on('create', (msg) => {
    console.log('got new message: ' + JSON.stringify(msg));
})

export default async function dbSystem(world: World) {
    console.log('init db system')
    world.receptors.push(createReceptor(DBState))

    return () => {
        return world
    }
}