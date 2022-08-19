/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { levelConf } from './conf'
import { LEVELS } from './maps'
import { roles } from './character'
import { enemy, patrol, bump } from './custom'

export const gameScene = () => {
    scene('game', (levelNumber = 0) => {
        layers(['bg', 'game', 'ui'], 'game')

        const level = addLevel(LEVELS[levelNumber], levelConf)

        add([sprite('cloud'), pos(20, 50), layer('bg')])

        add([sprite('hill'), pos(32, 208), layer('bg'), origin('bot')])

        add([sprite('shrubbery'), pos(200, 208), layer('bg'), origin('bot')])

        add([
            text('Level ' + (levelNumber + 1), { size: 24 }),
            pos(vec2(160, 120)),
            color(255, 255, 255),
            origin('center'),
            layer('ui'),
            lifespan(1, { fade: 0.5 }),
        ])

        const player = level.spawn('p', 1, 10)

        roles(player)

        player.onUpdate(() => {
            // center camera to player
            const currCam = camPos()

            if (currCam.x < player.pos.x) {
                camPos(player.pos.x, currCam.y)
            }
        })

        patrol()
        enemy()

        let canSquash = false

        player.onCollide('badGuy', baddy => {
            if (!baddy.isAlive) return
            if (canSquash) {
                // Mario has jumped on the bad guy:
                baddy.squash()
            } else {
                // Mario has been hurt. Add logic here later...
            }
        })

        onKeyPress('space', () => {
            if (player.grounded()) {
                player.jump()
                canSquash = true
            }
        })

        if (player.grounded()) {
            canSquash = false
        }

        bump()

        player.on('headbutt', obj => {
            if (obj.is('questionBox')) {
                if (obj.is('coinBox')) {
                    const coin = level.spawn('c', obj.gridPos.sub(0, 1))

                    coin.bump()
                } else if (obj.is('mushyBox')) {
                    level.spawn('M', obj.gridPos.sub(0, 1))
                }
                const pos = obj.gridPos

                destroy(obj)
                const box = level.spawn('!', pos)

                box.bump()
            }
        })
    })
}

export const startScene = () => {
    scene('start', () => {
        add([text('Press enter to start', { size: 24 }), pos(vec2(160, 120)), origin('center'), color(255, 255, 255)])

        onKeyRelease('enter', () => {
            go('game')
        })
    })
}
