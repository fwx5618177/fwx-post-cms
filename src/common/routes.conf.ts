import { RoutesI } from '@common/interface'
import { lazy } from 'react'

/**
 * 路由配置表
 */
export const routesConfiguration = (prefix: string): RoutesI[] => {
    const conf: RoutesI[] = [
        {
            label: '',
            icon: '',
            key: '',
            components: lazy(() => import('../App')),
        },
    ]

    return conf
}
