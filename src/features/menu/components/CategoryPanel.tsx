import { useState } from 'react'
import { GripVertical, Plus, Search, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import type { Category, MenuItem } from '../types'

interface CategoryPanelProps {
  categories: Category[]
  menuItems: MenuItem[]
  selectedCategoryId: string
  onSelectCategory: (id: string) => void
  onAddCategory: () => void
  onEditCategory: (category: Category) => void
  onDeleteCategory: (id: string) => void
}

export default function CategoryPanel({
  categories,
  menuItems,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoryPanelProps) {
  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const getCount = (categoryId: string) =>
    menuItems.filter((m) => m.categoryId === categoryId).length

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`ลบหมวดหมู่ "${name}" ออก?`)) {
      onDeleteCategory(id)
    }
  }

  const handleEdit = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation()
    onEditCategory(category)
  }

  return (
    <div className="category-panel">
      <div className="category-panel__header">
        <span className="category-panel__title">จัดการหมวดหมู่</span>
        <button className="btn-add-category" onClick={onAddCategory}>
          <Plus size={14} />
          <span>เพิ่ม</span>
        </button>
      </div>

      <div className="category-panel__search">
        <Search size={14} className="category-search-icon" />
        <input
          type="text"
          placeholder="ค้นหา..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="category-search-input"
        />
      </div>

      <ul className="category-list">
        {filtered.map((cat) => {
          const isActive = selectedCategoryId === cat.id
          const isCollapsed = collapsed.has(cat.id)
          const count = getCount(cat.id)

          return (
            <li
              key={cat.id}
              className={`category-item${isActive ? ' category-item--active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span className="category-item__drag">
                <GripVertical size={14} />
              </span>

              <button
                className="category-item__collapse"
                onClick={(e) => toggleCollapse(cat.id, e)}
                title={isCollapsed ? 'ขยาย' : 'ยุบ'}
              >
                {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </button>

              <span className="category-item__name">{cat.name}</span>

              {count > 0 && (
                <span className="category-item__badge">{count}</span>
              )}

              <span className="category-item__actions">
                <button
                  className="category-action-btn"
                  onClick={(e) => handleEdit(cat, e)}
                  title="แก้ไข"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  className="category-action-btn category-action-btn--delete"
                  onClick={(e) => handleDelete(cat.id, cat.name, e)}
                  title="ลบ"
                >
                  <Trash2 size={13} />
                </button>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
