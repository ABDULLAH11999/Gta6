import { ContactMessagesManager } from '@/components/admin/contact-messages-manager'
import { getContactMessages, refreshDatabaseSnapshot } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminContactUsPage() {
  await refreshDatabaseSnapshot()
  const contactMessages = getContactMessages()

  return (
    <div className="space-y-6">
      <ContactMessagesManager initialMessages={contactMessages} />
    </div>
  )
}
