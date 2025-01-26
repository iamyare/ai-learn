import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

const workerPath = path.join(rootDir, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.js')
const destPath = path.join(rootDir, 'public', 'pdf.worker.min.js')

// Asegurarse de que existe el directorio public
if (!fs.existsSync(path.join(rootDir, 'public'))) {
  fs.mkdirSync(path.join(rootDir, 'public'))
}

// Copiar el worker
fs.copyFileSync(workerPath, destPath)
console.log('PDF worker copiado exitosamente a public/pdf.worker.min.js')
