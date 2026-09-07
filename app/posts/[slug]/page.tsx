import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function LegacyPostRedirect({ params }: Readonly<{ params: { slug: string } }>) {
  redirect(`/blog/${params.slug}`)
}
