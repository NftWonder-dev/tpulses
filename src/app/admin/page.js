'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Package, FolderOpen, Tag, ShoppingBag, Upload, Database,
  Plus, Edit, Trash2, Eye, RefreshCw, CheckCircle, XCircle,
  AlertCircle, ChevronDown, ChevronRight, Search, Filter,
  DollarSign, Users, TrendingUp, FileArchive, Link2, Copy,
  Layers, BookOpen, Settings, LogOut, Home, Zap, Globe
} from 'lucide-react'

// ─── Reusable UI ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    paid: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    refunded: 'bg-red-500/15 text-red-400 border-red-500/30',
    active: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    inactive: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${map[status] || map.inactive}`}>
      {status}
    </span>
  )
}

function Pill({ children, color = 'slate' }) {
  const colors = {
    cyan: 'bg-cyan-500/10 text-cyan-400',
    magenta: 'bg-fuchsia-500/10 text-fuchsia-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    slate: 'bg-slate-500/10 text-slate-400',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded font-mono ${colors[color]}`}>
      {children}
    </span>
  )
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  const styles = {
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    error: 'border-red-500/40 bg-red-500/10 text-red-300',
    info: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
  }
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm font-mono text-sm ${styles[type]}`}>
      {type === 'success' && <CheckCircle size={15} />}
      {type === 'error' && <XCircle size={15} />}
      {type === 'info' && <AlertCircle size={15} />}
      {message}
    </div>
  )
}

function Spinner({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin text-cyan-400">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.4" strokeDashoffset="10" />
    </svg>
  )
}

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm ${className}`}>
      {children}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, color = 'cyan' }) {
  const colors = {
    cyan: 'text-cyan-400 bg-cyan-400/10',
    magenta: 'text-fuchsia-400 bg-fuchsia-400/10',
    emerald: 'text-emerald-400 bg-emerald-400/10',
    amber: 'text-amber-400 bg-amber-400/10',
  }
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon size={18} className={colors[color].split(' ')[0]} />
        </div>
      </div>
      <div className="font-mono text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-slate-400 text-xs">{label}</div>
      {sub && <div className="text-slate-500 text-xs mt-1">{sub}</div>}
    </Card>
  )
}

// ─── Nav Sidebar ───────────────────────────────────────────────────────────

const NAV = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'collections', label: 'Collections', icon: Layers },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'subpacks', label: 'Subpacks', icon: FolderOpen },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 's3', label: 'S3 Files', icon: FileArchive },
  { id: 'sync', label: 'Sync & Health', icon: Zap },
]

function Sidebar({ active, onNav }) {
  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-white/5 bg-[#07070f]">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center">
            <Zap size={13} className="text-black" />
          </div>
          <div>
            <div className="font-mono font-bold text-sm text-white">TrimPulses</div>
            <div className="font-mono text-[10px] text-slate-500">admin console</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
              active === id
                ? 'bg-cyan-500/10 text-cyan-400 font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5">
        <a
          href="/"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-xs font-mono transition-colors"
        >
          <Globe size={12} />
          trimpulses.com
        </a>
      </div>
    </aside>
  )
}

// ─── Sanity helpers ────────────────────────────────────────────────────────

async function sanityFetch(query, params = {}) {
  // Routes through /api/admin/sanity to avoid browser CORS issues
  const res = await fetch('/api/admin/sanity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, params }),
  })
  if (!res.ok) throw new Error(`Sanity proxy error: ${res.status}`)
  const data = await res.json()
  return data.result
}

// ─── Overview panel ────────────────────────────────────────────────────────

function OverviewPanel() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [products, collections, categories, subpacks] = await Promise.all([
          sanityFetch(`count(*[_type == "product"])`),
          sanityFetch(`count(*[_type == "collection"])`),
          sanityFetch(`count(*[_type == "category"])`),
          sanityFetch(`count(*[_type == "subpack"])`),
        ])

        // Products missing critical fields
        const missingVariant = await sanityFetch(
          `count(*[_type == "product" && (lemonsqueezyVariantId == null || lemonsqueezyVariantId == "")])`
        )
        const missingFile = await sanityFetch(
          `count(*[_type == "product" && (fileUrl == null || fileUrl == "")])`
        )

        setStats({ products, collections, categories, subpacks, missingVariant, missingFile })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Spinner size={24} />
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-mono text-xl font-bold text-white mb-1">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm">Trim Pulses · Sanity CMS · Live data</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Products" value={stats.products} color="cyan" />
        <StatCard icon={Layers} label="Collections" value={stats.collections} color="magenta" />
        <StatCard icon={Tag} label="Categories" value={stats.categories} color="emerald" />
        <StatCard icon={FolderOpen} label="Subpacks" value={stats.subpacks} color="amber" />
      </div>

      {/* Health checks */}
      <Card className="p-6">
        <h2 className="font-mono text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Zap size={14} className="text-cyan-400" /> Data Health
        </h2>
        <div className="space-y-3">
          <HealthRow
            label="Products missing LemonSqueezy Variant ID"
            count={stats.missingVariant}
            total={stats.products}
            warn={stats.missingVariant > 0}
          />
          <HealthRow
            label="Products missing S3 file URL"
            count={stats.missingFile}
            total={stats.products}
            warn={stats.missingFile > 0}
          />
        </div>
      </Card>

      {/* Quick links */}
      <Card className="p-6">
        <h2 className="font-mono text-sm font-bold text-white mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Sanity Studio', href: `https://ji82q30h.sanity.studio`, icon: Database },
            { label: 'LemonSqueezy Dashboard', href: 'https://app.lemonsqueezy.com', icon: DollarSign },
            { label: 'AWS S3 Console', href: 'https://console.aws.amazon.com/s3', icon: FileArchive },
            { label: 'Vercel Deployments', href: 'https://vercel.com/dashboard', icon: Globe },
          ].map(({ label, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 transition-all text-slate-300 hover:text-white text-sm group"
            >
              <Icon size={13} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
              {label}
              <Link2 size={10} className="ml-auto text-slate-600 group-hover:text-slate-400" />
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}

function HealthRow({ label, count, total, warn }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2.5 text-sm text-slate-300">
        {warn ? (
          <AlertCircle size={14} className="text-amber-400 shrink-0" />
        ) : (
          <CheckCircle size={14} className="text-emerald-400 shrink-0" />
        )}
        {label}
      </div>
      <span className={`font-mono text-sm ${warn ? 'text-amber-400' : 'text-emerald-400'}`}>
        {count} / {total}
      </span>
    </div>
  )
}

// ─── Products Panel ─────────────────────────────────────────────────────────

function ProductsPanel({ onToast }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterMissing, setFilterMissing] = useState(false)
  const [selected, setSelected] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await sanityFetch(`*[_type == "product"] | order(collection->order asc, order asc) {
        _id, name, slug, productCode, price, percentage,
        lemonsqueezyVariantId, fileUrl, fileSize, fileFormat,
        collection->{ _id, name, slug, emoji },
        category->{ _id, name, slug },
        subpack->{ _id, name, slug }
      }`)
      setProducts(data || [])
    } catch (e) {
      onToast('Failed to load products', 'error')
    } finally {
      setLoading(false)
    }
  }, [onToast])

  useEffect(() => { load() }, [load])

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.productCode?.toLowerCase().includes(q)
    const matchFilter = !filterMissing || !p.lemonsqueezyVariantId || !p.fileUrl
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-xl font-bold text-white">Products</h1>
          <p className="text-slate-500 text-sm mt-0.5">{products.length} total · Manage via Sanity</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="p-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-white transition-all"
          >
            <RefreshCw size={14} />
          </button>
          <a
            href="https://ji82q30h.sanity.studio/structure/product"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm font-mono"
          >
            <Plus size={13} /> New Product
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or code…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-white/5 bg-white/[0.03] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.05] transition-all font-mono"
          />
        </div>
        <button
          onClick={() => setFilterMissing(!filterMissing)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-mono transition-all ${
            filterMissing
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
              : 'border-white/5 bg-white/[0.03] text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertCircle size={13} />
          Missing data
        </button>
      </div>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Product', 'Code', 'Collection', 'Price', 'Variant ID', 'File URL', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-mono text-slate-500 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr
                    key={p._id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 text-white font-medium max-w-48">
                      <div className="truncate">{p.name}</div>
                      <div className="text-slate-500 text-xs font-mono truncate">{p.slug?.current}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Pill>{p.productCode || '—'}</Pill>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {p.collection?.emoji} {p.collection?.name || '—'}
                    </td>
                    <td className="px-4 py-3 font-mono text-white text-xs">
                      €{p.price ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      {p.lemonsqueezyVariantId ? (
                        <span className="font-mono text-xs text-cyan-400 flex items-center gap-1">
                          {p.lemonsqueezyVariantId}
                          <button
                            onClick={() => { navigator.clipboard.writeText(p.lemonsqueezyVariantId); onToast('Copied!', 'info') }}
                            className="text-slate-500 hover:text-slate-300"
                          >
                            <Copy size={10} />
                          </button>
                        </span>
                      ) : (
                        <span className="text-amber-400 text-xs flex items-center gap-1">
                          <AlertCircle size={11} /> missing
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {p.fileUrl ? (
                        <span className="font-mono text-xs text-emerald-400 truncate max-w-32 block">{p.fileUrl}</span>
                      ) : (
                        <span className="text-amber-400 text-xs flex items-center gap-1">
                          <AlertCircle size={11} /> missing
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://ji82q30h.sanity.studio/structure/product;${p._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-white/5 text-slate-500 hover:text-cyan-400 transition-all inline-flex"
                        title="Edit in Sanity"
                      >
                        <Edit size={13} />
                      </a>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500 font-mono text-sm">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── Generic List Panel for Collections / Categories / Subpacks ─────────────

function HierarchyPanel({ type, label, pluralLabel, onToast }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const queries = {
    collection: `*[_type == "collection"] | order(order asc) {
      _id, name, slug, emoji, description, order,
      "categoryCount": count(*[_type == "category" && references(^._id)]),
      "productCount": count(*[_type == "product" && references(^._id)])
    }`,
    category: `*[_type == "category"] | order(order asc) {
      _id, name, slug, description, order,
      collection->{ name, slug, emoji },
      "subpackCount": count(*[_type == "subpack" && references(^._id)]),
      "productCount": count(*[_type == "product" && references(^._id)])
    }`,
    subpack: `*[_type == "subpack"] | order(order asc) {
      _id, name, slug, description, order,
      category->{ name, slug, collection->{ name, slug, emoji } },
      "productCount": count(*[_type == "product" && references(^._id)])
    }`,
  }

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await sanityFetch(queries[type])
        setItems(data || [])
      } catch (e) {
        onToast('Failed to load data', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [type])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-xl font-bold text-white">{pluralLabel}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{items.length} total</p>
        </div>
        <a
          href={`https://ji82q30h.sanity.studio/structure/${type}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm font-mono"
        >
          <Plus size={13} /> New {label}
        </a>
      </div>

      <div className="grid gap-3">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner /></div>
        ) : items.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 font-mono text-sm">No {pluralLabel.toLowerCase()} yet</Card>
        ) : (
          items.map(item => (
            <Card key={item._id} className="p-4 hover:border-white/10 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {item.emoji && (
                    <span className="text-xl mt-0.5">{item.emoji}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-medium">{item.name}</span>
                      {item.order != null && (
                        <Pill color="slate">order: {item.order}</Pill>
                      )}
                    </div>
                    <div className="text-slate-500 text-xs font-mono mt-0.5">{item.slug?.current}</div>
                    {/* Breadcrumb for nested types */}
                    {item.collection && (
                      <div className="text-slate-500 text-xs mt-1">
                        {item.collection.emoji} {item.collection.name}
                      </div>
                    )}
                    {item.category && (
                      <div className="text-slate-500 text-xs mt-1">
                        {item.category.collection?.emoji} {item.category.collection?.name} › {item.category.name}
                      </div>
                    )}
                    {item.description && (
                      <p className="text-slate-400 text-xs mt-1.5 truncate max-w-xl">{item.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {item.categoryCount != null && (
                    <div className="text-center">
                      <div className="font-mono text-sm font-bold text-white">{item.categoryCount}</div>
                      <div className="text-slate-500 text-[10px]">categories</div>
                    </div>
                  )}
                  {item.subpackCount != null && (
                    <div className="text-center">
                      <div className="font-mono text-sm font-bold text-white">{item.subpackCount}</div>
                      <div className="text-slate-500 text-[10px]">subpacks</div>
                    </div>
                  )}
                  {item.productCount != null && (
                    <div className="text-center">
                      <div className="font-mono text-sm font-bold text-white">{item.productCount}</div>
                      <div className="text-slate-500 text-[10px]">products</div>
                    </div>
                  )}
                  <a
                    href={`https://ji82q30h.sanity.studio/structure/${type};${item._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded hover:bg-white/5 text-slate-500 hover:text-cyan-400 transition-all"
                    title="Edit in Sanity"
                  >
                    <Edit size={13} />
                  </a>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

// ─── Orders Panel ──────────────────────────────────────────────────────────

function OrdersPanel({ onToast }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/admin/orders')
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        setOrders(data.orders || [])
      } catch (e) {
        setError(e.message)
        onToast('Failed to load orders – check API key', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-xl font-bold text-white">Orders</h1>
          <p className="text-slate-500 text-sm mt-0.5">Via LemonSqueezy API</p>
        </div>
        <a
          href="https://app.lemonsqueezy.com/orders"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 hover:text-white transition-all text-sm"
        >
          <Link2 size={13} /> Open LemonSqueezy
        </a>
      </div>

      {error && (
        <Card className="p-4 border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-2 text-red-400 text-sm font-mono">
            <XCircle size={14} />
            {error}
          </div>
          <p className="text-slate-400 text-xs mt-2">
            Make sure <code className="bg-white/5 px-1 rounded">LEMONSQUEEZY_API_KEY</code> is set in environment variables and the <code className="bg-white/5 px-1 rounded">/api/admin/orders</code> route is deployed.
          </p>
        </Card>
      )}

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner /></div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-mono text-sm">
            {error ? 'Could not load orders' : 'No orders yet'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Order ID', 'Customer', 'Products', 'Total', 'Status', 'Date', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-mono text-slate-500 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-cyan-400">#{order.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-white text-xs">{order.attributes?.user_name}</div>
                      <div className="text-slate-500 text-xs">{order.attributes?.user_email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs max-w-40 truncate">
                      {order.attributes?.first_order_item?.variant_name || '—'}
                    </td>
                    <td className="px-4 py-3 font-mono text-white text-xs">
                      €{((order.attributes?.total || 0) / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.attributes?.status || 'pending'} />
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs font-mono">
                      {order.attributes?.created_at
                        ? new Date(order.attributes.created_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://app.lemonsqueezy.com/orders/${order.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-white/5 text-slate-500 hover:text-cyan-400 transition-all inline-flex"
                      >
                        <Eye size={13} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── S3 Files Panel ────────────────────────────────────────────────────────

function S3Panel({ onToast }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [testUrl, setTestUrl] = useState('')
  const [generating, setGenerating] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/admin/s3-list')
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        setFiles(data.files || [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function generateSignedUrl(fileKey) {
    setGenerating(fileKey)
    try {
      const res = await fetch(`/api/download?fileKey=${encodeURIComponent(fileKey)}`)
      const data = await res.json()
      if (data.url) {
        setTestUrl(data.url)
        onToast('Signed URL generated (24h)', 'success')
      }
    } catch (e) {
      onToast('Failed to generate URL', 'error')
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-xl font-bold text-white">S3 Files</h1>
          <p className="text-slate-500 text-sm mt-0.5">Bucket: tpulses-products · eu-north-1</p>
        </div>
        <a
          href="https://console.aws.amazon.com/s3/buckets/tpulses-products"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 hover:text-white transition-all text-sm"
        >
          <Link2 size={13} /> AWS Console
        </a>
      </div>

      {/* Test URL section */}
      {testUrl && (
        <Card className="p-4 border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-2">
            <CheckCircle size={13} /> Generated signed URL (24h expiry)
          </div>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={testUrl}
              className="flex-1 bg-white/5 border border-white/5 rounded px-3 py-1.5 text-xs font-mono text-slate-300 truncate"
            />
            <button
              onClick={() => { navigator.clipboard.writeText(testUrl); onToast('Copied!', 'info') }}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <Copy size={13} />
            </button>
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-4 border-amber-500/20 bg-amber-500/5">
          <div className="text-amber-400 text-sm font-mono flex items-center gap-2">
            <AlertCircle size={13} /> {error}
          </div>
          <p className="text-slate-400 text-xs mt-1.5">
            Deploy <code className="bg-white/5 px-1 rounded">/api/admin/s3-list</code> to enable file listing.
          </p>
        </Card>
      )}

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner /></div>
        ) : files.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-mono text-sm">
            {error ? 'File listing unavailable' : 'No files found'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['File Key', 'Size', 'Last Modified', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-mono text-slate-500 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {files.map(f => (
                  <tr key={f.key} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-300 max-w-sm truncate">{f.key}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">
                      {f.size ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : '—'}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">
                      {f.lastModified ? new Date(f.lastModified).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => generateSignedUrl(f.key)}
                        disabled={generating === f.key}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs font-mono transition-all disabled:opacity-50"
                      >
                        {generating === f.key ? <Spinner size={11} /> : <Link2 size={11} />}
                        Sign URL
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── Sync & Health Panel ───────────────────────────────────────────────────

function SyncPanel({ onToast }) {
  const [checks, setChecks] = useState([])
  const [running, setRunning] = useState(false)

  async function runChecks() {
    setRunning(true)
    setChecks([])
    const results = []

    // 1. Sanity connection
    try {
      const count = await sanityFetch(`count(*[_type == "product"])`)
      results.push({ label: 'Sanity API', status: 'ok', detail: `${count} products accessible` })
    } catch (e) {
      results.push({ label: 'Sanity API', status: 'error', detail: e.message })
    }
    setChecks([...results])

    // 2. Products with variant IDs
    try {
      const total = await sanityFetch(`count(*[_type == "product"])`)
      const withVariant = await sanityFetch(`count(*[_type == "product" && lemonsqueezyVariantId != null && lemonsqueezyVariantId != ""])`)
      const pct = total > 0 ? Math.round((withVariant / total) * 100) : 0
      results.push({ label: 'Products with Variant IDs', status: pct === 100 ? 'ok' : 'warn', detail: `${withVariant}/${total} (${pct}%)` })
    } catch (e) {
      results.push({ label: 'Products with Variant IDs', status: 'error', detail: e.message })
    }
    setChecks([...results])

    // 3. Products with file URLs
    try {
      const total = await sanityFetch(`count(*[_type == "product"])`)
      const withFile = await sanityFetch(`count(*[_type == "product" && fileUrl != null && fileUrl != ""])`)
      const pct = total > 0 ? Math.round((withFile / total) * 100) : 0
      results.push({ label: 'Products with S3 File URLs', status: pct === 100 ? 'ok' : 'warn', detail: `${withFile}/${total} (${pct}%)` })
    } catch (e) {
      results.push({ label: 'Products with S3 File URLs', status: 'error', detail: e.message })
    }
    setChecks([...results])

    // 4. Download API
    try {
      const res = await fetch('/api/download?fileKey=test')
      results.push({
        label: 'Download API (/api/download)',
        status: res.status !== 404 ? 'ok' : 'error',
        detail: `HTTP ${res.status}`,
      })
    } catch (e) {
      results.push({ label: 'Download API', status: 'error', detail: 'Unreachable' })
    }
    setChecks([...results])

    // 5. Webhook route
    try {
      const res = await fetch('/api/webhooks/lemonsqueezy', { method: 'POST', body: '{}' })
      results.push({
        label: 'Webhook Route (/api/webhooks/lemonsqueezy)',
        status: res.status !== 404 ? 'ok' : 'error',
        detail: `HTTP ${res.status}`,
      })
    } catch (e) {
      results.push({ label: 'Webhook Route', status: 'error', detail: 'Unreachable' })
    }
    setChecks([...results])

    setRunning(false)
    onToast('Health check complete', 'success')
  }

  const statusIcon = (s) => ({
    ok: <CheckCircle size={14} className="text-emerald-400" />,
    warn: <AlertCircle size={14} className="text-amber-400" />,
    error: <XCircle size={14} className="text-red-400" />,
  })[s]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-xl font-bold text-white">Sync & Health</h1>
          <p className="text-slate-500 text-sm mt-0.5">Validate all integrations</p>
        </div>
        <button
          onClick={runChecks}
          disabled={running}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm font-mono disabled:opacity-50"
        >
          {running ? <Spinner size={14} /> : <Zap size={14} />}
          Run Checks
        </button>
      </div>

      {checks.length === 0 && !running && (
        <Card className="p-12 text-center text-slate-500 font-mono text-sm">
          Click "Run Checks" to validate your integrations
        </Card>
      )}

      {checks.length > 0 && (
        <Card className="divide-y divide-white/5">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                {statusIcon(c.status)}
                {c.label}
              </div>
              <span className={`font-mono text-xs ${
                c.status === 'ok' ? 'text-emerald-400' :
                c.status === 'warn' ? 'text-amber-400' : 'text-red-400'
              }`}>
                {c.detail}
              </span>
            </div>
          ))}
          {running && (
            <div className="flex items-center gap-3 px-5 py-3.5 text-slate-400 text-sm font-mono">
              <Spinner size={13} /> Checking…
            </div>
          )}
        </Card>
      )}

      {/* Environment variables checklist */}
      <Card className="p-6">
        <h2 className="font-mono text-sm font-bold text-white mb-4">Required Environment Variables</h2>
        <div className="space-y-2">
          {[
            'LEMONSQUEEZY_API_KEY',
            'LEMONSQUEEZY_STORE_ID',
            'LEMONSQUEEZY_WEBHOOK_SECRET',
            'AWS_REGION',
            'AWS_ACCESS_KEY_ID',
            'AWS_SECRET_ACCESS_KEY',
            'AWS_S3_BUCKET_NAME',
            'RESEND_API_KEY',
            'NEXT_PUBLIC_SANITY_PROJECT_ID',
            'NEXT_PUBLIC_SANITY_DATASET',
            'NEXT_PUBLIC_SITE_PASSWORD',
            'NEXT_PUBLIC_BASE_URL',
          ].map(v => (
            <div key={v} className="flex items-center justify-between py-1.5 border-b border-white/[0.03] last:border-0">
              <code className="font-mono text-xs text-cyan-300">{v}</code>
              <span className="text-slate-600 text-xs">Set in .env.local & Vercel</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Root Component ────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() })
  }, [])

  const panels = {
    overview: <OverviewPanel />,
    products: <ProductsPanel onToast={showToast} />,
    collections: <HierarchyPanel type="collection" label="Collection" pluralLabel="Collections" onToast={showToast} />,
    categories: <HierarchyPanel type="category" label="Category" pluralLabel="Categories" onToast={showToast} />,
    subpacks: <HierarchyPanel type="subpack" label="Subpack" pluralLabel="Subpacks" onToast={showToast} />,
    orders: <OrdersPanel onToast={showToast} />,
    s3: <S3Panel onToast={showToast} />,
    sync: <SyncPanel onToast={showToast} />,
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a12] text-white">
      <Sidebar active={tab} onNav={setTab} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">
          {panels[tab]}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
