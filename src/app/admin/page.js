'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Package, FolderOpen, Tag, ShoppingBag, FileArchive, Link2, Copy,
  Layers, Home, Zap, Globe, Plus, Edit, Trash2, Eye, RefreshCw,
  CheckCircle, XCircle, AlertCircle, Search, Upload, X, ChevronLeft,
  File
} from 'lucide-react'

async function sanityRead(query, params = {}) {
  const res = await fetch('/api/admin/sanity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, params }) })
  if (!res.ok) throw new Error(`Sanity read error: ${res.status}`)
  return (await res.json()).result
}

async function sanityWrite(mutations) {
  const res = await fetch('/api/admin/sanity', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mutations }) })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Write failed')
  return data.result
}

function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
function uid() { return Math.random().toString(36).slice(2, 10) }

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  const s = { success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300', error: 'border-red-500/40 bg-red-500/10 text-red-300', info: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' }
  const icons = { success: CheckCircle, error: XCircle, info: AlertCircle }
  const Icon = icons[type]
  return <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm font-mono text-sm max-w-sm ${s[type]}`}><Icon size={15} className="shrink-0" />{message}</div>
}

function Spinner({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin text-cyan-400"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.4" strokeDashoffset="10" /></svg>
}

function Card({ children, className = '' }) { return <div className={`rounded-xl border border-white/5 bg-white/[0.02] ${className}`}>{children}</div> }

function Field({ label, children, hint }) {
  return <div><label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>{children}{hint && <p className="text-slate-600 text-xs mt-1 font-mono">{hint}</p>}</div>
}

function Input({ className = '', ...p }) { return <input className={`w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors ${className}`} {...p} /> }
function Textarea({ className = '', ...p }) { return <textarea className={`w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none ${className}`} {...p} /> }
function Select({ className = '', children, ...p }) { return <select className={`w-full bg-[#0f0f1a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-cyan-500/50 transition-colors ${className}`} {...p}>{children}</select> }

function Btn({ children, variant = 'default', size = 'md', loading, className = '', ...p }) {
  const sz = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' }
  const v = { default: 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white', primary: 'bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/20', danger: 'bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20', ghost: 'text-slate-400 hover:text-white hover:bg-white/5' }
  return <button className={`inline-flex items-center gap-2 font-mono font-bold rounded-lg transition-all disabled:opacity-50 ${sz[size]} ${v[variant]} ${className}`} disabled={loading} {...p}>{loading ? <Spinner size={13} /> : null}{children}</button>
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"><Card className="p-6 w-80"><div className="flex items-center gap-3 mb-4"><AlertCircle size={18} className="text-red-400 shrink-0" /><p className="text-white text-sm">{message}</p></div><div className="flex gap-2 justify-end"><Btn onClick={onCancel}>Cancel</Btn><Btn variant="danger" onClick={onConfirm}>Delete</Btn></div></Card></div>
}

function ImageUploader({ value, onChange, label = 'Image' }) {
  const [uploading, setUploading] = useState(false)
  const ref = useRef()
  async function handleFile(file) {
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/admin/sanity-asset', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onChange(data.ref)
    } catch (e) { alert('Image upload failed: ' + e.message) }
    finally { setUploading(false) }
  }
  const PROJECT_ID = 'ji82q30h'
  const previewUrl = value?.asset?._ref
    ? `https://cdn.sanity.io/images/${PROJECT_ID}/production/${value.asset._ref.replace('image-', '').replace(/-([a-z]+)$/, '.$1')}`
    : null
  return (
    <Field label={label}>
      <div onClick={() => ref.current?.click()} className="relative border border-dashed border-white/15 rounded-lg overflow-hidden cursor-pointer hover:border-cyan-500/40 transition-colors group" style={{ minHeight: 100 }}>
        {previewUrl ? <div className="relative"><img src={previewUrl} alt="" className="w-full h-32 object-cover" /><div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-xs font-mono">Click to replace</span></div></div>
          : <div className="flex flex-col items-center justify-center py-8 text-slate-600">{uploading ? <Spinner /> : <><div className="mb-2 text-2xl">🖼</div><span className="text-xs font-mono">Click to upload image</span></>}</div>}
        {uploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Spinner size={20} /></div>}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
      {value && <button onClick={() => onChange(null)} className="text-xs text-red-400 hover:text-red-300 font-mono mt-1">Remove image</button>}
    </Field>
  )
}

function S3Uploader({ value, onChange, productSlug }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const ref = useRef()
  async function handleFile(file) {
    if (!file) return
    setUploading(true); setProgress(0)
    try {
      const slug = productSlug || uid()
      const key = `products/${slug}/${file.name}`
      // Upload through server to avoid S3 CORS issues
      const fd = new FormData()
      fd.append('file', file)
      fd.append('key', key)
      // Simulate progress since we can't track server-side upload
      const progressInterval = setInterval(() => setProgress(p => Math.min(p + 10, 85)), 300)
      const res = await fetch('/api/admin/s3-upload', { method: 'POST', body: fd })
      clearInterval(progressInterval)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onChange(key); setProgress(100)
    } catch (e) { alert('S3 upload failed: ' + e.message) }
    finally { setUploading(false) }
  }
  return (
    <Field label="Product File (S3)" hint="ZIP file uploaded directly to S3">
      <div onClick={() => !uploading && ref.current?.click()} className="border border-dashed border-white/15 rounded-lg p-4 cursor-pointer hover:border-cyan-500/40 transition-colors">
        {uploading
          ? <div><div className="flex items-center gap-2 text-cyan-400 text-sm font-mono mb-2"><Spinner size={13} />Uploading… {progress}%</div><div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${progress}%` }} /></div></div>
          : value
            ? <div className="flex items-center gap-2"><File size={14} className="text-emerald-400" /><span className="text-emerald-400 text-xs font-mono truncate flex-1">{value}</span><button onClick={e => { e.stopPropagation(); onChange('') }} className="text-slate-500 hover:text-red-400"><X size={12} /></button></div>
            : <div className="flex items-center gap-2 text-slate-600 text-sm font-mono"><Upload size={14} />Click to upload ZIP file</div>}
      </div>
      <input ref={ref} type="file" accept=".zip,.rar,.7z" className="hidden" onChange={e => handleFile(e.target.files[0])} />
    </Field>
  )
}


// ─── Rich Text Editor ─────────────────────────────────────────────────────

function RichTextEditor({ value = [], onChange }) {
  const ref = useRef()
  const initialised = useRef(false)

  function blocksToHtml(blocks) {
    if (!blocks?.length) return ''
    return blocks.map(block => {
      if (block._type !== 'block') return ''
      const inline = (block.children || []).map(span => {
        let t = (span.text || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        if (span.marks?.includes('strong')) t = `<strong>${t}</strong>`
        if (span.marks?.includes('em')) t = `<em>${t}</em>`
        if (span.marks?.includes('code')) t = `<code>${t}</code>`
        return t
      }).join('')
      const style = block.style || 'normal'
      if (style === 'h2') return `<h2>${inline}</h2>`
      if (style === 'h3') return `<h3>${inline}</h3>`
      if (style === 'blockquote') return `<blockquote>${inline}</blockquote>`
      if (block.listItem === 'bullet') return `<li data-list="bullet">${inline}</li>`
      if (block.listItem === 'number') return `<li data-list="number">${inline}</li>`
      return `<p>${inline || '<br>'}</p>`
    }).reduce((acc, item) => {
      // Wrap consecutive list items in ul/ol
      if (item.startsWith('<li data-list="bullet">')) {
        const li = item.replace('<li data-list="bullet">', '<li>')
        const last = acc[acc.length - 1]
        if (last?.startsWith('<ul>') && !last.endsWith('</ul>')) return [...acc.slice(0,-1), last + li]
        if (last?.endsWith('</ul>') === false && last?.includes('<ul>')) return [...acc.slice(0,-1), last + li]
        // check if last is an open ul
        if (typeof last === 'string' && last.startsWith('<ul>') && !last.endsWith('</ul>')) return [...acc.slice(0,-1), last + li]
        return [...acc, `<ul>${li}`]
      }
      if (item.startsWith('<li data-list="number">')) {
        const li = item.replace('<li data-list="number">', '<li>')
        const last = acc[acc.length - 1]
        if (typeof last === 'string' && last.startsWith('<ol>') && !last.endsWith('</ol>')) return [...acc.slice(0,-1), last + li]
        return [...acc, `<ol>${li}`]
      }
      // Close any open list
      const last = acc[acc.length - 1]
      if (typeof last === 'string' && last.startsWith('<ul>') && !last.endsWith('</ul>')) return [...acc.slice(0,-1), last + '</ul>', item]
      if (typeof last === 'string' && last.startsWith('<ol>') && !last.endsWith('</ol>')) return [...acc.slice(0,-1), last + '</ol>', item]
      return [...acc, item]
    }, []).map(item => {
      if (item.startsWith('<ul>') && !item.endsWith('</ul>')) return item + '</ul>'
      if (item.startsWith('<ol>') && !item.endsWith('</ol>')) return item + '</ol>'
      return item
    }).join('')
  }

  function htmlToBlocks(html) {
    const div = document.createElement('div')
    div.innerHTML = html
    const blocks = []

    function parseInline(node) {
      const children = []
      node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          if (child.textContent) children.push({ _type: 'span', _key: uid(), text: child.textContent, marks: [] })
          return
        }
        const tag = child.tagName?.toLowerCase()
        const marks = []
        if (tag === 'strong' || tag === 'b') marks.push('strong')
        if (tag === 'em' || tag === 'i') marks.push('em')
        if (tag === 'code') marks.push('code')
        const text = child.textContent
        if (text) children.push({ _type: 'span', _key: uid(), text, marks })
      })
      if (!children.length && node.textContent) children.push({ _type: 'span', _key: uid(), text: node.textContent, marks: [] })
      return children
    }

    function pushBlock(node, style, listItem, level) {
      const children = parseInline(node)
      if (!children.length) return
      const block = { _type: 'block', _key: uid(), style: style || 'normal', markDefs: [], children }
      if (listItem) { block.listItem = listItem; block.level = level || 1 }
      blocks.push(block)
    }

    function walk(node) {
      const tag = node.tagName?.toLowerCase()
      if (!tag) return
      if (tag === 'p' || tag === 'div') { pushBlock(node, 'normal'); return }
      if (tag === 'h2') { pushBlock(node, 'h2'); return }
      if (tag === 'h3') { pushBlock(node, 'h3'); return }
      if (tag === 'blockquote') { pushBlock(node, 'blockquote'); return }
      if (tag === 'ul') { node.querySelectorAll('li').forEach(li => pushBlock(li, 'normal', 'bullet', 1)); return }
      if (tag === 'ol') { node.querySelectorAll('li').forEach(li => pushBlock(li, 'normal', 'number', 1)); return }
      if (tag === 'br') return
      // fallback
      if (node.textContent?.trim()) pushBlock(node, 'normal')
    }

    div.childNodes.forEach(walk)
    return blocks
  }

  // Load content when value arrives (async on edit)
  useEffect(() => {
    if (ref.current && value?.length && !initialised.current) {
      ref.current.innerHTML = blocksToHtml(value)
      initialised.current = true
    }
  }, [value])

  // Reset initialised when switching between products
  useEffect(() => {
    if (!value?.length) {
      initialised.current = false
      if (ref.current) ref.current.innerHTML = ''
    }
  }, [value?.length === 0])

  function exec(cmd, val) {
    ref.current?.focus()
    document.execCommand(cmd, false, val || null)
    setTimeout(() => { if (ref.current) onChange(htmlToBlocks(ref.current.innerHTML)) }, 0)
  }

  function sync() {
    if (ref.current) onChange(htmlToBlocks(ref.current.innerHTML))
  }

  const btnClass = "px-2 py-1 rounded text-slate-400 hover:bg-white/10 hover:text-white transition-colors font-mono text-xs"

  return (
    <Field label="Description">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border border-white/[0.08] border-b-0 rounded-t-lg bg-white/[0.03]">
        <button type="button" className={btnClass} onMouseDown={e => { e.preventDefault(); exec('bold') }}><strong>B</strong></button>
        <button type="button" className={btnClass} onMouseDown={e => { e.preventDefault(); exec('italic') }}><em>I</em></button>
        <button type="button" className={btnClass} onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h2') }}>H2</button>
        <button type="button" className={btnClass} onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h3') }}>H3</button>
        <button type="button" className={btnClass} onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'p') }}>¶</button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button type="button" className={btnClass} onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList') }}>• list</button>
        <button type="button" className={btnClass} onMouseDown={e => { e.preventDefault(); exec('insertOrderedList') }}>1. list</button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button type="button" className={btnClass} onMouseDown={e => { e.preventDefault(); exec('removeFormat') }}>✕ fmt</button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onBlur={sync}
        className="min-h-40 w-full bg-white/[0.04] border border-white/[0.08] rounded-b-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
        style={{ lineHeight: '1.7', color: 'white' }}
      />
      <style>{`
        [contenteditable] { color: #fff !important; }
        [contenteditable] * { color: #fff !important; }
        [contenteditable] p, [contenteditable] div { margin: 0 0 0.4em; }
        [contenteditable] h2 { font-size: 1.2em; font-weight: 700; margin: 0.6em 0 0.2em; }
        [contenteditable] h3 { font-size: 1.05em; font-weight: 700; margin: 0.5em 0 0.2em; }
        [contenteditable] strong, [contenteditable] b { font-weight: 700; }
        [contenteditable] em, [contenteditable] i { font-style: italic; color: #67e8f9 !important; }
        [contenteditable] code { background: rgba(255,255,255,0.1); padding: 1px 4px; border-radius: 3px; font-family: monospace; }
        [contenteditable] ul { list-style: disc; padding-left: 1.5em; margin: 0.4em 0; }
        [contenteditable] ol { list-style: decimal; padding-left: 1.5em; margin: 0.4em 0; }
        [contenteditable] li { margin: 0.1em 0; }
        [contenteditable]:focus { outline: none; }
      `}</style>
    </Field>
  )
}

function PreviewImagesUploader({ value = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const ref = useRef()
  const PROJECT_ID = 'ji82q30h'

  async function handleFiles(files) {
    if (!files?.length) return
    setUploading(true)
    try {
      const uploaded = []
      for (const file of Array.from(files)) {
        const fd = new FormData(); fd.append('file', file)
        const res = await fetch('/api/admin/sanity-asset', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        uploaded.push({ ...data.ref, _key: uid() })
      }
      onChange([...(value || []), ...uploaded])
    } catch (e) { alert('Preview upload failed: ' + e.message) }
    finally { setUploading(false) }
  }

  function remove(idx) { onChange(value.filter((_, i) => i !== idx)) }

  function getUrl(img) {
    if (!img?.asset?._ref) return null
    return `https://cdn.sanity.io/images/${PROJECT_ID}/production/${img.asset._ref.replace('image-', '').replace(/-([a-z]+)$/, '.$1')}`
  }

  return (
    <Field label="Preview Images" hint="Multiple images shown in product gallery">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {(value || []).map((img, i) => {
          const url = getUrl(img)
          return url ? (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-white/10">
              <img src={url} alt="" className="w-full h-20 object-cover" />
              <button onClick={() => remove(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300">
                <X size={10} />
              </button>
            </div>
          ) : null
        })}
        <div
          onClick={() => ref.current?.click()}
          className="border border-dashed border-white/15 rounded-lg h-20 flex items-center justify-center cursor-pointer hover:border-cyan-500/40 transition-colors text-slate-600"
        >
          {uploading ? <Spinner size={14} /> : <Plus size={18} />}
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
    </Field>
  )
}

const EMPTY = { name: '', slug: '', productCode: '', price: '', description: [], percentage: '', fileUrl: '', lemonsqueezyVariantId: '', collectionId: '', categoryId: '', subpackId: '', image: null, previewImages: [], youtubeVideoId: '', fileSize: '', fileFormat: '', decayCurve: '', modes: '', algorithmicVariations: '', totalFiles: '' }

function ProductForm({ product, collections, categories, subpacks, onSave, onCancel, onToast }) {
  const isEdit = !!product?._id
  const [form, setForm] = useState(isEdit ? {
    name: product.name || '', slug: product.slug?.current || '', productCode: product.productCode || '',
    price: product.price || '', description: product.description || '', percentage: product.percentage || '',
    fileUrl: product.fileUrl || '', lemonsqueezyVariantId: product.lemonsqueezyVariantId || '',
    description: product.description || [],
    youtubeVideoId: product.youtubeVideoId || '',
    fileSize: product.fileSize || '',
    fileFormat: product.fileFormat || '',
    decayCurve: product.decayCurve || '',
    modes: product.modes || '',
    algorithmicVariations: product.algorithmicVariations || '',
    totalFiles: product.totalFiles || '',
    collectionId: product.collection?._id || '',
    categoryId: product.category?._id || '', subpackId: product.subpack?._id || '', image: product.image || null,
  } : { ...EMPTY })
  const [saving, setSaving] = useState(null) // null | 'draft' | 'publish'
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }
  function handleName(v) { set('name', v); if (!isEdit) set('slug', slugify(v)) }

  async function handleSave(publish = false) {
    if (!form.name || !form.slug) { onToast('Name and slug required', 'error'); return }
    if (publish && !form.lemonsqueezyVariantId) { onToast('Paste the LemonSqueezy Variant ID before publishing', 'error'); return }
    setSaving(publish ? 'publish' : 'draft')
    try {
      const doc = { _type: 'product', name: form.name, slug: { _type: 'slug', current: form.slug } }
      if (form.productCode) doc.productCode = form.productCode
      if (form.price) doc.price = parseFloat(form.price)
      if (form.description?.length) doc.description = form.description
      if (form.percentage) doc.percentage = String(form.percentage)
      if (form.fileUrl) doc.fileUrl = form.fileUrl
      if (form.youtubeVideoId) doc.youtubeVideoId = form.youtubeVideoId
      if (form.fileSize) doc.fileSize = form.fileSize
      if (form.fileFormat) doc.fileFormat = form.fileFormat
      if (form.decayCurve) doc.decayCurve = form.decayCurve
      if (form.modes) doc.modes = form.modes
      if (form.algorithmicVariations) doc.algorithmicVariations = form.algorithmicVariations
      if (form.totalFiles) doc.totalFiles = form.totalFiles
      if (form.image) doc.image = form.image
      if (form.previewImages?.length) doc.previewImages = form.previewImages.map(img => ({ ...img, _key: img._key || uid() }))
      if (form.lemonsqueezyVariantId) doc.lemonsqueezyVariantId = form.lemonsqueezyVariantId
      if (form.collectionId) doc.collection = { _type: 'reference', _ref: form.collectionId }
      if (form.categoryId) doc.category = { _type: 'reference', _ref: form.categoryId }
      if (form.subpackId) doc.subpack = { _type: 'reference', _ref: form.subpackId }

      if (isEdit) {
        await sanityWrite([{ patch: { id: product._id, set: doc } }])
        if (publish) {
          const publishedId = product._id.replace('drafts.', '')
          await sanityWrite([{ createOrReplace: { _id: publishedId, ...doc } }])
        }
        if (form.lemonsqueezyVariantId && String(form.price) !== String(product.price)) {
          await fetch('/api/admin/lemonsqueezy-variant', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ variantId: form.lemonsqueezyVariantId, price: form.price }) })
        }
      } else {
        const draftId = 'drafts.' + uid()
        await sanityWrite([{ create: { _id: draftId, ...doc } }])
        if (publish) {
          await sanityWrite([{ createOrReplace: { _id: uid(), ...doc } }])
        }
      }
      onToast(publish ? 'Product published!' : 'Draft saved!', 'success')
      onSave()
    } catch (e) { onToast('Save failed: ' + e.message, 'error') }
    finally { setSaving(null) }
  }

  const filteredCats = categories.filter(c => !form.collectionId || c.collection?._id === form.collectionId)
  const filteredSubs = subpacks.filter(s => !form.categoryId || s.category?._id === form.categoryId)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"><ChevronLeft size={18} /></button>
        <h1 className="font-mono text-xl font-bold text-white">{isEdit ? 'Edit Product' : 'New Product'}</h1>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <p className="font-mono text-xs text-slate-500 uppercase tracking-wider">Basic Info</p>
            <Field label="Name *"><Input value={form.name} onChange={e => handleName(e.target.value)} placeholder="29.16% HS IPI" /></Field>
            <Field label="Slug *" hint="Auto-generated from name"><Input value={form.slug} onChange={e => set('slug', e.target.value)} /></Field>
            <Field label="Product Code"><Input value={form.productCode} onChange={e => set('productCode', e.target.value)} placeholder="29-16-hs-ipiflattop" /></Field>
            <Field label="Percentage"><Input type="number" value={form.percentage} onChange={e => set('percentage', e.target.value)} placeholder="29.16" /></Field>
            <RichTextEditor value={form.description} onChange={v => set('description', v)} />
          </Card>
          <Card className="p-5 space-y-4">
            <p className="font-mono text-xs text-slate-500 uppercase tracking-wider">Media & Specs</p>
            <Field label="YouTube Video ID" hint='e.g. "dQw4w9WgXcQ" from youtube.com/watch?v=dQw4w9WgXcQ'>
              <Input value={form.youtubeVideoId} onChange={e => set('youtubeVideoId', e.target.value)} placeholder="dQw4w9WgXcQ" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="File Size"><Input value={form.fileSize} onChange={e => set('fileSize', e.target.value)} placeholder="2.5 GB" /></Field>
              <Field label="File Format"><Input value={form.fileFormat} onChange={e => set('fileFormat', e.target.value)} placeholder="ZIP, WAV" /></Field>
            </div>
            <Field label="Decay Curve"><Input value={form.decayCurve} onChange={e => set('decayCurve', e.target.value)} placeholder="Linear, Exponential, Logarithmic" /></Field>
            <Field label="Modes"><Input value={form.modes} onChange={e => set('modes', e.target.value)} placeholder="Major and Minor, All 12 semitones" /></Field>
            <Field label="Algorithmic Variations (per tone)"><Input value={form.algorithmicVariations} onChange={e => set('algorithmicVariations', e.target.value)} placeholder="Wide, Reverse, MS, Oct" /></Field>
            <Field label="Total Files"><Input value={form.totalFiles} onChange={e => set('totalFiles', e.target.value)} placeholder="3,456 Impulse Response files" /></Field>
          </Card>
          <Card className="p-5 space-y-4">
            <p className="font-mono text-xs text-slate-500 uppercase tracking-wider">Hierarchy</p>
            <Field label="Collection">
              <Select value={form.collectionId} onChange={e => { set('collectionId', e.target.value); set('categoryId', ''); set('subpackId', '') }}>
                <option value="">— None —</option>
                {collections.map(c => <option key={c._id} value={c._id}>{c.emoji} {c.name}</option>)}
              </Select>
            </Field>
            <Field label="Category">
              <Select value={form.categoryId} onChange={e => { set('categoryId', e.target.value); set('subpackId', '') }}>
                <option value="">— None —</option>
                {filteredCats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </Select>
            </Field>
            <Field label="Subpack">
              <Select value={form.subpackId} onChange={e => set('subpackId', e.target.value)}>
                <option value="">— None —</option>
                {filteredSubs.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </Select>
            </Field>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <p className="font-mono text-xs text-slate-500 uppercase tracking-wider">Pricing & LemonSqueezy</p>
            <Field label="Price (€) *"><Input type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} placeholder="10.00" /></Field>
            <Field label="LemonSqueezy Variant ID" hint="Create the product in LemonSqueezy first, then paste the Variant ID here">
              <Input value={form.lemonsqueezyVariantId} onChange={e => set('lemonsqueezyVariantId', e.target.value)} placeholder="e.g. 123456" />
            </Field>
            {form.lemonsqueezyVariantId
              ? <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono"><CheckCircle size={13} />Variant {form.lemonsqueezyVariantId} linked — ready to publish</div>
              : <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-3 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold"><AlertCircle size={13} />Required to publish</div>
                  <p className="text-slate-400 text-xs">Create this product in LemonSqueezy first, then paste the Variant ID above.</p>
                  <a href="https://app.lemonsqueezy.com/products/new" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors border border-cyan-500/25 rounded px-2 py-1 bg-cyan-500/5 hover:bg-cyan-500/10">
                    <Link2 size={11} />Create product in LemonSqueezy →
                  </a>
                </div>
            }
          </Card>
          <Card className="p-5 space-y-4">
            <p className="font-mono text-xs text-slate-500 uppercase tracking-wider">Product File</p>
            <S3Uploader value={form.fileUrl} onChange={v => set('fileUrl', v)} productSlug={form.slug} />
            {form.fileUrl && <Field label="S3 Path"><Input value={form.fileUrl} onChange={e => set('fileUrl', e.target.value)} /></Field>}
          </Card>
          <Card className="p-5 space-y-4">
            <ImageUploader value={form.image} onChange={v => set('image', v)} />
            <PreviewImagesUploader value={form.previewImages} onChange={v => set('previewImages', v)} />
          </Card>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Btn onClick={onCancel}>Cancel</Btn>
        <Btn variant="default" size="lg" loading={saving === 'draft'} onClick={() => handleSave(false)}>
          <File size={14} />{isEdit ? 'Save Draft' : 'Save as Draft'}
        </Btn>
        <Btn variant="primary" size="lg" loading={saving === 'publish'} onClick={() => handleSave(true)}
          title={!form.lemonsqueezyVariantId ? 'Paste LemonSqueezy Variant ID first' : ''}
          className={!form.lemonsqueezyVariantId ? 'opacity-50 cursor-not-allowed' : ''}>
          <CheckCircle size={14} />{isEdit ? 'Save & Publish' : 'Publish'}
        </Btn>
      </div>
    </div>
  )
}

function ProductsPanel({ onToast }) {
  const [products, setProducts] = useState([])
  const [collections, setCollections] = useState([])
  const [categories, setCategories] = useState([])
  const [subpacks, setSubpacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [p, c, cat, sub] = await Promise.all([
        sanityRead(`*[_type == "product"] | order(_createdAt desc) { _id, name, slug, productCode, price, percentage, lemonsqueezyVariantId, fileUrl, image, previewImages, youtubeVideoId, fileSize, fileFormat, decayCurve, modes, algorithmicVariations, totalFiles, collection->{ _id, name, slug, emoji }, category->{ _id, name, slug, collection->{ _id } }, subpack->{ _id, name, slug, category->{ _id } } }`),
        sanityRead(`*[_type == "collection"] | order(order asc) { _id, name, slug, emoji, order }`),
        sanityRead(`*[_type == "category"] | order(order asc) { _id, name, slug, collection->{ _id, name } }`),
        sanityRead(`*[_type == "subpack"] | order(order asc) { _id, name, slug, category->{ _id, name } }`),
      ])
      setProducts(p || []); setCollections(c || []); setCategories(cat || []); setSubpacks(sub || [])
    } catch (e) { onToast('Failed to load', 'error') }
    finally { setLoading(false) }
  }, [onToast])

  useEffect(() => { load() }, [load])

  async function handleDelete(p) {
    setConfirm(null)
    try {
      await sanityWrite([{ delete: { id: p._id } }])
      onToast('Product deleted', 'success'); load()
    } catch (e) { onToast('Delete failed: ' + e.message, 'error') }
  }

  if (editing) return <ProductForm product={editing === 'new' ? null : editing} collections={collections} categories={categories} subpacks={subpacks} onSave={() => { setEditing(null); load() }} onCancel={() => setEditing(null)} onToast={onToast} />

  const filtered = products.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.productCode?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-mono text-xl font-bold text-white">Products</h1><p className="text-slate-500 text-sm mt-0.5">{products.length} total</p></div>
        <div className="flex gap-2"><Btn onClick={load}><RefreshCw size={13} /></Btn><Btn variant="primary" onClick={() => setEditing('new')}><Plus size={13} />New Product</Btn></div>
      </div>
      <div className="relative"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-white/5 bg-white/[0.03] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/40 font-mono" /></div>
      <Card>
        {loading ? <div className="flex items-center justify-center py-16"><Spinner /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5">{['Product', 'Collection', 'Price', 'Status', 'Variant ID', 'File', ''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-mono text-slate-500 font-normal">{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-4 py-3"><div className="text-white font-medium">{p.name}</div><div className="text-slate-500 text-xs font-mono">{p.slug?.current}</div></td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{p.collection?.emoji} {p.collection?.name || '—'}</td>
                    <td className="px-4 py-3 font-mono text-white text-xs">€{p.price ?? '—'}</td>
                    <td className="px-4 py-3">
                      {p._id.startsWith('drafts.')
                        ? <span className="text-xs px-2 py-0.5 rounded-full border font-mono bg-amber-500/10 text-amber-400 border-amber-500/25">draft</span>
                        : <span className="text-xs px-2 py-0.5 rounded-full border font-mono bg-emerald-500/10 text-emerald-400 border-emerald-500/25">published</span>}
                    </td>
                    <td className="px-4 py-3">{p.lemonsqueezyVariantId ? <span className="font-mono text-xs text-cyan-400">{p.lemonsqueezyVariantId}</span> : <span className="text-amber-400 text-xs flex items-center gap-1"><AlertCircle size={11} />missing</span>}</td>
                    <td className="px-4 py-3">{p.fileUrl ? <span className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle size={11} />uploaded</span> : <span className="text-amber-400 text-xs flex items-center gap-1"><AlertCircle size={11} />missing</span>}</td>
                    <td className="px-4 py-3"><div className="flex gap-1"><Btn size="sm" variant="ghost" onClick={() => setEditing(p)}><Edit size={12} /></Btn><Btn size="sm" variant="ghost" onClick={() => setConfirm(p)}><Trash2 size={12} className="text-red-400" /></Btn></div></td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-500 font-mono text-sm">No products found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {confirm && <ConfirmModal message={`Delete "${confirm.name}"? This cannot be undone.`} onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />}
    </div>
  )
}

function HierarchyForm({ type, item, parents, onSave, onCancel, onToast }) {
  const isEdit = !!item?._id
  const [form, setForm] = useState({ name: item?.name || '', slug: item?.slug?.current || '', emoji: item?.emoji || '', description: item?.description || '', order: item?.order ?? '', parentId: (type === 'category' ? item?.collection?._id : item?.category?._id) || '' })
  const [saving, setSaving] = useState(null) // null | 'draft' | 'publish'
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave() {
    if (!form.name) { onToast('Name is required', 'error'); return }
    setSaving(true)
    try {
      const slug = form.slug || slugify(form.name)
      const doc = { _type: type, name: form.name, slug: { _type: 'slug', current: slug } }
      if (form.emoji) doc.emoji = form.emoji
      if (form.description?.length) doc.description = form.description
      if (form.order !== '') doc.order = parseInt(form.order)
      if (type === 'category' && form.parentId) doc.collection = { _type: 'reference', _ref: form.parentId }
      if (type === 'subpack' && form.parentId) doc.category = { _type: 'reference', _ref: form.parentId }
      const mutations = isEdit ? [{ patch: { id: item._id, set: doc } }] : [{ create: { _id: `drafts.${uid()}`, ...doc } }]
      await sanityWrite(mutations)
      onToast(`${type} ${isEdit ? 'updated' : 'created'}!`, 'success'); onSave()
    } catch (e) { onToast('Save failed: ' + e.message, 'error') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"><ChevronLeft size={18} /></button>
        <h1 className="font-mono text-xl font-bold text-white capitalize">{isEdit ? `Edit ${type}` : `New ${type}`}</h1>
      </div>
      <Card className="p-5 space-y-4">
        <Field label="Name *"><Input value={form.name} onChange={e => { set('name', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)) }} /></Field>
        <Field label="Slug"><Input value={form.slug} onChange={e => set('slug', e.target.value)} /></Field>
        {type === 'collection' && <Field label="Emoji"><Input value={form.emoji} onChange={e => set('emoji', e.target.value)} placeholder="🎸" className="w-24" /></Field>}
        <Field label="Description"><Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} /></Field>
        <Field label="Order"><Input type="number" value={form.order} onChange={e => set('order', e.target.value)} className="w-24" /></Field>
        {type === 'category' && <Field label="Collection *"><Select value={form.parentId} onChange={e => set('parentId', e.target.value)}><option value="">— Select —</option>{parents.map(p => <option key={p._id} value={p._id}>{p.emoji} {p.name}</option>)}</Select></Field>}
        {type === 'subpack' && <Field label="Category *"><Select value={form.parentId} onChange={e => set('parentId', e.target.value)}><option value="">— Select —</option>{parents.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}</Select></Field>}
      </Card>
      <div className="flex gap-3"><Btn onClick={onCancel}>Cancel</Btn><Btn variant="primary" loading={saving} onClick={handleSave}><CheckCircle size={13} />{isEdit ? 'Save Changes' : `Create ${type}`}</Btn></div>
    </div>
  )
}

function HierarchyPanel({ type, label, pluralLabel, onToast }) {
  const [items, setItems] = useState([])
  const [parents, setParents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const q = {
    collection: `*[_type == "collection"] | order(order asc) { _id, name, slug, emoji, description, order, "productCount": count(*[_type == "product" && references(^._id)]) }`,
    category: `*[_type == "category"] | order(order asc) { _id, name, slug, description, order, collection->{ _id, name, emoji }, "productCount": count(*[_type == "product" && references(^._id)]) }`,
    subpack: `*[_type == "subpack"] | order(order asc) { _id, name, slug, description, order, category->{ _id, name, collection->{ _id, name, emoji } }, "productCount": count(*[_type == "product" && references(^._id)]) }`,
  }
  const pq = { category: `*[_type == "collection"] | order(order asc) { _id, name, emoji }`, subpack: `*[_type == "category"] | order(order asc) { _id, name }` }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await sanityRead(q[type]); setItems(data || [])
      if (pq[type]) { const p = await sanityRead(pq[type]); setParents(p || []) }
    } catch (e) { onToast('Failed to load', 'error') }
    finally { setLoading(false) }
  }, [type, onToast])

  useEffect(() => { load() }, [load])

  async function handleDelete(item) {
    setConfirm(null)
    try { await sanityWrite([{ delete: { id: item._id } }]); onToast(`${label} deleted`, 'success'); load() }
    catch (e) { onToast('Delete failed: ' + e.message, 'error') }
  }

  if (editing) return <HierarchyForm type={type} item={editing === 'new' ? null : editing} parents={parents} onSave={() => { setEditing(null); load() }} onCancel={() => setEditing(null)} onToast={onToast} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-mono text-xl font-bold text-white">{pluralLabel}</h1><p className="text-slate-500 text-sm mt-0.5">{items.length} total</p></div>
        <div className="flex gap-2"><Btn onClick={load}><RefreshCw size={13} /></Btn><Btn variant="primary" onClick={() => setEditing('new')}><Plus size={13} />New {label}</Btn></div>
      </div>
      <div className="space-y-2">
        {loading ? <div className="flex items-center justify-center py-16"><Spinner /></div>
          : items.length === 0 ? <Card className="p-12 text-center text-slate-500 font-mono text-sm">No {pluralLabel.toLowerCase()} yet</Card>
          : items.map(item => (
            <Card key={item._id} className="p-4 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {item.emoji && <span className="text-xl">{item.emoji}</span>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="text-white font-medium">{item.name}</span>{item.order != null && <span className="text-xs font-mono text-slate-600">#{item.order}</span>}</div>
                    <div className="text-slate-500 text-xs font-mono">{item.slug?.current}</div>
                    {item.collection && <div className="text-slate-600 text-xs mt-0.5">{item.collection.emoji} {item.collection.name}</div>}
                    {item.category && <div className="text-slate-600 text-xs mt-0.5">{item.category.collection?.emoji} {item.category.collection?.name} › {item.category.name}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {item.productCount != null && <div className="text-center"><div className="font-mono text-sm font-bold text-white">{item.productCount}</div><div className="text-slate-600 text-[10px]">products</div></div>}
                  <div className="flex gap-1"><Btn size="sm" variant="ghost" onClick={() => setEditing(item)}><Edit size={12} /></Btn><Btn size="sm" variant="ghost" onClick={() => setConfirm(item)}><Trash2 size={12} className="text-red-400" /></Btn></div>
                </div>
              </div>
            </Card>
          ))}
      </div>
      {confirm && <ConfirmModal message={`Delete "${confirm.name}"?`} onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />}
    </div>
  )
}

function OverviewPanel() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    Promise.all([
      sanityRead(`count(*[_type == "product"])`),
      sanityRead(`count(*[_type == "collection"])`),
      sanityRead(`count(*[_type == "category"])`),
      sanityRead(`count(*[_type == "subpack"])`),
      sanityRead(`count(*[_type == "product" && (lemonsqueezyVariantId == null || lemonsqueezyVariantId == "")])`),
      sanityRead(`count(*[_type == "product" && (fileUrl == null || fileUrl == "")])`),
    ]).then(([products, collections, categories, subpacks, missingVariant, missingFile]) => {
      setStats({ products, collections, categories, subpacks, missingVariant, missingFile })
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center py-32"><Spinner size={24} /></div>
  return (
    <div className="space-y-8">
      <div><h1 className="font-mono text-xl font-bold text-white mb-1">Dashboard Overview</h1><p className="text-slate-500 text-sm">Trim Pulses · Live data</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{icon: Package, label: 'Products', value: stats.products, c: 'cyan'}, {icon: Layers, label: 'Collections', value: stats.collections, c: 'fuchsia'}, {icon: Tag, label: 'Categories', value: stats.categories, c: 'emerald'}, {icon: FolderOpen, label: 'Subpacks', value: stats.subpacks, c: 'amber'}].map(({icon: Icon, label, value, c}) => (
          <Card key={label} className="p-5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-${c}-400/10`}><Icon size={15} className={`text-${c}-400`} /></div>
            <div className="font-mono text-2xl font-bold text-white">{value}</div>
            <div className="text-slate-500 text-xs mt-0.5">{label}</div>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <h2 className="font-mono text-sm font-bold text-white mb-4 flex items-center gap-2"><Zap size={14} className="text-cyan-400" />Data Health</h2>
        {[{label: 'Products missing LemonSqueezy Variant ID', count: stats.missingVariant, total: stats.products}, {label: 'Products missing S3 file URL', count: stats.missingFile, total: stats.products}].map(({label, count, total}) => (
          <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-2.5 text-sm text-slate-300">{count > 0 ? <AlertCircle size={14} className="text-amber-400" /> : <CheckCircle size={14} className="text-emerald-400" />}{label}</div>
            <span className={`font-mono text-sm ${count > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{count}/{total}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}

function OrdersPanel({ onToast }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    fetch('/api/admin/orders').then(r => { if (!r.ok) throw new Error('Failed'); return r.json() })
      .then(d => setOrders(d.orders || [])).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-mono text-xl font-bold text-white">Orders</h1><p className="text-slate-500 text-sm mt-0.5">Via LemonSqueezy API</p></div>
        <a href="https://app.lemonsqueezy.com/orders" target="_blank" rel="noopener noreferrer"><Btn><Link2 size={13} />LemonSqueezy</Btn></a>
      </div>
      {error && <Card className="p-4 border-red-500/20 bg-red-500/5 text-red-400 text-sm font-mono">{error}</Card>}
      <Card>
        {loading ? <div className="flex items-center justify-center py-16"><Spinner /></div> : (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-b border-white/5">{['Order', 'Customer', 'Total', 'Status', 'Date', ''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-mono text-slate-500 font-normal">{h}</th>)}</tr></thead>
            <tbody>
              {orders.map(o => <tr key={o.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-mono text-xs text-cyan-400">#{o.id}</td>
                <td className="px-4 py-3"><div className="text-white text-xs">{o.attributes?.user_name}</div><div className="text-slate-500 text-xs">{o.attributes?.user_email}</div></td>
                <td className="px-4 py-3 font-mono text-white text-xs">€{((o.attributes?.total || 0) / 100).toFixed(2)}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full border font-mono bg-emerald-500/15 text-emerald-400 border-emerald-500/30">{o.attributes?.status}</span></td>
                <td className="px-4 py-3 text-slate-400 text-xs font-mono">{o.attributes?.created_at ? new Date(o.attributes.created_at).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-3"><a href={`https://app.lemonsqueezy.com/orders/${o.id}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400"><Eye size={13} /></a></td>
              </tr>)}
              {orders.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-500 font-mono text-sm">No orders yet</td></tr>}
            </tbody>
          </table></div>
        )}
      </Card>
    </div>
  )
}

function S3Panel({ onToast }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [generating, setGenerating] = useState(null)
  const [signedUrl, setSignedUrl] = useState(null)
  useEffect(() => {
    fetch('/api/admin/s3-list').then(r => { if (!r.ok) throw new Error('Failed'); return r.json() })
      .then(d => setFiles(d.files || [])).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])
  async function sign(key) {
    setGenerating(key)
    try {
      const res = await fetch(`/api/download?fileKey=${encodeURIComponent(key)}`)
      const d = await res.json()
      if (d.url) { setSignedUrl(d.url); onToast('Signed URL generated (24h)', 'success') }
    } catch { onToast('Failed', 'error') } finally { setGenerating(null) }
  }
  return (
    <div className="space-y-6">
      <h1 className="font-mono text-xl font-bold text-white">S3 Files</h1>
      {signedUrl && <Card className="p-4 border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2"><input readOnly value={signedUrl} className="flex-1 bg-white/5 border border-white/5 rounded px-3 py-1.5 text-xs font-mono text-slate-300 truncate" /><Btn size="sm" onClick={() => { navigator.clipboard.writeText(signedUrl); onToast('Copied!', 'info') }}><Copy size={11} /></Btn></Card>}
      {error && <Card className="p-4 border-amber-500/20 bg-amber-500/5 text-amber-400 text-sm font-mono">{error}</Card>}
      <Card>
        {loading ? <div className="flex items-center justify-center py-16"><Spinner /></div> : (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-b border-white/5">{['File Key', 'Size', 'Modified', ''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-mono text-slate-500 font-normal">{h}</th>)}</tr></thead>
            <tbody>
              {files.map(f => <tr key={f.key} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-mono text-xs text-slate-300">{f.key}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">{f.size ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : '—'}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">{f.lastModified ? new Date(f.lastModified).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-3"><Btn size="sm" variant="primary" loading={generating === f.key} onClick={() => sign(f.key)}><Link2 size={11} />Sign URL</Btn></td>
              </tr>)}
              {files.length === 0 && <tr><td colSpan={4} className="px-4 py-12 text-center text-slate-500 font-mono text-sm">{error ? 'Unavailable' : 'No files'}</td></tr>}
            </tbody>
          </table></div>
        )}
      </Card>
    </div>
  )
}

const NAV = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'collections', label: 'Collections', icon: Layers },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'subpacks', label: 'Subpacks', icon: FolderOpen },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 's3', label: 'S3 Files', icon: FileArchive },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [toast, setToast] = useState(null)
  const showToast = useCallback((message, type = 'info') => setToast({ message, type, id: Date.now() }), [])

  const panels = {
    overview: <OverviewPanel />,
    products: <ProductsPanel onToast={showToast} />,
    collections: <HierarchyPanel type="collection" label="Collection" pluralLabel="Collections" onToast={showToast} />,
    categories: <HierarchyPanel type="category" label="Category" pluralLabel="Categories" onToast={showToast} />,
    subpacks: <HierarchyPanel type="subpack" label="Subpack" pluralLabel="Subpacks" onToast={showToast} />,
    orders: <OrdersPanel onToast={showToast} />,
    s3: <S3Panel onToast={showToast} />,
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a12] text-white">
      <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-white/5 bg-[#07070f]">
        <div className="px-5 py-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 flex items-center justify-center">
              <div className="w-5 h-5 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-sm flex items-center justify-center" style={{clipPath:'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
            </div>
            <div><div className="font-mono font-bold text-sm text-white">TrimPulses</div><div className="font-mono text-[10px] text-slate-500">admin console</div></div>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${tab === id ? 'bg-cyan-500/10 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
              <Icon size={15} />{label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/5"><a href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-xs font-mono"><Globe size={12} />trimpulses.com</a></div>
      </aside>
      <main className="flex-1 overflow-y-auto"><div className="max-w-5xl mx-auto px-8 py-10">{panels[tab]}</div></main>
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
