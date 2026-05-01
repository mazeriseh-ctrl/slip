import { useState } from 'react'
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { MenuItem, FoodType, ViewMode, Category } from '../types'

const FOOD_TYPES: FoodType[] = ['ทั้งหมด', 'ต้ม', 'ผัด', 'แกง', 'ยำ', 'ย่าง/ปิ้ง', 'ทอด']
const GRID_PER_PAGE = 8
const LIST_PER_PAGE = 12

interface MenuGridProps {
  items: MenuItem[]
  categories: Category[]
  selectedCategoryName: string
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onAddMenu: () => void
  onEditMenu: (item: MenuItem) => void
  onDeleteMenu: (id: string) => void
}

export default function MenuGrid({
  items,
  categories,
  selectedCategoryName,
  viewMode,
  onViewModeChange,
  onAddMenu,
  onEditMenu,
  onDeleteMenu,
}: MenuGridProps) {
  const [filterType, setFilterType] = useState<FoodType>('ทั้งหมด')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = items.filter((item) => {
    const matchType =
      filterType === 'ทั้งหมด' || item.types.includes(filterType as Exclude<FoodType, 'ทั้งหมด'>)
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const perPage = viewMode === 'grid' ? GRID_PER_PAGE : LIST_PER_PAGE
  const totalPages = Math.ceil(filtered.length / perPage)
  const safePageMax = Math.max(1, totalPages)
  const currentPage = Math.min(page, safePageMax)
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const handleFilterChange = (type: FoodType) => {
    setFilterType(type)
    setPage(1)
  }

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`ลบเมนู "${name}" ออก?`)) {
      onDeleteMenu(id)
    }
  }

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name ?? categoryId

  const pageNumbers: number[] = []
  const startPage = Math.max(1, currentPage - 2)
  const endPage = Math.min(totalPages, startPage + 4)
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i)

  return (
    <div className="menu-grid-container">
      {/* Toolbar */}
      <div className="menu-toolbar">
        <div className="menu-toolbar__left">
          <div className="menu-section-title">
            <span className="menu-section-caret">▼</span>
            <span>{selectedCategoryName}</span>
          </div>
        </div>
        <div className="menu-toolbar__right">
          <div className="menu-search-wrap">
            <Search size={14} className="menu-search-icon" />
            <input
              type="text"
              placeholder="ค้นหา..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="menu-search-input"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs + View Toggle */}
      <div className="menu-filter-row">
        <div className="menu-filter-tabs">
          {FOOD_TYPES.map((type) => (
            <button
              key={type}
              className={`menu-filter-tab${filterType === type ? ' menu-filter-tab--active' : ''}`}
              onClick={() => handleFilterChange(type)}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="menu-view-toggle">
          <button
            className={`view-toggle-btn${viewMode === 'grid' ? ' view-toggle-btn--active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Grid"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            className={`view-toggle-btn${viewMode === 'list' ? ' view-toggle-btn--active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="List"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Count */}
      <div className="menu-count-row">
        <span className="menu-count-text">
          แสดง {filtered.length > 0 ? (currentPage - 1) * perPage + 1 : 0}–
          {Math.min(currentPage * perPage, filtered.length)} จาก {filtered.length} รายการ
        </span>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="menu-grid">
          {/* Add card */}
          <div className="menu-card menu-card--add" onClick={onAddMenu}>
            <Plus size={24} className="menu-card-add-icon" />
            <span>เพิ่มเมนู</span>
          </div>

          {paginated.map((item) => (
            <div key={item.id} className="menu-card">
              <button
                className="menu-card__delete-btn"
                onClick={() => handleDelete(item.id, item.name)}
                title="ลบ"
              >
                <Trash2 size={13} />
              </button>
              <div className="menu-card__image" style={{ backgroundColor: item.bgColor }}>
                <span className="menu-card__emoji">{item.emoji}</span>
              </div>
              <div className="menu-card__body">
                <p className="menu-card__name">{item.name}</p>
                <p className="menu-card__price">
                  {item.discount
                    ? `${Math.round(item.price * (1 - item.discount / 100))} บาท`
                    : `${item.price} บาท`}
                </p>
                <button
                  className="menu-card__edit-btn"
                  onClick={() => onEditMenu(item)}
                >
                  <Edit2 size={13} />
                  <span>แก้ไขเมนู</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="menu-list">
          <button className="menu-list__add-btn" onClick={onAddMenu}>
            <Plus size={15} />
            <span>เพิ่มเมนู</span>
          </button>

          {paginated.map((item) => (
            <div key={item.id} className="menu-list-row">
              <div
                className="menu-list-row__image"
                style={{ backgroundColor: item.bgColor }}
              >
                <span>{item.emoji}</span>
              </div>
              <div className="menu-list-row__info">
                <span className="menu-list-row__name">{item.name}</span>
                <span className="menu-list-row__category">
                  {getCategoryName(item.categoryId)}
                </span>
              </div>
              <div className="menu-list-row__types">
                {item.types.map((t) => (
                  <span key={t} className="menu-type-badge">
                    {t}
                  </span>
                ))}
              </div>
              <div className="menu-list-row__price">
                {item.discount
                  ? `${Math.round(item.price * (1 - item.discount / 100))} บาท`
                  : `${item.price} บาท`}
              </div>
              <div className="menu-list-row__actions">
                <button
                  className="menu-action-btn"
                  onClick={() => onEditMenu(item)}
                  title="แก้ไข"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  className="menu-action-btn menu-action-btn--delete"
                  onClick={() => handleDelete(item.id, item.name)}
                  title="ลบ"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="menu-pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={15} />
          </button>
          {pageNumbers.map((n) => (
            <button
              key={n}
              className={`pagination-btn${currentPage === n ? ' pagination-btn--active' : ''}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  )
}
