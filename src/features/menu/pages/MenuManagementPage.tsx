import { useState } from 'react'
import {
  Home,
  BarChart2,
  LayoutList,
  Bell,
  Clock,
  BookOpen,
  UserCircle,
  PlusCircle,
} from 'lucide-react'
import type { Category, DrawerState, MenuItem, ViewMode } from '../types'
import { mockCategories, mockMenuItems } from '../data/mockData'
import CategoryPanel from '../components/CategoryPanel'
import MenuGrid from '../components/MenuGrid'
import AddMenuDrawer from '../components/AddMenuDrawer'

const NAV_ICONS = [
  { icon: Home, label: 'หน้าหลัก' },
  { icon: BarChart2, label: 'รายงาน' },
  { icon: LayoutList, label: 'จัดการเมนู', active: true },
  { icon: Bell, label: 'แจ้งเตือน' },
  { icon: Clock, label: 'ประวัติ' },
  { icon: BookOpen, label: 'คู่มือ' },
]

let nextId = 1000

export default function MenuManagementPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(mockCategories[2].id)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [drawerState, setDrawerState] = useState<DrawerState>({
    isOpen: false,
    mode: 'add',
  })

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)
  const visibleItems = menuItems.filter((m) => m.categoryId === selectedCategoryId)

  const openAddDrawer = () =>
    setDrawerState({ isOpen: true, mode: 'add' })

  const openEditDrawer = (item: MenuItem) =>
    setDrawerState({ isOpen: true, mode: 'edit', item })

  const closeDrawer = () =>
    setDrawerState((prev) => ({ ...prev, isOpen: false }))

  const handleSave = (data: Omit<MenuItem, 'id'> & { id?: string }) => {
    if (data.id) {
      // Edit
      setMenuItems((prev) =>
        prev.map((m) =>
          m.id === data.id ? { ...(data as MenuItem) } : m
        )
      )
    } else {
      // Add
      const newItem: MenuItem = {
        ...data,
        id: `item_${++nextId}`,
      }
      setMenuItems((prev) => [...prev, newItem])
    }
    closeDrawer()
  }

  const handleDeleteMenu = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id))
  }

  const handleAddCategory = () => {
    const name = window.prompt('ชื่อหมวดหมู่ใหม่:')
    if (!name?.trim()) return
    const newCat: Category = {
      id: `cat_${++nextId}`,
      name: name.trim(),
      order: categories.length + 1,
    }
    setCategories((prev) => [...prev, newCat])
  }

  const handleEditCategory = (category: Category) => {
    const name = window.prompt('แก้ไขชื่อหมวดหมู่:', category.name)
    if (!name?.trim()) return
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, name: name.trim() } : c))
    )
  }

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    if (selectedCategoryId === id) {
      const remaining = categories.filter((c) => c.id !== id)
      if (remaining.length > 0) setSelectedCategoryId(remaining[0].id)
    }
  }

  return (
    <div className="app-shell">
      {/* Icon Bar */}
      <aside className="icon-bar">
        <div className="icon-bar__logo">
          <div className="logo-circle">
            <span>R</span>
          </div>
        </div>
        <nav className="icon-bar__nav">
          {NAV_ICONS.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`icon-bar__btn${active ? ' icon-bar__btn--active' : ''}`}
              title={label}
            >
              <Icon size={20} />
            </button>
          ))}
        </nav>
        <div className="icon-bar__bottom">
          <button className="icon-bar__btn" title="โปรไฟล์">
            <UserCircle size={20} />
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="main-area">
        {/* Header */}
        <header className="app-header">
          <div className="app-header__brand">
            <div className="brand-avatar">
              <span>R</span>
            </div>
            <div className="brand-text">
              <h1 className="brand-title">จัดการเมนู</h1>
              <p className="brand-subtitle">
                สร้าง แก้ไข และจัดการรายการอาหารและเครื่องดื่ม ราคา และโปรโมชั่น
              </p>
            </div>
          </div>
          <button className="btn-add-food" onClick={openAddDrawer}>
            <PlusCircle size={16} />
            <span>เพิ่มเมนูอาหาร</span>
          </button>
        </header>

        {/* Content row */}
        <div className="content-row">
          {/* Category Panel */}
          <CategoryPanel
            categories={categories}
            menuItems={menuItems}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />

          {/* Menu Grid */}
          <main className="menu-main">
            <MenuGrid
              items={visibleItems}
              categories={categories}
              selectedCategoryName={selectedCategory?.name ?? ''}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onAddMenu={openAddDrawer}
              onEditMenu={openEditDrawer}
              onDeleteMenu={handleDeleteMenu}
            />
          </main>
        </div>
      </div>

      {/* Drawer */}
      <AddMenuDrawer
        drawerState={drawerState}
        categories={categories}
        onClose={closeDrawer}
        onSave={handleSave}
      />
    </div>
  )
}
