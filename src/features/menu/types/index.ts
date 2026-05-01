export type FoodType = 'ทั้งหมด' | 'ต้ม' | 'ผัด' | 'แกง' | 'ยำ' | 'ย่าง/ปิ้ง' | 'ทอด'
export type ViewMode = 'grid' | 'list'

export interface Category {
  id: string
  name: string
  order: number
}

export interface MenuItem {
  id: string
  name: string
  price: number
  discount?: number
  categoryId: string
  types: FoodType[]
  emoji: string
  bgColor: string
  description?: string
  isAvailable: boolean
}

export interface DrawerState {
  isOpen: boolean
  mode: 'add' | 'edit'
  item?: MenuItem
}
