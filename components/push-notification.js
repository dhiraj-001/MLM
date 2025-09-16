"use client"

import { useEffect, useState } from 'react'

export function usePushNotifications() {
  const [permission, setPermission] = useState('default')
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    if (!('Notification' in window)) {
      setSupported(false)
      return
    }
    
    setPermission(Notification.permission)
  }, [])

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      return false
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  const sendNotification = (title, options = {}) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return null
    }

    try {
      const notification = new Notification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        ...options
      })
      
      // Auto-close after 5 seconds if not clicked
      setTimeout(() => notification.close(), 5000)
      
      return notification
    } catch (error) {
      console.error('Error sending notification:', error)
      return null
    }
  }

  return {
    permission,
    supported,
    requestPermission,
    sendNotification
  }
}
