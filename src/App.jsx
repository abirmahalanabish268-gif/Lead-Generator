import { useState } from 'react'
import './App.css'
import JSZip from 'jszip/dist/jszip.min.js'

const mockLeads = [
  { id: "jd_001", name: "Glamour Studio", category: "Salon", phone: "9876543210", template: "Salon", pitched: false },
  { id: "jd_002", name: "Brew & Bean Cafe", category: "Cafe", phone: "9123456789", template: "Cafe", pitched: true },
  { id: "jd_003", name: "Iron Paradise Gym", category: "Gym", phone: "9812345678", template: "Gym", pitched: false },
  { id: "jd_004", name: "Urban Canvas Interiors", category: "Interior Designer", phone: "9987654321", template: "Interior Designer", pitched: false },
  { id: "jd_005", name: "Lens & Light Photography", category: "Photographer", phone: "9001122334", template: "Photographer", pitched: true },
  { id: "jd_006", name: "Curl Up & Dye Salon", category: "Salon", phone: "9012345678", template: "Salon", pitched: false },
]

const cities = ["Kolkata", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"]
const categories = ["Salon", "Cafe", "Gym", "Interior Designer", "Photographer"]

const templateVars = ["{name}", "{biz_name}", "{demo_link}"]

const defaultTemplates = {
  "Salon": "Hi {name}, I'm Abir from Byters. I made a free demo website for {biz_name}. I can make it live in 2 days for just ₹5,000. Interested? Here's a preview: {demo_link}",
  "Cafe": "Hi {name}, I'm from Byters. We create beautiful websites for cafes like yours. Let's get your business online in 48 hours for just ₹5,000. Preview: {demo_link}",
  "Gym": "Hi {name}, I'm from Byters. Your gym deserves an online presence! I'll build a demo website in 2 days for ₹5,000. Check it out: {demo_link}",
  "Interior Designer": "Hi {name}, I'm from Byters. Showcase your design portfolio online! I'll create a demo website in 2 days for ₹5,000. Preview: {demo_link}",
  "Photographer": "Hi {name}, I'm from Byters. Display your best shots online! I'll build a portfolio website in 2 days for ₹5,000. See demo: {demo_link}",
}

function DashboardSection({ totalLeads, pitchedLeads, newLeads, categories, uploadedTemplates, templateAssignments }) {
  const totalTemplates = uploadedTemplates.length
  const assignedTemplates = Object.keys(templateAssignments).length
  const successRate = totalLeads > 0 ? Math.round((pitchedLeads / totalLeads) * 100) : 0
  
  const categoryStats = categories.map(cat => {
    const count = uploadedTemplates.filter(t => t.categories.includes(cat)).length
    return { category: cat, count }
  })

  return (
    <section className="dashboard-section">
      <div className="dashboard-header">
        <h2>📊 Performance Analytics</h2>
        <p className="dashboard-subtitle">Overview of your lead generation and template library</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">🎯</div>
          <div className="metric-value">{totalLeads}</div>
          <div className="metric-label">Total Leads Found</div>
          <div className="metric-trend positive">+{newLeads} new today</div>
        </div>
        <div className="metric-card success">
          <div className="metric-icon">✅</div>
          <div className="metric-value">{pitchedLeads}</div>
          <div className="metric-label">Successfully Pitched</div>
          <div className="metric-trend">{successRate}% conversion</div>
        </div>
        <div className="metric-card info">
          <div className="metric-icon">📦</div>
          <div className="metric-value">{totalTemplates}</div>
          <div className="metric-label">Website Templates</div>
          <div className="metric-trend">{assignedTemplates} assigned</div>
        </div>
        <div className="metric-card accent">
          <div className="metric-icon">💬</div>
          <div className="metric-value">{newLeads}</div>
          <div className="metric-label">Ready to Pitch</div>
          <div className="metric-trend">View in Finder</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="category-breakdown">
          <h3>📈 Category Distribution</h3>
          <div className="category-list">
            {categoryStats.map(({ category, count }, index) => {
              const colors = ['#FF6B9D', '#4ECDC4', '#FFD93D', '#6BCF7F', '#A855F7']
              return (
                <div key={category} className="category-item">
                  <div className="category-info">
                    <span className="category-dot" style={{ backgroundColor: colors[index % colors.length] }}></span>
                    <span className="category-name">{category}</span>
                  </div>
                  <div className="category-count">{count} templates</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="recent-templates">
          <h3>📁 Recent Uploads</h3>
          {uploadedTemplates.length > 0 ? (
            <div className="template-list">
              {uploadedTemplates.slice(-5).reverse().map((tpl, idx) => (
                <div key={idx} className="template-list-item">
                  <span className="template-list-icon">{tpl.isZip ? '📦' : '🌐'}</span>
                  <span className="template-list-name" title={tpl.name}>
                    {tpl.name.length > 25 ? `${tpl.name.substring(0, 25)}...` : tpl.name}
                  </span>
                  <span className="template-list-size">{tpl.size}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-dashboard-state">
              <span>📁</span>
              <p>No templates uploaded yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="quick-actions">
        <h3>⚡ Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn primary" onClick={() => setActiveTab('leads')}>
            🔍 Find New Leads
          </button>
          <button className="action-btn secondary" onClick={() => setActiveTab('templates')}>
            📝 Edit Templates
          </button>
          <button className="action-btn accent">📊 Export Report</button>
        </div>
      </div>

      <div className="performance-tips">
        <h3>💡 Tips for Success</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">🎯</span>
            <h4>Focus on Quality</h4>
            <p>Personalize messages for each business type using specific templates</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">⏱️</span>
            <h4>Fast Response</h4>
            <p>Send pitches within 24 hours for best results</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📈</span>
            <h4>Track Performance</h4>
            <p>Monitor which templates get the most responses</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">💼</span>
            <h4>Build Portfolio</h4>
            <p>Keep adding successful website templates</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [city, setCity] = useState("")
  const [category, setCategory] = useState("")
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [toast, setToast] = useState({ show: false, message: "" })
  const [activeTab, setActiveTab] = useState("leads")
  const [templates, setTemplates] = useState(defaultTemplates)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [uploadedTemplates, setUploadedTemplates] = useState([])
  const [templateAssignments, setTemplateAssignments] = useState({})
  const [isProcessingZip, setIsProcessingZip] = useState(false)

  const totalLeads = leads.length
  const pitchedLeads = leads.filter(l => l.pitched).length
  const newLeads = leads.filter(l => !l.pitched).length

  const showToast = (message) => {
    setToast({ show: true, message })
    setTimeout(() => setToast({ show: false, message: "" }), 3000)
  }

  const handleSearch = async () => {
    if (!city || !category) return
    setLoading(true)
    setSearched(true)
    await new Promise(resolve => setTimeout(resolve, 1800))
    const filtered = mockLeads.filter(l => l.category === category && !l.pitched).slice(0, 4)
    setLeads(filtered)
    setLoading(false)
    showToast(filtered.length === 0 ? "No new leads found" : `Found ${filtered.length} new lead${filtered.length > 1 ? 's' : ''}!`)
  }

  const handleWhatsAppClick = async (lead) => {
    const template = templates[lead.category] || defaultTemplates[lead.category]
    const assignedTemplate = uploadedTemplates[templateAssignments[lead.category]]
    const demoInfo = assignedTemplate ? `using ${assignedTemplate.name}` : '[demo link]'
    const message = template.replace(/{name}/g, "Abir").replace(/{biz_name}/g, lead.name).replace(/{demo_link}/g, demoInfo)
    window.open(`https://wa.me/${lead.phone}?text=${encodeURIComponent(message)}`, '_blank')
    setTimeout(() => setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, pitched: true } : l)), 500)
    showToast("Lead saved! WhatsApp message opened")
  }

  const detectCategoriesFromPath = (filePath) => {
    const lowerPath = filePath.toLowerCase()
    const detected = []
    if (lowerPath.includes('salon') || lowerPath.includes('beauty')) detected.push('Salon')
    if (lowerPath.includes('cafe') || lowerPath.includes('coffee') || lowerPath.includes('restaurant')) detected.push('Cafe')
    if (lowerPath.includes('gym') || lowerPath.includes('fitness') || lowerPath.includes('sport')) detected.push('Gym')
    if (lowerPath.includes('interior') || lowerPath.includes('design') || lowerPath.includes('architect')) detected.push('Interior Designer')
    if (lowerPath.includes('photo') || lowerPath.includes('portfolio') || lowerPath.includes('camera')) detected.push('Photographer')
    return detected.length > 0 ? detected : [...categories]
  }

  const processFiles = (files) => {
    const newTemplates = Array.from(files).filter(f => f.name.endsWith('.html') || f.name.endsWith('.css') || f.name.endsWith('.js') || f.name.endsWith('.json') || f.name.endsWith('.zip')).map(file => {
      if (file.name.endsWith('.zip')) {
        return { name: file.name, size: formatFileSize(file.size), file: file, isZip: true, categories: [...categories], type: 'zip' }
      }
      return { name: file.name, size: formatFileSize(file.size), file: file, categories: detectCategoriesFromPath(file.name), type: file.name.split('.').pop() }
    })
    setUploadedTemplates(prev => [...prev, ...newTemplates])
    showToast(`Uploaded ${newTemplates.length} file${newTemplates.length > 1 ? 's' : ''}`)
  }

  const processZipFile = async (zipFile) => {
    setIsProcessingZip(true)
    try {
      const zip = await JSZip.loadAsync(zipFile)
      const htmlFiles = []
      zip.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir && (relativePath.endsWith('.html') || relativePath.endsWith('.css') || relativePath.endsWith('.js'))) {
          htmlFiles.push({ path: relativePath, entry: zipEntry })
        }
      })
      if (htmlFiles.length === 0) { showToast("No HTML/CSS/JS files found in ZIP"); setIsProcessingZip(false); return }
      const extractedTemplates = await Promise.all(htmlFiles.slice(0, 10).map(async (item) => {
        const content = await item.entry.async('string')
        const detectedCategories = detectCategoriesFromPath(item.path)
        return { name: `${zipFile.name}/${item.path}`.substring(0, 50), size: `${content.length} chars`, content, categories: detectedCategories, type: 'extracted', path: item.path, file: zipFile }
      }))
      setUploadedTemplates(prev => [...prev, { name: zipFile.name, size: formatFileSize(zipFile.size), file: zipFile, categories: [...categories], type: 'zip', extractedTemplates, isZip: true }])
      showToast(`Extracted ${extractedTemplates.length} templates from ${zipFile.name}`)
    } catch (err) {
      console.error('ZIP error:', err)
      showToast("Error extracting ZIP file")
    }
    setIsProcessingZip(false)
  }

  const handleFileDrop = (files) => {
    const zipFiles = Array.from(files).filter(f => f.name.endsWith('.zip'))
    const regularFiles = Array.from(files).filter(f => !f.name.endsWith('.zip') && (f.name.endsWith('.html') || f.name.endsWith('.css') || f.name.endsWith('.js') || f.name.endsWith('.json')))
    if (regularFiles.length > 0) processFiles(regularFiles)
    if (zipFiles.length > 0) zipFiles.forEach(zip => processZipFile(zip))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024, sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const removeTemplate = (index) => {
    setUploadedTemplates(prev => prev.filter((_, i) => i !== index))
    const newAssignments = { ...templateAssignments }
    Object.keys(newAssignments).forEach(cat => { if (newAssignments[cat] == index) delete newAssignments[cat] })
    setTemplateAssignments(newAssignments)
    showToast("Template removed")
  }

  const assignTemplateToCategory = (category, templateIndex) => {
    setTemplateAssignments(prev => ({ ...prev, [category]: templateIndex || undefined }))
    showToast(`Assigned to ${category}`)
  }

  const handleSaveTemplate = (category, content) => {
    setTemplates(prev => ({ ...prev, [category]: content }))
    setIsTemplateModalOpen(false)
    setEditingTemplate(null)
    showToast("Template saved!")
  }

  const handleResetTemplate = (category) => {
    setTemplates(prev => ({ ...prev, [category]: defaultTemplates[category] }))
    showToast("Reset to default")
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="logo">Byters Lead Finder</h1>
          <p className="tagline">Find local businesses without websites. Pitch them instantly.</p>
        </header>

        <div className="tab-nav">
          <button className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')}>
            <span className="tab-icon">📊</span> Lead Finder
          </button>
          <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <span className="tab-icon">📈</span> Analytics
          </button>
          <button className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>
            <span className="tab-icon">📦</span> Templates
          </button>
        </div>

        {activeTab === 'leads' && (
          <>
            <section className="search-section">
              <div className="search-row">
                <select className="select-input" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="" disabled>Select city</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="select-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="" disabled>Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button className="search-btn" onClick={handleSearch} disabled={!city || !category || loading}>
                  {loading ? (<><span className="spinner"></span> Finding Leads...</>) : "Find Leads"}
                </button>
              </div>
            </section>

            {(searched || leads.length > 0) && (
              <section className="stats-section">
                <div className="stat-card"><span className="stat-value">{totalLeads}</span><span className="stat-label">leads found</span></div>
                <div className="stat-divider"></div>
                <div className="stat-card"><span className="stat-value">{pitchedLeads}</span><span className="stat-label">already pitched</span></div>
                <div className="stat-divider"></div>
                <div className="stat-card"><span className="stat-value accent">{newLeads}</span><span className="stat-label">new today</span></div>
              </section>
            )}

            <section className="results-section">
              {loading ? (
                <div className="skeleton-grid">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="skeleton-card">
                      <div className="skeleton-line short"></div>
                      <div className="skeleton-line medium"></div>
                      <div className="skeleton-line long"></div>
                      <div className="skeleton-line button"></div>
                    </div>
                  ))}
                </div>
              ) : leads.length > 0 ? (
                <div className="results-grid">
                  {leads.map(lead => (
                    <div key={lead.id} className="lead-card">
                      <div className="card-header">
                        <h3 className="lead-name">{lead.name}</h3>
                        <span className="lead-badge" data-category={lead.category}>{lead.category}</span>
                      </div>
                      <div className="card-body">
                        <div className="template-row">
                          <span className="template-label">Template:</span>
                          <span className="template-name">{lead.template}</span>
                        </div>
                        <div className="status-badge-row">
                          {lead.pitched ? (
                            <span className="status-badge pitched"><span className="status-dot"></span> Already pitched</span>
                          ) : (
                            <span className="status-badge new"><span className="status-dot new"></span> New lead</span>
                          )}
                        </div>
                      </div>
                      <div className="whatsapp-btn-container">
                        <button className={`whatsapp-btn ${lead.pitched ? 'disabled' : ''}`} onClick={() => !lead.pitched && handleWhatsAppClick(lead)} disabled={lead.pitched}>
                          <span className="whatsapp-icon">📲</span> {lead.pitched ? 'Already pitched' : 'Send on WhatsApp'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                searched && (
                  <div className="empty-state">
                    <div className="empty-icon">🚫</div>
                    <h3>No new leads found</h3>
                    <p>Try another category or city combination</p>
                  </div>
                )
              )}
              {!searched && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>Find Your First Lead</h3>
                  <p>Search a city and category to discover local businesses without websites</p>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'templates' && (
          <section className="templates-section">
            <div className="templates-header">
              <h2>Templates & Website Uploads</h2>
              <p className="templates-subtitle">Manage message templates and upload website demos (supports ZIP folders)</p>
            </div>

            <div className="website-templates-section">
              <div className="website-templates-header">
                <h3>📁 Demo Website Templates</h3>
                <p className="website-templates-subtitle">Upload individual files or ZIP folders with full project structure</p>
              </div>

              <div className="upload-zone">
                <div className="upload-area" onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over') }} onDragLeave={(e) => { e.currentTarget.classList.remove('drag-over') }} onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('drag-over'); handleFileDrop(e.dataTransfer.files); }}>
                  <input type="file" id="file-upload" multiple accept=".html,.css,.js,.json,.zip" onChange={(e) => handleFileSelect(e.target.files)} style={{display: 'none'}} />
                  <label htmlFor="file-upload" className="upload-label">
                    <div className="upload-icon">📁</div>
                    <div className="upload-text"><strong>Drag & Drop</strong> files or ZIP folders here<br /><span className="upload-hint">HTML, CSS, JS, JSON, ZIP supported</span></div>
                    <button type="button" className="upload-btn" onClick={() => document.getElementById('file-upload').click()}>Select Files</button>
                  </label>
                </div>
              </div>

              {isProcessingZip && <div className="processing-zip"><span className="spinner"></span>Extracting ZIP file... Please wait</div>}

              {uploadedTemplates.length > 0 && (
                <div className="uploaded-templates">
                  <h4>📦 Uploaded Templates ({uploadedTemplates.length})</h4>
                  <div className="template-files-grid">
                    {uploadedTemplates.map((tpl, index) => (
                      <div key={index} className="template-file-card">
                        <div className="template-file-icon">{tpl.isZip ? '📦' : tpl.name.endsWith('.html') && '🌐' || tpl.name.endsWith('.css') && '🎨' || tpl.name.endsWith('.js') && '⚙️' || tpl.name.endsWith('.json') && '📄' || '📁'}</div>
                        <div className="template-file-info">
                          <span className="template-file-name" title={tpl.fullName || tpl.name}>{tpl.name}</span>
                          <span className="template-file-size">{tpl.size}</span>
                          {tpl.isZip && tpl.extractedTemplates && <span className="extracted-count">{tpl.extractedTemplates.length} templates inside</span>}
                          <div className="template-file-tags">{tpl.categories.map(cat => <span key={cat} className="file-category-tag" data-category={cat}>{cat}</span>)}</div>
                        </div>
                        <button className="remove-file-btn" onClick={() => removeTemplate(index)} title="Remove">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadedTemplates.length > 0 && (
                <div className="template-categories-assign">
                  <h4>📌 Assign Templates to Categories</h4>
                  <div className="category-assignment-grid">
                    {categories.map(cat => (
                      <div key={cat} className="category-assignment">
                        <span className="assignment-label" data-category={cat}>{cat}</span>
                        <select value={templateAssignments[cat] || ''} onChange={(e) => assignTemplateToCategory(cat, e.target.value)} className="assignment-select">
                          <option value="">No template</option>
                          {uploadedTemplates.map((tpl, idx) => <option key={idx} value={idx}>{tpl.name.substring(0, 30)}{tpl.name.length > 30 ? '...' : ''}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="template-divider"></div>

            <div className="templates-grid">
              {categories.map(cat => (
                <div key={cat} className="template-card">
                  <div className="template-category-badge" data-category={cat}>{cat}</div>
                  <div className="template-preview"><p>{templates[cat] || defaultTemplates[cat]}</p></div>
                  <div className="template-variables">{templateVars.map(v => <span key={v} className="var-tag">{v}</span>)}</div>
                  <div className="template-actions">
                    <button className="edit-btn" onClick={() => { setEditingTemplate(cat); setIsTemplateModalOpen(true); }}>✏️ Edit</button>
                    <button className="reset-btn" onClick={() => handleResetTemplate(cat)}>↺ Reset</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="template-info-box">
              <h3>📋 Available Variables</h3>
              <div className="variables-grid">
                {templateVars.map(v => {
                  const labels = { '{name}': 'Business contact name', '{biz_name}': 'Business name', '{demo_link}': 'Demo website link' }
                  return <div key={v} className="variable-item"><code>{v}</code><span>{labels[v]}</span></div>
                })}
              </div>
              <p className="info-note">Variables auto-replace when sending. ZIP uploads extract HTML/CSS/JS from nested folders!</p>
            </div>
          </section>
        )}

        {activeTab === 'dashboard' && (
          <DashboardSection totalLeads={totalLeads} pitchedLeads={pitchedLeads} newLeads={newLeads} categories={categories} uploadedTemplates={uploadedTemplates} templateAssignments={templateAssignments} />
        )}
      </div>

      {isTemplateModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsTemplateModalOpen(false); setEditingTemplate(null); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Template - {editingTemplate}</h2>
              <button className="modal-close" onClick={() => { setIsTemplateModalOpen(false); setEditingTemplate(null); }}>✕</button>
            </div>
            <div className="modal-body">
              <textarea value={templates[editingTemplate] || ''} onChange={(e) => setTemplates(prev => ({ ...prev, [editingTemplate]: e.target.value }))} placeholder="Write your template message..." rows={6} />
              <div className="modal-variables"><p><strong>Available variables:</strong></p>{templateVars.map(v => <code key={v}>{v}</code>)}</div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => { setTemplates(prev => ({ ...prev, [editingTemplate]: defaultTemplates[editingTemplate] })) }}>Reset to Default</button>
              <button className="btn-primary" onClick={() => handleSaveTemplate(editingTemplate, templates[editingTemplate])}>Save Template</button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (<div className="toast"><span>✓</span>{toast.message}</div>)}
    </div>
  )
}
