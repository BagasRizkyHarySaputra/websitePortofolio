// Generates the writeup reader HTML from the source markdown in ./writeups.
//
// Why a build step instead of shipping a markdown parser? The writeups are
// long, image-heavy CTF notes. Pre-rendering them to a tiny static HTML string
// keeps the runtime bundle dependency-free (matching the "no runtime deps"
// ethos of this site) and lets us rewrite the HackMD image hosts to local
// assets so the screenshots always render.
//
// Outputs:
//   src/data/writeups/<slug>.html   pre-rendered article (TOC + body)
//   src/data/writeups.json          metadata for the index cards
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const outDir = join(root, 'src', 'data', 'writeups')

const NOTES = [
  {
    slug: 'shellcoding',
    file: 'writeups/shellcoding.md',
    title: 'Shellcoding',
    blurb: 'Hand-rolling shellcode around an fgets blacklist — sysphone, execute, backdoor_anonymous, brainrot & pwnable.tw/start.',
    tags: ['pwn', 'shellcode', 'bypass'],
    source: 'https://hackmd.io/@axLOw9-VSAqUknv1IORzog/B1qZyJ4-zl'
  },
  {
    slug: 'thm-pwn101',
    file: 'writeups/thm-pwn101.md',
    title: 'TryHackMe — PWN 101',
    blurb: 'Full walkthrough of the TryHackMe PWN 101 room: from stack overflows to ret2win, format strings and integer bugs.',
    tags: ['pwn', 'tryhackme', 'rop'],
    source: 'https://hackmd.io/@axLOw9-VSAqUknv1IORzog/SyHMYv0gGe'
  },
  {
    slug: 'acectf2025',
    file: 'writeups/acectf2025.md',
    title: 'ACECTF 2025',
    blurb: 'ACECTF 2025 binary exploitation set — from_start and friends, dissected step by step.',
    tags: ['pwn', 'ctf'],
    source: 'https://hackmd.io/@axLOw9-VSAqUknv1IORzog/rJ6Fl3dmGe'
  },
  {
    slug: 'lksn2026-pwn',
    file: 'writeups/lksn2026-pwn.md',
    title: 'LKSN 2026 — PWN',
    blurb: 'The LKSN 2026 pwn track: another1 & another2, GOT-overwrite arithmetic and canary/base leaks.',
    tags: ['pwn', 'lksn', 'got'],
    source: 'https://hackmd.io/@axLOw9-VSAqUknv1IORzog/SkOyFJIIfe'
  }
]

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const stripTags = (html) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim()

// Drops the jina/HackMD artifacts so only the real body is rendered:
//   - the export frontmatter (--- ... ---)
//   - the document title, which is a *setext* H1 (`Title\n====`)
//   - the "Daftar Isi" heading and its `[TOC]` placeholder (we build a
//     real, anchor-linked ToC ourselves)
const cleanSource = (md) => {
  let out = md.replace(/^\uFEFF/, '')
  out = out.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '') // frontmatter
  out = out.replace(/^\s*#?[^\n]*\r?\n=+\s*\r?\n/, '') // leading setext H1
  out = out.replace(/^#{1,6}\s*Daftar Isi\s*\r?\n(\[TOC\]\s*\r?\n)?/im, '')
  out = out.replace(/^\s*\[TOC\]\s*$/im, '')
  return out.replace(/^\s*\n+/, '')
}

const rewriteImages = (html, slug) =>
  html.replace(/(<img[^>]*?src=")https:\/\/hackmd\.io\/_uploads\/([A-Za-z0-9_.-]+)(")/g, `$1/writeups/${slug}/$2$3`)

const addLazyImages = (html) => html.replace(/<img\s/g, '<img loading="lazy" decoding="async" ')

const buildToc = (headings) => {
  const root = { level: 0, children: [] }
  const stack = [root]
  for (const h of headings) {
    while (stack.length > 1 && stack[stack.length - 1].level >= h.level) stack.pop()
    const node = { ...h, children: [] }
    stack[stack.length - 1].children.push(node)
    stack.push(node)
  }

  const renderItems = (items) =>
    `<ul class="wu-toc-list">${items
      .map(
        (item) =>
          `<li class="wu-toc-item"><a class="wu-toc-link" href="#${item.id}">${stripTags(item.text) || 'Section'}</a>${
            item.children.length ? renderItems(item.children) : ''
          }</li>`
      )
      .join('')}</ul>`

  return `<nav class="wu-toc" aria-label="Daftar Isi">\n<p class="wu-toc-title">Daftar Isi</p>\n${renderItems(root.children)}\n</nav>`
}

const renderNote = (note) => {
  const md = cleanSource(readFileSync(resolve(root, note.file), 'utf8'))
  let html = marked.parse(md, { gfm: true, breaks: false })

  html = rewriteImages(html, note.slug)
  html = addLazyImages(html)

  const headings = []
  const used = new Set()
  html = html.replace(/<h([1-6])>([\s\S]*?)<\/h\1>/g, (match, depth, inner) => {
    const level = Number(depth)
    const text = stripTags(inner)
    let id = slugify(text) || 'section'
    let candidate = id
    let i = 2
    while (used.has(candidate)) candidate = `${id}-${i++}`
    used.add(candidate)
    headings.push({ level, text, id: candidate })
    return `<h${level} id="${candidate}">${inner}</h${level}>`
  })

  const toc = buildToc(headings)
  const challenges = headings.filter((h) => /^chall?ange/i.test(h.text)).length

  return { html: `${toc}\n<article class="wu-article">\n${html}\n</article>`, challenges }
}

const main = () => {
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

  const manifest = []
  for (const note of NOTES) {
    const { html, challenges } = renderNote(note)
    writeFileSync(join(outDir, `${note.slug}.html`), html, 'utf8')
    manifest.push({ ...note, challenges, html: `./writeups/${note.slug}.html` })
    console.log(`  ✓ ${note.slug.padEnd(14)} ${String(html.length).padStart(7)} bytes · ${challenges} challenges`)
  }

  writeFileSync(join(root, 'src', 'data', 'writeups.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8')
  console.log(`gen-writeups: wrote ${manifest.length} writeups + index metadata`)
}

main()
