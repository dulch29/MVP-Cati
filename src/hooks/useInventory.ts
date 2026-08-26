import { useCallback, useEffect, useState } from 'react'
import type { Inventory, Reward, RewardKind } from '../types'

const STORAGE_KEY = 'cati.inventory.v1'

const EMPTY: Inventory = { food: 0, toy: 0, coin: 0 }

function load(): Inventory {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<Inventory>
    return {
      food: Number(parsed.food) || 0,
      toy: Number(parsed.toy) || 0,
      coin: Number(parsed.coin) || 0,
    }
  } catch {
    return EMPTY
  }
}

/** Flat little pouch of treats. Deliberately not an economy. */
export function useInventory() {
  const [items, setItems] = useState<Inventory>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Private mode or blocked storage: rewards just stay in-memory.
    }
  }, [items])

  const earn = useCallback((reward: Reward) => {
    setItems((prev) => ({
      ...prev,
      [reward.kind]: prev[reward.kind] + reward.amount,
    }))
  }, [])

  const spend = useCallback((kind: RewardKind, amount = 1) => {
    let ok = false
    setItems((prev) => {
      if (prev[kind] < amount) return prev
      ok = true
      return { ...prev, [kind]: prev[kind] - amount }
    })
    return ok
  }, [])

  return { items, earn, spend }
}

export const REWARD_META: Record<RewardKind, { icon: string; label: string }> = {
  food: { icon: '🐟', label: 'Treats' },
  toy: { icon: '🧶', label: 'Toys' },
  coin: { icon: '⭐', label: 'Stars' },
}
