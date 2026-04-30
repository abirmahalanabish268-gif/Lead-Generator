import { useState, useEffect } from 'react'
import './App.css'

// Mock data - replace with actual API calls later
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

const categoryColors = {
  "Salon": "#FF6B9D",
  "Cafe": "#4ECDC4",
  "Gym": "#FFD93D",
  "Interior Designer": "#6BCF7F",
  "Photographer": "#A855F7",
}

// Template variables for display
const templateVars = ["{name}", "{biz_name}", "{demo_link}"]

// Default templates
const defaultTemplates = {
  "Salon": "Hi {name}, I'm Abir from Byters. I made a free demo website for {biz_name}. I can make it live in 2 days for just ₹5,000. Interested? Here's a preview: {demo_link}",
  "Cafe": "Hi {name}, I'm from Byters. We create beautiful websites for cafes like yours. Let's get your business online in 48 hours for just ₹5,000. Preview: {demo_link}",
  "Gym": "Hi {name}, I'm from Byters. Your gym deserves an online presence! I'll build a demo website in 2 days for ₹5,000. Check it out: {demo_link}",
  "Interior Designer": "Hi {name}, I'm from Byters. Showcase your design portfolio online! I'll create a demo website in 2 days for ₹5,000. Preview: {demo_link}",
  "Photographer": "Hi {name}, I'm from Byters. Display your best shots online! I'll build a portfolio website in 2 days for ₹5,000. See demo: {demo_link}",
}

function App() {
  const [city, setCity] = useState("")
  const [category, setCategory] = useState("")
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [toast, setToast] = useState({ show: false, message: "" })
  const [activeTab, setActiveTab] = useState("leads") // leads | templates
  const [templates, setTemplates] = useState(defaultTemplates)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [uploadedTemplates, setUploadedTemplates] = useState([])
  const [templateAssignments, setTemplateAssignments] = useState({})
  const [previewFile, setPreviewFile] = useState(null)

  // Stats calculation
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
    
    // Simulate API call delay with staggered animation
    await new Promise(resolve => setTimeout(resolve, 1800))
    
    const filtered = mockLeads.filter(l => 
      l.category === category && !l.pitched
    ).slice(0, 4)
    
    setLeads(filtered)
    setLoading(false)
    
    if (filtered.length === 0) {
      showToast("No new leads found in this category")
    } else {
      showToast(`Found ${filtered.length} new lead${filtered.length > 1 ? 's' : ''}!`)
    }
  }

  const handleWhatsAppClick = async (lead) => {
    const template = templates[lead.category] || defaultTemplates[lead.category]
    const assignedTemplate = uploadedTemplates[templateAssignments[lead.category]]
    
    // Build demo link from assigned template
    const demoInfo = assignedTemplate 
      ? `using ${assignedTemplate.name}` 
      : '[demo link]'
    
    const message = template
      .replace(/{name}/g, "Abir")
      .replace(/{biz_name}/g, lead.name)
      .replace(/{demo_link}/g, demoInfo)
    
    const waLink = `https://wa.me/${lead.phone}?text=${encodeURIComponent(message)}`
    
    // Open WhatsApp link
    window.open(waLink, '_blank')
    
    // Mark as pitched in UI with delay
    setTimeout(() => {
      setLeads(prev => prev.map(l => 
        l.id === lead.id ? { ...l, pitched: true } : l
      ))
    }, 500)
    
    showToast(`Lead saved! WhatsApp message opened`)
  }

  const handleFileDrop = (files) => {
    processFiles(files)
  }

  const handleFileSelect = (files) => {
    processFiles(files)
  }

  const processFiles = (files) => {
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(f => 
      f.name.endsWith('.html') || 
      f.name.endsWith('.css') || 
      f.name.endsWith('.js') ||
      f.name.endsWith('.json')
    )

    const newTemplates = validFiles.map(file => {
      // Auto-assign categories based on filename
      let assignedCategories = []
      const lowerName = file.name.toLowerCase()
      
      if (lowerName.includes('salon') || lowerName.includes('beauty')) {
        assignedCategories.push('Salon')
      }
      if (lowerName.includes('cafe') || lowerName.includes('coffee') || lowerName.includes('restaurant')) {
        assignedCategories.push('Cafe')
      }
      if (lowerName.includes('gym') || lowerName.includes('fitness') || lowerName.includes('sport')) {
        assignedCategories.push('Gym')
      }
      if (lowerName.includes('interior') || lowerName.includes('design') || lowerName.includes('architect')) {
        assignedCategories.push('Interior Designer')
      }
      if (lowerName.includes('photo') || lowerName.includes('portfolio') || lowerName.includes('camera')) {
        assignedCategories.push('Photographer')
      }
      
      // If no auto-assignment, assign to all categories
      if (assignedCategories.length === 0) {
        assignedCategories = [...categories]
      }

      return {
        name: file.name,
        size: formatFileSize(file.size),
        file: file,
        categories: assignedCategories,
        type: file.name.split('.').pop()
      }
    })

    setUploadedTemplates(prev => [...prev, ...newTemplates])
    showToast(`Uploaded ${newTemplates.length} template file${newTemplates.length > 1 ? 's' : ''}`)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const removeTemplate = (index) => {
    setUploadedTemplates(prev => prev.filter((_, i) => i !== index))
    // Also remove any assignments for this template
    const newAssignments = { ...templateAssignments }
    Object.keys(newAssignments).forEach(cat => {
      if (newAssignments[cat] == index) {
        delete newAssignments[cat]
      }
    })
    setTemplateAssignments(newAssignments)
    showToast("Template removed")
  }

  const previewTemplate = (tpl) => {
    setPreviewFile(tpl)
    showToast(`Previewing ${tpl.name}`)
  }

  const assignTemplateToCategory = (category, templateIndex) => {
    setTemplateAssignments(prev => ({
      ...prev,
      [category]: templateIndex || undefined
    }))
    showToast(`Template assigned to ${category}`)
  }

  const handleSaveTemplate = (category, content) => {
    setTemplates(prev => ({
      ...prev,
      [category]: content
    }))
    setIsTemplateModalOpen(false)
    setEditingTemplate(null)
    showToast("Template saved successfully!")
  }

  const handleResetTemplate = (category) => {
    setTemplates(prev => ({
      ...prev,
      [category]: defaultTemplates[category]
    }))
    showToast("Template reset to default")
  }

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1 className="logo">Byters Lead Finder</h1>
          <p className="tagline">Find local businesses without websites. Pitch them instantly.</p>
        </header>

        {/* Tab Navigation */}
        <div className="tab-nav">
          <button 
            className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <span className="tab-icon">📊</span>
            Lead Finder
          </button>
          <button 
            className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <span className="tab-icon">📝</span>
            Manage Templates
          </button>
        </div>

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <>
            {/* Search Section */}
            <section className="search-section">
              <div className="search-row">
                <select 
                  className="select-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="" disabled>Select city</option>
                  {cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select 
                  className="select-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="" disabled>Select category</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <button 
                  className="search-btn"
                  onClick={handleSearch}
                  disabled={!city || !category || loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Finding Leads...
                    </>
                  ) : (
                    "Find Leads"
                  )}
                </button>
              </div>
            </section>

            {/* Stats Row */}
            {(searched || leads.length > 0) && (
              <section className="stats-section">
                <div className="stat-card">
                  <span className="stat-value">{totalLeads}</span>
                  <span className="stat-label">leads found</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-card">
                  <span className="stat-value">{pitchedLeads}</span>
                  <span className="stat-label">already pitched</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-card">
                  <span className="stat-value accent">{newLeads}</span>
                  <span className="stat-label">new today</span>
                </div>
              </section>
            )}

            {/* Results Grid */}
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
                        <span 
                          className="lead-badge" 
                          data-category={lead.category}
                        >
                          {lead.category}
                        </span>
                      </div>
                      
                      <div className="card-body">
                        <div className="template-row">
                          <span className="template-label">Template:</span>
                          <span className="template-name">{lead.template}</span>
                        </div>
                        
                        <div className="status-badge-row">
                          {lead.pitched ? (
                            <span className="status-badge pitched">
                              <span className="status-dot"></span>
                              Already pitched
                            </span>
                          ) : (
                            <span className="status-badge new">
                              <span className="status-dot new"></span>
                              New lead
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="whatsapp-btn-container">
                        <button
                          className={`whatsapp-btn ${lead.pitched ? 'disabled' : ''}`}
                          onClick={() => !lead.pitched && handleWhatsAppClick(lead)}
                          disabled={lead.pitched}
                        >
                          <span className="whatsapp-icon">📲</span>
                          {lead.pitched ? 'Already pitched' : 'Send on WhatsApp'}
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

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <section className="templates-section">
            <div className="templates-header">
              <h2>Message Templates</h2>
              <p className="templates-subtitle">Customize WhatsApp messages and demo templates for each business category</p>
            </div>

            {/* Website Template Upload Section */}
            <div className="website-templates-section">
              <div className="website-templates-header">
                <h3>🎨 Demo Website Templates</h3>
                <p className="website-templates-subtitle">Upload HTML/CSS/JS templates to use in your pitches. LLM will reference these when creating demo sites.</p>
              </div>

              <div className="upload-zone">
                <div className="upload-area" onDragOver={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add('drag-over')
                }} onDragLeave={(e) => {
                  e.currentTarget.classList.remove('drag-over')
                }} onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('drag-over')
                  handleFileDrop(e.dataTransfer.files)
                }}>
                  <input 
                    type="file" 
                    id="file-upload" 
                    multiple 
                    accept=".html,.css,.js,.json" 
                    onChange={(e) => handleFileSelect(e.target.files)}
                    style={{display: 'none'}}
                  />
                  <label htmlFor="file-upload" className="upload-label">
                    <div className="upload-icon">📁</div>
                    <div className="upload-text">
                      <strong>Drag & Drop</strong> your template files here<br />
                      <span className="upload-hint">HTML, CSS, JS, JSON files supported</span>
                    </div>
                    <button type="button" className="upload-btn" onClick={() => document.getElementById('file-upload').click()}>
                      Select Files
                    </button>
                  </label>
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedTemplates.length > 0 && (
                <div className="uploaded-templates">
                  <h4>📦 Uploaded Templates ({uploadedTemplates.length})</h4>
                  <div className="template-files-grid">
                    {uploadedTemplates.map((tpl, index) => (
                      <div key={index} className="template-file-card">
                        <div className="template-file-icon">
                          {tpl.name.endsWith('.html') && '🌐'}
                          {tpl.name.endsWith('.css') && '🎨'}
                          {tpl.name.endsWith('.js') && '⚙️'}
                          {tpl.name.endsWith('.json') && '📄'}
                        </div>
                        <div className="template-file-info">
                          <span className="template-file-name">{tpl.name}</span>
                          <span className="template-file-size">{tpl.size}</span>
                          <div className="template-file-tags">
                            {tpl.categories.map(cat => (
                              <span key={cat} className="file-category-tag" data-category={cat}>
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button 
                          className="remove-file-btn"
                          onClick={() => removeTemplate(index)}
                          title="Remove template"
                        >
                          ✕
                        </button>
                        <button 
                          className="preview-file-btn"
                          onClick={() => previewTemplate(tpl)}
                          title="Preview template"
                        >
                          👁️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Template Categories Assignment */}
              {uploadedTemplates.length > 0 && (
                <div className="template-categories-assign">
                  <h4>📌 Assign Templates to Categories</h4>
                  <div className="category-assignment-grid">
                    {categories.map(cat => (
                      <div key={cat} className="category-assignment">
                        <span className="assignment-label" data-category={cat}>{cat}</span>
                        <select 
                          value={templateAssignments[cat] || ''}
                          onChange={(e) => assignTemplateToCategory(cat, e.target.value)}
                          className="assignment-select"
                        >
                          <option value="">No template</option>
                          {uploadedTemplates.map((tpl, idx) => (
                            <option key={idx} value={idx}>{tpl.name}</option>
                          ))}
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
                  <div className="template-category-badge" data-category={cat}>
                    {cat}
                  </div>
                  <div className="template-preview">
                    <p>{templates[cat] || defaultTemplates[cat]}</p>
                  </div>
                  <div className="template-variables">
                    {templateVars.map(v => (
                      <span key={v} className="var-tag">{v}</span>
                    ))}
                  </div>
                  <div className="template-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => {
                        setEditingTemplate(cat)
                        setIsTemplateModalOpen(true)
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="reset-btn"
                      onClick={() => handleResetTemplate(cat)}
                    >
                      ↺ Reset
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Template Info Box */}
            <div className="template-info-box">
              <h3>📋 Available Variables</h3>
              <div className="variables-grid">
                {templateVars.map(v => {
                  const labels = {
                    '{name}': 'Business contact name',
                    '{biz_name}': 'Business name', 
                    '{demo_link}': 'Demo website link'
                  }
                  return (
                    <div key={v} className="variable-item">
                      <code>{v}</code>
                      <span>{labels[v]}</span>
                    </div>
                  )
                })}
              </div>
              <p className="info-note">Variables will be auto-replaced when sending messages</p>
            </div>
          </section>
        )}
      </div>

      {/* Template Modal */}
      {isTemplateModalOpen && (
        <div className="modal-overlay" onClick={() => {
          setIsTemplateModalOpen(false)
          setEditingTemplate(null)
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Template - {editingTemplate}</h2>
              <button className="modal-close" onClick={() => {
                setIsTemplateModalOpen(false)
                setEditingTemplate(null)
              }}>✕</button>
            </div>
            <div className="modal-body">
              <textarea
                value={templates[editingTemplate] || ''}
                onChange={(e) => setTemplates(prev => ({
                  ...prev,
                  [editingTemplate]: e.target.value
                }))}
                placeholder="Write your template message..."
                rows={6}
              />
              <div className="modal-variables">
                <p><strong>Available variables:</strong></p>
                {templateVars.map(v => <code key={v}>{v}</code>)}
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setTemplates(prev => ({
                    ...prev,
                    [editingTemplate]: defaultTemplates[editingTemplate]
                  }))
                }}
              >
                Reset to Default
              </button>
              <button 
                className="btn-primary"
                onClick={() => handleSaveTemplate(editingTemplate, templates[editingTemplate])}
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="toast">
          <span>✓</span>
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default App
