import fs from 'node:fs'
import path from 'node:path'

const distDir = path.resolve('dist/client')
if (fs.existsSync(distDir)) {
  const indexHtml = path.join(distDir, 'index.html')
  const notFoundHtml = path.join(distDir, '404.html')
  if (fs.existsSync(indexHtml)) {
    fs.copyFileSync(indexHtml, notFoundHtml)
    console.log('✓ Created 404.html for GitHub Pages SPA routing fallback')
  }

  // Ensure .nojekyll exists so GitHub Pages serves all assets directly
  const noJekyll = path.join(distDir, '.nojekyll')
  fs.writeFileSync(noJekyll, '')
  console.log('✓ Created .nojekyll for GitHub Pages asset resolution')
}
