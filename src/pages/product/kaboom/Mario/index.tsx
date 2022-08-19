import { useEffect, useRef } from 'react'
import kaboom from 'kaboom'
import api from '../api'
import Show from './show'

const MarioGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const init = () => {
        kaboom({
            background: [134, 135, 247],
            width: 550,
            height: 320,
            scale: 2,
            canvas: canvasRef.current as HTMLCanvasElement,
        })
        Show()
    }

    const queryList = async () => {
        const { baseURI, resources } = await api.queryMarioResource('mario')

        // 角色
        const roles = ['Mario.png', 'enemies.png', 'Mario.json', 'enemies.json', 'OverWorld.json']
        const jsonFile = (resources as any[]).filter(ci => ci?.name?.includes('json'))
        const loadAseprites = (resources as any[]).filter(ci => roles.includes(ci.name))
        const loadSprites = (resources as any[]).filter(ci => !roles.includes(ci.name))

        console.log(jsonFile, loadAseprites, loadSprites)

        loadRoot(baseURI)

        loadAseprites.forEach(ci => {
            if (!ci?.name?.includes('json')) {
                const name = ci?.name?.split('.')[0] as string
                const imgSrc = ci?.relativePath
                const jsonSrc = jsonFile?.find(vi => {
                    const str = vi?.name as string

                    if (str.includes(name)) return true
                })?.relativePath

                console.log(name, imgSrc, jsonSrc)

                loadAseprite(name?.toLowerCase(), imgSrc, jsonSrc)
            }
        })

        loadSprites?.forEach(ci => {
            const name = ci?.name?.split('.')[0]
            const src = ci?.relativePath

            loadSprite(name, src)
        })
    }

    useEffect(() => {
        queryList()
        init()
    }, [])
    return (
        <>
            <canvas width='640' height='640' ref={canvasRef}></canvas>
        </>
    )
}

export default MarioGame
