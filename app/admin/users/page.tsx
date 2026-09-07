import { UsersManager } from '@/components/admin/users-manager'
import { getUsers, refreshDatabaseSnapshot } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminUsersPage() {
  await refreshDatabaseSnapshot()
  const users = getUsers()

  return (
    <div className="space-y-6">
      <UsersManager initialUsers={users} />
    </div>
  )
}
