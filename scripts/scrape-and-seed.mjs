import fs from 'fs'
import path from 'path'
import { Pool } from 'pg'

const slugs = [
  'gta6-fashion-style-breakdown',
  'gta6-second-life-addiction',
  'gta6-pc-release-date',
  'rage9-vs-genie3-ai-future-gaming',
  'gta6-trailer-3-guide',
  'gta6-viral-trailer-moments',
  'gta6-soundtrack-live-concerts-monetization',
  'gta6-release-date-delay-rumors',
  'gta6-global-search-rankings-uk-leads-intensity',
  'gta6-creator-monetization-revolution',
  'gta6-revealed-websites-uncover-massive-features',
  'gta6-user-generated-content-revolution',
  'best-console-for-gta6-buying-guide',
  'gta6-vs-real-miami-comparison',
  'gta6-xbox-placeholder-preload',
  'gta6-secondary-characters-breakdown',
  'gta6-story-length-speculation',
  'best-gta6-content-creators',
  'jason-duval-character-breakdown',
  'official-gta6-downloads-guide',
  'gta6-gameplay-mechanics',
  'lucia-character-deep-dive',
  'vice-city-locations-revealed',
  'gta6-trailer-2-analysis',
  'gta6-gameplay-rumors',
  'gta6-trailer-1-breakdown'
]

const categories = [
  { id: 'cat-trailers', slug: 'trailers', name: 'Trailers', accent: 'from-fuchsia-500 to-violet-500', order: 1, icon: 'play' },
  { id: 'cat-gameplay', slug: 'gameplay', name: 'Gameplay', accent: 'from-sky-500 to-cyan-400', order: 2, icon: 'joystick' },
  { id: 'cat-characters', slug: 'characters', name: 'Characters', accent: 'from-rose-500 to-orange-400', order: 3, icon: 'users' },
  { id: 'cat-locations', slug: 'locations', name: 'Locations', accent: 'from-emerald-500 to-teal-400', order: 4, icon: 'map' },
  { id: 'cat-resources', slug: 'resources', name: 'Resources', accent: 'from-amber-400 to-orange-500', order: 5, icon: 'book-open' }
]

const rootDir = process.cwd()
const dataDir = path.join(rootDir, 'data')
const publicBlogImagesDir = path.join(rootDir, 'public', 'blog', 'images')
const publicImagesDir = path.join(rootDir, 'public', 'images')

fs.mkdirSync(dataDir, { recursive: true })
fs.mkdirSync(publicBlogImagesDir, { recursive: true })
fs.mkdirSync(publicImagesDir, { recursive: true })

async function downloadFile(url, filename) {
  const destPathBlog = path.join(publicBlogImagesDir, filename)
  const destPathGeneral = path.join(publicImagesDir, filename)
  
  // Skip if both exist
  if (fs.existsSync(destPathBlog) && fs.existsSync(destPathGeneral)) {
    return `/blog/images/${filename}`
  }

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`status ${res.status}`)
    const buffer = Buffer.from(await res.arrayBuffer())
    
    fs.writeFileSync(destPathBlog, buffer)
    fs.writeFileSync(destPathGeneral, buffer)
    
    console.log(`Downloaded: ${url} -> ${filename}`)
    return `/blog/images/${filename}`
  } catch (err) {
    console.error(`Failed to download ${url}:`, err.message)
    return url // fallback to original
  }
}

function cleanFilename(urlPath) {
  const parts = urlPath.split('/')
  const rawFilename = parts[parts.length - 1]
  // strip query parameters if any
  return rawFilename.split('?')[0]
}

async function scrapeBlog(slug) {
  const url = `https://gta6hype.com/blog/${slug}`
  console.log(`Scraping detail page: ${url}`)
  
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}, status: ${res.status}`)
  const html = await res.text()

  // Extract meta tags
  const title = html.match(/itemprop="headline"\s+content="([^"]+)"/)?.[1] || 
                html.match(/<title>([^<]+)<\/title>/)?.[1]?.replace(' - GTA VI HYPE', '') || 
                slug
  const excerpt = html.match(/itemprop="description"\s+content="([^"]+)"/)?.[1] || ""
  const author = html.match(/itemprop="author"\s+content="([^"]+)"/)?.[1] || "Ammo"
  const publishedAt = html.match(/itemprop="datePublished"\s+content="([^"]+)"/)?.[1] || new Date().toISOString()
  
  const categorySlug = html.match(/itemprop="articleSection"\s+content="([^"]+)"/)?.[1] || "trailers"
  const categoryObj = categories.find(c => c.slug === categorySlug) || categories[0]
  
  const keywordsStr = html.match(/itemprop="keywords"\s+content="([^"]+)"/)?.[1] || ""
  const tags = keywordsStr.split(',').map(t => t.trim()).filter(Boolean)

  // Hero Image
  let heroImageRaw = html.match(/property="og:image"\s+content="([^"]+)"/)?.[1] || ""
  if (!heroImageRaw) {
    // Try to find image in html
    const firstImg = html.match(/<img[^>]+src="([^"]+)"[^>]*>/i)?.[1] || ""
    heroImageRaw = firstImg
  }
  
  let heroImage = ""
  if (heroImageRaw) {
    const fullUrl = heroImageRaw.startsWith('http') ? heroImageRaw : `https://gta6hype.com${heroImageRaw}`
    const filename = cleanFilename(fullUrl)
    heroImage = await downloadFile(fullUrl, filename)
  }

  // Parse blocks from prose div
  const blocks = []
  const proseStartStr = 'class="prose prose-invert'
  const proseStartIndex = html.indexOf(proseStartStr)
  
  if (proseStartIndex !== -1) {
    const startTagEnd = html.indexOf('>', proseStartIndex)
    const articleContentStart = startTagEnd + 1
    const proseEndIndex = html.indexOf('<div class="mt-8 pt-6 border-t border-gray-800"', articleContentStart)
    
    if (proseEndIndex !== -1) {
      let bodyHtml = html.slice(articleContentStart, proseEndIndex).trim()
      bodyHtml = bodyHtml.replace(/<meta[^>]*>/g, '').replace(/<!--[^>]*-->/g, '').trim()

      const tagRegex = /<(p|h2|h3|h4|ul|ol|blockquote|iframe|figure)[^>]*>([\s\S]*?)<\/\1>/gi
      let match
      const elements = []
      while ((match = tagRegex.exec(bodyHtml)) !== null) {
        elements.push({
          tag: match[1].toLowerCase(),
          outer: match[0],
          inner: match[2].trim()
        })
      }

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i]
        
        if (el.tag === 'p') {
          const imgMatch = el.inner.match(/<img[^>]+src="([^"]+)"[^>]*>/i)
          if (imgMatch) {
            const rawSrc = imgMatch[1]
            const alt = el.inner.match(/alt="([^"]*)"/i)?.[1] || ""
            const fullImgUrl = rawSrc.startsWith('http') ? rawSrc : `https://gta6hype.com${rawSrc}`
            const filename = cleanFilename(fullImgUrl)
            const localSrc = await downloadFile(fullImgUrl, filename)
            
            let caption = ""
            const nextEl = elements[i + 1]
            if (nextEl && nextEl.tag === 'p' && nextEl.outer.includes('text-gray-500')) {
              caption = nextEl.inner.replace(/<[^>]+>/g, '').trim()
              i++
            }
            blocks.push({
              type: 'image',
              src: localSrc,
              alt,
              caption: caption || undefined
            })
          } else {
            const text = el.inner.replace(/<[^>]+>/g, '').trim()
            if (text) {
              blocks.push({
                type: 'paragraph',
                text
              })
            }
          }
        } else if (el.tag.startsWith('h')) {
          const level = parseInt(el.tag[1])
          const text = el.inner.replace(/<[^>]+>/g, '').trim()
          blocks.push({
            type: 'heading',
            level,
            text
          })
        } else if (el.tag === 'ul' || el.tag === 'ol') {
          const items = []
          const liRegex = /<li>([\s\S]*?)<\/li>/gi
          let liMatch
          while ((liMatch = liRegex.exec(el.inner)) !== null) {
            items.push(liMatch[1].replace(/<[^>]+>/g, '').trim())
          }
          blocks.push({
            type: 'list',
            items
          })
        } else if (el.tag === 'blockquote') {
          const text = el.inner.replace(/<[^>]+>/g, '').trim()
          blocks.push({
            type: 'quote',
            text
          })
        } else if (el.tag === 'iframe') {
          const src = el.outer.match(/src="([^"]+)"/i)?.[1] || ""
          const title = el.outer.match(/title="([^"]*)"/i)?.[1] || "Video"
          blocks.push({
            type: 'video',
            src,
            title
          })
        }
      }
    }
  }

  // Calculate read time
  const wordsCount = JSON.stringify(blocks).split(/\s+/).length
  const readTimeVal = Math.max(2, Math.ceil(wordsCount / 200))
  const readTime = `${readTimeVal} min read`

  const galleryImages = [heroImage].filter(Boolean)

  return {
    id: slug,
    slug,
    categoryId: categoryObj.id,
    categorySlug: categoryObj.slug,
    categoryName: categoryObj.name,
    title,
    excerpt,
    summary: excerpt,
    content: blocks,
    tags,
    heroImage,
    heroImageAlt: title,
    heroVideoUrl: undefined,
    galleryImages,
    author,
    status: 'published',
    featured: false,
    featuredOrder: 0,
    publishedAt,
    updatedAt: new Date().toISOString(),
    readTime,
    seoTitle: title,
    seoDescription: excerpt,
    canonicalPath: `/blog/${slug}`,
    metaTitle: title,
    metaDescription: excerpt,
    sourceLinks: [],
    videoLinks: [],
    imageLinks: [heroImage].filter(Boolean),
    games: [categoryObj.name],
    slotTime: new Date(publishedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
}

async function readEnvDatabaseUrl() {
  if (process.env.DATABASE_URL?.trim()) {
    return process.env.DATABASE_URL.trim()
  }

  const envPath = path.join(rootDir, '.env')
  if (!fs.existsSync(envPath)) return ''
  const raw = fs.readFileSync(envPath, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index === -1) continue
    const key = trimmed.slice(0, index).trim()
    const value = trimmed.slice(index + 1).trim()
    if (key === 'DATABASE_URL' && value) return value
  }
  return ''
}

async function main() {
  console.log('Starting scraping of gta6hype.com...')
  const posts = []
  
  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i]
    console.log(`\n[${i + 1}/${slugs.length}] Processing ${slug}...`)
    try {
      const post = await scrapeBlog(slug)
      posts.push(post)
    } catch (err) {
      console.error(`Failed to scrape ${slug}:`, err.message)
    }
  }

  // Set the first 5 posts as featured to populate the featured grid nicely
  for (let i = 0; i < Math.min(5, posts.length); i++) {
    posts[i].featured = true
    posts[i].featuredOrder = i + 1
  }

  console.log(`\nSuccessfully scraped ${posts.length} blog posts.`)

  // Write local JSON files
  fs.writeFileSync(path.join(dataDir, 'categories.json'), JSON.stringify(categories, null, 2), 'utf8')
  fs.writeFileSync(path.join(dataDir, 'post.json'), JSON.stringify(posts, null, 2), 'utf8')
  console.log('Wrote categories.json and post.json to data/ directory.')

  const settings = {
    title: 'GTA VI HYPE',
    description: 'The ultimate source for GTA 6 news, character analysis, gameplay insights, and exclusive updates from Vice City. Stay ahead with the latest Grand Theft Auto 6 information.',
    keywords: ['GTA 6 news', 'GTA 6 trailer breakdowns', 'Vice City analysis', 'Jason Duval', 'Lucia Caminos', 'GTA 6 release date', 'GTA 6 gameplay', 'GTA 6 locations', 'GTA 6 resources', 'GTA VI HYPE'],
    games: ['All News', 'Trailers', 'Gameplay', 'Characters', 'Locations', 'Resources'],
    scheduledSlots: [],
    canonicalUrl: 'https://gta6hype.com',
    ogImage: posts[0]?.heroImage || '/og-image.jpg',
    favicon: '/favicon.ico',
    launchDate: '2026-11-19T00:00:00.000Z',
    brandMark: 'GTA VI HYPE',
    brandTagline: 'The ultimate source for Grand Theft Auto 6 news, updates, character analysis, and gameplay insights.',
    headerLinks: [
      { label: 'Home', href: '/' },
      { label: 'Trailers', href: '/?category=Trailers' },
      { label: 'Gameplay', href: '/?category=Gameplay' },
      { label: 'Characters', href: '/?category=Characters' },
      { label: 'Locations', href: '/?category=Locations' },
      { label: 'Resources', href: '/?category=Resources' }
    ],
    footerLinks: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms-conditions' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Contact', href: '/contact' }
    ],
    socialLinks: [
      { label: 'Reddit', href: 'https://www.reddit.com/user/GTA6AMMO/' },
      { label: 'X', href: 'https://x.com/gta6hyped' }
    ],
    contactEmail: 'admin@gta6hype.com',
    smtpEnabled: true,
    otpRequired: true,
    smtpHost: 'smtp.resend.net',
    smtpPort: '587',
    smtpSender: 'noreply@gta6hype.com',
    adminReceivers: ['admin@gta6hype.com']
  }
  
  fs.writeFileSync(path.join(dataDir, 'settings.json'), JSON.stringify(settings, null, 2), 'utf8')
  console.log('Wrote settings.json to data/ directory.')

  const connectionString = await readEnvDatabaseUrl()
  if (!connectionString) {
    console.log('DATABASE_URL not found. Seeded local JSON files only.')
    return
  }

  console.log('Connecting to Neon Postgres to sync database records...')
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  })

  try {
    // Sync tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id text PRIMARY KEY,
        data jsonb NOT NULL
      );

      CREATE TABLE IF NOT EXISTS posts (
        id text PRIMARY KEY,
        data jsonb NOT NULL
      );

      CREATE TABLE IF NOT EXISTS site_settings (
        id text PRIMARY KEY,
        data jsonb NOT NULL
      );
    `)

    // Truncate tables first
    await pool.query('DELETE FROM categories')
    await pool.query('DELETE FROM posts')
    await pool.query('DELETE FROM site_settings')

    // Insert categories
    for (const cat of categories) {
      await pool.query('INSERT INTO categories (id, data) VALUES ($1, $2::jsonb)', [cat.id, JSON.stringify(cat)])
    }
    console.log(`Synchronized ${categories.length} categories to Postgres.`)

    // Insert posts
    for (const post of posts) {
      await pool.query('INSERT INTO posts (id, data) VALUES ($1, $2::jsonb)', [post.id, JSON.stringify(post)])
    }
    console.log(`Synchronized ${posts.length} posts to Postgres.`)

    // Insert settings
    await pool.query("INSERT INTO site_settings (id, data) VALUES ('default', $1::jsonb)", [JSON.stringify(settings)])
    console.log('Synchronized site settings to Postgres.')
    
    console.log('\nSUCCESS: Database seeding is complete!')
  } catch (err) {
    console.error('Postgres syncing failed:', err.message)
  } finally {
    await pool.end()
  }
}

main().catch(err => {
  console.error('Fatal scraping error:', err)
  process.exitCode = 1
})
