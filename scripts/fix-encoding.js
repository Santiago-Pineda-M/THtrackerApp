import fs from 'node:fs'
import path from 'node:path'

// Configuración: archivos a buscar
const targetDir = './src'
const extensions = ['.js', '.jsx', '.ts', '.tsx']

const map = {
  'Ã¡': 'á',
  'Ã©': 'é',
  'Ã­': 'í',
  'Ã³': 'ó',
  Ãº: 'ú',
  'Ã±': 'ñ',
  'Ã‰': 'É',
  'Ã‘': 'Ñ',
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath)
    } else if (extensions.includes(path.extname(fullPath))) {
      let content = fs.readFileSync(fullPath, 'utf8')
      let changed = false

      for (const [corrupt, fixed] of Object.entries(map)) {
        if (content.includes(corrupt)) {
          content = content.split(corrupt).join(fixed)
          changed = true
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8')
        console.log(`Corregido: ${fullPath}`)
      }
    }
  })
}

walkDir(targetDir)
console.log('Proceso terminado.')
