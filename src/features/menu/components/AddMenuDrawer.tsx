import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { DrawerState, FoodType, MenuItem, Category } from '../types'

const FOOD_TYPES: Exclude<FoodType, 'ทั้งหมด'>[] = ['ต้ม', 'ผัด', 'แกง', 'ยำ', 'ย่าง/ปิ้ง', 'ทอด']

const EMOJI_OPTIONS = [
  '🍜','🍲','🍛','🍝','🍳','🥗','🥩','🍗','🐟','🦐','🥦','🍚','🧋','☕','🍋','💧','🌿','🥣','🍢','🍖','🐷','🐠','🫧','🍵','🥙',
]

interface AddMenuDrawerProps {
  drawerState: DrawerState
  categories: Category[]
  onClose: () => void
  onSave: (item: Omit<MenuItem, 'id'> & { id?: string }) => void
}

interface FormData {
  name: string
  price: string
  discount: string
  categoryId: string
  types: Exclude<FoodType, 'ทั้งหมด'>[]
  emoji: string
  bgColor: string
  description: string
  isAvailable: boolean
}

const BG_COLORS = [
  '#FFF0F0','#FFF8E7','#F0FFF0','#FFF5F0','#F0F8FF','#FFF0F5','#F5FFF5','#FFFFF0','#F5F0FF','#F0FAFF',
]

const defaultForm: FormData = {
  name: '',
  price: '',
  discount: '',
  categoryId: '',
  types: [],
  emoji: '🍜',
  bgColor: '#FFF8E7',
  description: '',
  isAvailable: true,
}

function itemToForm(item: MenuItem): FormData {
  return {
    name: item.name,
    price: String(item.price),
    discount: item.discount ? String(item.discount) : '',
    categoryId: item.categoryId,
    types: item.types.filter((t): t is Exclude<FoodType, 'ทั้งหมด'> => t !== 'ทั้งหมด'),
    emoji: item.emoji,
    bgColor: item.bgColor,
    description: item.description ?? '',
    isAvailable: item.isAvailable,
  }
}

export default function AddMenuDrawer({
  drawerState,
  categories,
  onClose,
  onSave,
}: AddMenuDrawerProps) {
  const [form, setForm] = useState<FormData>(defaultForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  useEffect(() => {
    if (drawerState.isOpen) {
      if (drawerState.mode === 'edit' && drawerState.item) {
        setForm(itemToForm(drawerState.item))
      } else {
        setForm({
          ...defaultForm,
          categoryId: categories[0]?.id ?? '',
        })
      }
      setErrors({})
      setShowEmojiPicker(false)
    }
  }, [drawerState.isOpen, drawerState.mode, drawerState.item, categories])

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const toggleType = (type: Exclude<FoodType, 'ทั้งหมด'>) => {
    setForm((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }))
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!form.name.trim()) newErrors.name = 'กรุณากรอกชื่อเมนู'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      newErrors.price = 'กรุณากรอกราคาที่ถูกต้อง'
    if (!form.categoryId) newErrors.categoryId = 'กรุณาเลือกหมวดหมู่'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave({
      id: drawerState.item?.id,
      name: form.name.trim(),
      price: Number(form.price),
      discount: form.discount ? Number(form.discount) : undefined,
      categoryId: form.categoryId,
      types: form.types,
      emoji: form.emoji,
      bgColor: form.bgColor,
      description: form.description.trim() || undefined,
      isAvailable: form.isAvailable,
    })
  }

  const isEdit = drawerState.mode === 'edit'

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop${drawerState.isOpen ? ' drawer-backdrop--open' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`add-menu-drawer${drawerState.isOpen ? ' open' : ''}`}>
        {/* Header */}
        <div className="drawer__header">
          <h5 className="drawer__title">{isEdit ? 'แก้ไขเมนู' : 'เพิ่มเมนู'}</h5>
          <button className="drawer__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer__body">
          {/* ชื่อเมนู */}
          <div className="form-field">
            <label className="form-label">ชื่อเมนู</label>
            <input
              type="text"
              className={`form-control${errors.name ? ' is-invalid' : ''}`}
              placeholder="กรุณากรอกชื่ออาหาร"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          {/* ราคา + ส่วนลด */}
          <div className="row g-2">
            <div className="col-6">
              <div className="form-field">
                <label className="form-label">ราคา</label>
                <input
                  type="number"
                  className={`form-control${errors.price ? ' is-invalid' : ''}`}
                  placeholder="กรุณากรอกราคาอาหาร"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  min={0}
                />
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
              </div>
            </div>
            <div className="col-6">
              <div className="form-field">
                <label className="form-label">ส่วนลด % (ถ้ามี)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="กรุณากรอกส่วนลดในอัตราอาหาร"
                  value={form.discount}
                  onChange={(e) => set('discount', e.target.value)}
                  min={0}
                  max={100}
                />
              </div>
            </div>
          </div>

          {/* ประเภทหมวดหมู่ */}
          <div className="form-field">
            <label className="form-label">ประเภทหมวดหมู่</label>
            <select
              className={`form-select${errors.categoryId ? ' is-invalid' : ''}`}
              value={form.categoryId}
              onChange={(e) => set('categoryId', e.target.value)}
            >
              <option value="">กรุณาเลือกประเภทหมวดหมู่</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <div className="invalid-feedback">{errors.categoryId}</div>
            )}
          </div>

          {/* ประเภทอาหาร */}
          <div className="form-field">
            <label className="form-label">ประเภทอาหาร</label>
            <div className="food-type-tags">
              {FOOD_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`food-type-tag${form.types.includes(type) ? ' food-type-tag--active' : ''}`}
                  onClick={() => toggleType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* อัพโหลดรูป / Emoji */}
          <div className="form-field">
            <label className="form-label">รูปอาหาร (Emoji)</label>
            <div className="emoji-upload-area">
              <div className="emoji-preview" style={{ backgroundColor: form.bgColor }}>
                <span className="emoji-preview__icon">{form.emoji}</span>
              </div>
              <div className="emoji-upload-info">
                <p className="emoji-upload-hint">เลือก Emoji สำหรับแสดงแทนรูปอาหาร</p>
                <button
                  type="button"
                  className="btn-select-emoji"
                  onClick={() => setShowEmojiPicker((p) => !p)}
                >
                  เลือก Emoji
                </button>
              </div>
            </div>
            {showEmojiPicker && (
              <div className="emoji-picker">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`emoji-option${form.emoji === emoji ? ' emoji-option--active' : ''}`}
                    onClick={() => {
                      set('emoji', emoji)
                      setShowEmojiPicker(false)
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
            {/* สีพื้นหลัง */}
            <div className="bg-color-row">
              <label className="form-label-sm">สีพื้นหลังการ์ด</label>
              <div className="bg-color-swatches">
                {BG_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`bg-swatch${form.bgColor === color ? ' bg-swatch--active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => set('bgColor', color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* คำอธิบาย */}
          <div className="form-field">
            <label className="form-label">คำอธิบายเพิ่มเติม</label>
            <textarea
              className="form-control"
              placeholder="กรุณาระบุคำอธิบายเพิ่มเติม"
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="drawer__footer">
          <button className="btn-drawer-cancel" onClick={onClose}>
            ยกเลิก
          </button>
          <button className="btn-drawer-save" onClick={handleSave}>
            บันทึก
          </button>
        </div>
      </div>
    </>
  )
}
