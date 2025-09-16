"use client"

import { useState, useEffect } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { adminService, apiService } from '../../../services/api'

const AdminAccountPage = () => {
    const { token } = useAuth()
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [formData, setFormData] = useState({
        accountID: '',
        qrImg: ''
    })
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetchAccounts()
    }, [token])

    const fetchAccounts = async () => {
        try {
            const data = await adminService.getWithdrawalAccounts(token)
            console.log(`Fetched accounts:`, data)
            setAccounts(data || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const uploadToCloudinary = async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'interviewX') // Replace with your upload preset

        try {
            const response = await fetch(
                'https://api.cloudinary.com/v1_1/dsgmhrwkc/image/upload', // Replace YOUR_CLOUD_NAME
                {
                    method: 'POST',
                    body: formData,
                }
            )
            const data = await response.json()
            return data.secure_url
        } catch (err) {
            throw new Error('Failed to upload image')
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            setUploading(true)
            let qrImgUrl = formData.qrImg

            // If there's a new file selected, upload it
            if (formData.qrImg instanceof File) {
                qrImgUrl = await uploadToCloudinary(formData.qrImg)
            }

            await adminService.updateWithdrawalAccount(
                selectedAccount._id,
                { ...formData, qrImg: qrImgUrl },
                token
            )
            fetchAccounts()
            setSelectedAccount(null)
            setFormData({ accountID: '', qrImg: '' })
        } catch (err) {
            setError(err.message)
        } finally {
            setUploading(false)
        }
    }

    const handleEdit = (account) => {
        setSelectedAccount(account)
        setFormData({
            accountID: account.accountID,
            qrImg: account.qrImg
        })
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({
                ...prev,
                qrImg: file
            }))
        }
    }

    if (loading) return <div className="p-8">Loading...</div>
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-6">
                    <Link href="/admin" className="mr-4 p-2 hover:bg-muted rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold">Manage Withdrawal Accounts</h1>
                </div>

                {/* Edit Form */}
                {selectedAccount && (
                    <div className="mb-8 p-6 bg-background border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Edit Account</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Account ID</label>
                                    <input
                                        type="text"
                                        value={formData.accountID}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            accountID: e.target.value
                                        }))}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">QR Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                    {formData.qrImg && !(formData.qrImg instanceof File) && (
                                        <img
                                            src={formData.qrImg}
                                            alt="Current QR"
                                            className="mt-2 w-24 h-24 object-contain"
                                        />
                                    )}
                                    {uploading && <p className="mt-2 text-sm text-gray-500">Uploading image...</p>}
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-primary text-white rounded-md"
                                    >
                                        Update Account
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedAccount(null)}
                                        className="px-4 py-2 bg-gray-200 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Accounts List */}
                <div className="bg-background border rounded-lg">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Withdrawal Accounts</h2>
                        <div className="grid gap-4">
                            {accounts.map((account) => (
                                <div
                                    key={account._id}
                                    className="p-4 border rounded-lg flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-medium">{account.accountID}</p>
                                        <img
                                            src={account.qrImg}
                                            alt="QR Code"
                                            className="w-24 h-24 mt-2 border rounded-md"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleEdit(account)}
                                        className="px-4 py-2 bg-primary text-white rounded-md"
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminAccountPage