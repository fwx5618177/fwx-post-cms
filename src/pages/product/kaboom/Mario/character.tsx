export const roles = (player: any) => {
    const SPEED = 120

    onKeyDown('right', () => {
        player.flipX(false)
        player.move(SPEED, 0)
    })

    onKeyDown('left', () => {
        player.flipX(true)
        if (toScreen(player.pos).x > 20) {
            player.move(-SPEED, 0)
        }
    })

    onKeyPress('space', () => {
        if (player.grounded()) {
            player.jump()
        }
    })
}
