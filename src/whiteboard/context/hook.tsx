import { DependencyList, useContext, useEffect, useMemo, useRef } from 'react'
import { Component } from '../Component'

import { context } from './context'

export function useWhiteboard(component: Component, deps: DependencyList) {
  const { registerComponent, ...rest } = useContext(context)
  const componentId = useMemo(() => `${component.name}-${Math.random().toString(16).substring(2)}`, [])

  useEffect(() => {
    registerComponent(componentId, component)
  }, deps)

  return rest
}
