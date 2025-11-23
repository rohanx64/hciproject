import { useState } from 'react'
import { BottomNav } from '../components/BottomNav'

interface MyAccountScreenProps {
    onNavigate?: (screen: string) => void
    onBack: () => void
    userName?: string
    userEmail?: string
    userGender?: string
    userBirthday?: string
    userPhone?: string
    userAvatar?: string
    hideBottomNav?: boolean
    onUpdateUser?: (updates: {
        name?: string
        email?: string
        gender?: string
        birthday?: string
        phone?: string
    }) => void
}

const accountFields = [
    { id: 'name', label: 'Name', type: 'text' as const },
    { id: 'email', label: 'Email', type: 'email' as const },
    { id: 'gender', label: 'Gender', type: 'select' as const, options: ['Male', 'Female', 'Other'] },
    { id: 'birthday', label: 'Birthday', type: 'date' as const },
    { id: 'phone', label: 'Phone number', type: 'tel' as const },
]

export function MyAccountScreen({
    onNavigate,
    onBack,
    userName = 'Rohan Riaz',
    userEmail = 'rohan@gmail.com',
    userGender = 'Male',
    userBirthday = 'May 8th 2002',
    userPhone = '+92 23183 3818',
    userAvatar,
    hideBottomNav = true,
    onUpdateUser,
}: MyAccountScreenProps) {
    const [editingField, setEditingField] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: userName,
        email: userEmail,
        gender: userGender,
        birthday: userBirthday,
        phone: userPhone,
    })

    const getFieldValue = (fieldId: string) => {
        switch (fieldId) {
            case 'name':
                return formData.name
            case 'email':
                return formData.email
            case 'gender':
                return formData.gender
            case 'birthday':
                return formData.birthday
            case 'phone':
                return formData.phone
            default:
                return ''
        }
    }

    const handleSave = (fieldId: string) => {
        const field = accountFields.find(f => f.id === fieldId)
        if (!field) return

        const updates: any = {}
        updates[fieldId] = formData[fieldId as keyof typeof formData]
        
        onUpdateUser?.(updates)
        setEditingField(null)
    }

    const handleCancel = () => {
        // Reset to original values
        setFormData({
            name: userName,
            email: userEmail,
            gender: userGender,
            birthday: userBirthday,
            phone: userPhone,
        })
        setEditingField(null)
    }

    const formatDateForInput = (dateStr: string) => {
        // Convert "May 8th 2002" to "2002-05-08" format
        const months: { [key: string]: string } = {
            'january': '01', 'february': '02', 'march': '03', 'april': '04',
            'may': '05', 'june': '06', 'july': '07', 'august': '08',
            'september': '09', 'october': '10', 'november': '11', 'december': '12'
        }
        const parts = dateStr.toLowerCase().split(' ')
        if (parts.length >= 3) {
            const month = months[parts[0]] || '05'
            const day = parts[1].replace(/\D/g, '').padStart(2, '0')
            const year = parts[2]
            return `${year}-${month}-${day}`
        }
        return ''
    }

    const formatDateFromInput = (dateStr: string) => {
        // Convert "2002-05-08" to "May 8th 2002" format
        const [year, month, day] = dateStr.split('-')
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December']
        const monthName = months[parseInt(month) - 1]
        const dayNum = parseInt(day)
        const suffix = dayNum === 1 ? 'st' : dayNum === 2 ? 'nd' : dayNum === 3 ? 'rd' : 'th'
        return `${monthName} ${dayNum}${suffix} ${year}`
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl relative">
            {/* Header */}
            <header className="bg-primary px-6 py-4 flex items-center gap-4 z-10 relative">
                <button
                    onClick={() => {
                        onNavigate?.('home')
                    }}
                    className="text-white hover:opacity-80 transition-opacity"
                    aria-label="Back to Home"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-white flex-1">My Account</h1>
                {userAvatar ? (
                    <img
                        src={userAvatar}
                        alt={formData.name}
                        className="size-10 rounded-full border-2 border-white"
                    />
                ) : (
                    <div className="size-10 rounded-full border-2 border-white bg-white/20 flex items-center justify-center">
                        <span className="text-lg text-white font-bold">{formData.name.charAt(0)}</span>
                    </div>
                )}
            </header>

            {/* Account Details */}
            <main className="flex-1 overflow-y-auto bg-white">
                <div className="py-4">
                    {accountFields.map((field) => {
                        const isEditing = editingField === field.id
                        const value = getFieldValue(field.id)

                        return (
                            <div key={field.id} className="border-b border-gray-100">
                                {isEditing ? (
                                    <div className="px-6 py-4 space-y-3">
                                        <label className="text-sm font-normal text-gray-500 block">{field.label}</label>
                                        {field.type === 'select' ? (
                                            <select
                                                value={formData[field.id as keyof typeof formData]}
                                                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-base"
                                                autoFocus
                                            >
                                                {field.options?.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        ) : field.type === 'date' ? (
                                            <input
                                                type="date"
                                                value={formatDateForInput(value)}
                                                onChange={(e) => {
                                                    const formatted = formatDateFromInput(e.target.value)
                                                    setFormData({ ...formData, [field.id]: formatted })
                                                }}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-base"
                                                autoFocus
                                            />
                                        ) : (
                                            <input
                                                type={field.type}
                                                value={formData[field.id as keyof typeof formData]}
                                                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-base"
                                                autoFocus
                                            />
                                        )}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleCancel}
                                                className="flex-1 py-2 rounded-xl border-2 border-gray-300 text-text-dark font-semibold hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleSave(field.id)}
                                                className="flex-1 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setEditingField(field.id)}
                                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-normal text-gray-500">{field.label}</span>
                                            <span className="text-base font-normal text-text-dark">{value}</span>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </main>

            {/* Bottom Navigation - Hidden when in sidebar screens */}
            {!hideBottomNav && (
                <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white max-w-full">
                    <BottomNav active="Ride" onNavigate={onNavigate} />
                </div>
            )}
        </div>
    )
}
