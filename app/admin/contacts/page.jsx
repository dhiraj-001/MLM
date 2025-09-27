"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { adminService } from "@/services/api"
import { format } from "date-fns"
import { Search, RefreshCw, AlertCircle, Mail, Phone, MessageSquare } from "lucide-react"

export default function AdminContacts() {
  const { token } = useAuth()
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchContacts = async () => {
      if (!token) return
      
      setLoading(true)
      try {
        const contactsData = await adminService.getAllContacts(token)
        setContacts(contactsData)
        setFilteredContacts(contactsData)
      } catch (err) {
        console.error("Failed to fetch contacts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [token])

  useEffect(() => {
    if (searchTerm) {
      const filtered = contacts.filter(contact => 
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredContacts(filtered)
    } else {
      setFilteredContacts(contacts)
    }
  }, [searchTerm, contacts])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contact Form Submissions</h1>
        
        <div className="flex items-center gap-2">
          {loading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="rounded-md border border-border bg-background pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border border-border/40 bg-background shadow-sm overflow-hidden">
        {loading && contacts.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            <p>Loading contacts...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No contact submissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Subject</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <Mail className="mr-1 h-3 w-3 text-muted-foreground" />
                        {contact.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {contact.subject}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-start">
                        <MessageSquare className="mr-1 h-3 w-3 text-muted-foreground mt-1" />
                        <p className="line-clamp-2">{contact.message}</p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
