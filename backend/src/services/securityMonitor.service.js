// Advanced Security Monitoring
// ============================

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

class SecurityMonitor {
  constructor() {
    this.alerts = []
    this.violations = []
    this.threats = new Map()
  }
  
  // Log security event
  logEvent(event) {
    const logEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...event
    }
    
    console.log('[SECURITY]', JSON.stringify(logEntry))
    
    // Store in memory (in production, use database)
    this.alerts.push(logEntry)
    
    // Keep only last 1000 alerts
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000)
    }
    
    // Check for patterns
    this.analyzePattern(logEntry)
    
    return logEntry
  }
  
  // Analyze patterns
  analyzePattern(event) {
    const key = `${event.type}:${event.ip}`
    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute
    
    // Get recent events of same type from same IP
    const recent = this.alerts.filter(
      e => e.type === event.type && 
           e.ip === event.ip && 
           (now - new Date(e.timestamp).getTime()) < windowMs
    )
    
    if (recent.length >= 5) {
      this.triggerAlert({
        type: 'PATTERN_DETECTED',
        severity: 'high',
        message: `Multiple ${event.type} from ${event.ip}`,
        ip: event.ip,
        count: recent.length,
        details: event
      })
    }
  }
  
  // Trigger alert
  triggerAlert(alert) {
    console.error('[SECURITY ALERT]', JSON.stringify(alert))
    this.violations.push({
      ...alert,
      timestamp: new Date().toISOString()
    })
    
    // Take action based on severity
    if (alert.severity === 'critical') {
      this.blockIP(alert.ip)
    }
  }
  
  // Block IP
  blockIP(ip) {
    const blockedUntil = Date.now() + 60 * 60 * 1000 // 1 hour
    this.threats.set(ip, { blockedUntil, reason: 'automatic' })
    console.log(`[BLOCKED] IP: ${ip} for 1 hour`)
  }
  
  // Check if IP is blocked
  isIPBlocked(ip) {
    const threat = this.threats.get(ip)
    if (!threat) return false
    
    if (threat.blockedUntil < Date.now()) {
      this.threats.delete(ip)
      return false
    }
    
    return true
  }
  
  // Get security stats
  getStats() {
    const now = Date.now()
    const last24h = this.alerts.filter(
      e => (now - new Date(e.timestamp).getTime()) < 24 * 60 * 60 * 1000
    )
    
    return {
      totalAlerts: this.alerts.length,
      last24Hours: last24h.length,
      criticalViolations: this.violations.filter(v => v.severity === 'critical').length,
      blockedIPs: this.threats.size
    }
  }
  
  // Get recent alerts
  getAlerts(limit = 50) {
    return this.alerts.slice(-limit)
  }
}

module.exports = new SecurityMonitor()
