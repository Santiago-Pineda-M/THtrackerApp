import { Project } from 'ts-morph'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ========== CONFIGURACIÓN ==========
const OPENAPI_TYPES_FILE = path.resolve(
  __dirname,
  '../src/Domain/api/types/api.d.ts'
)
const OUTPUT_DIR = path.resolve(__dirname, '../src/Domain/api')

// ===================================

if (!fs.existsSync(OPENAPI_TYPES_FILE)) {
  console.error(`❌ No se encuentra: ${OPENAPI_TYPES_FILE}`)
  process.exit(1)
}

const project = new Project()
const sourceFile = project.addSourceFileAtPath(OPENAPI_TYPES_FILE)

// Obtener la interfaz 'components'
const componentsInterface = sourceFile.getInterface('components')
if (!componentsInterface) {
  console.error('❌ No se encontró la interfaz "components"')
  process.exit(1)
}

// Obtener la propiedad 'schemas'
const schemasProperty = componentsInterface.getProperty('schemas')
if (!schemasProperty) {
  console.error('❌ No se encontró la propiedad "schemas"')
  process.exit(1)
}

// Obtener el tipo de la propiedad 'schemas'
const schemasType = schemasProperty.getType()
const schemasProperties = schemasType.getProperties()

console.log(`📄 Encontrados ${schemasProperties.length} schemas`)

// Mapear nombre del schema a su texto
const schemasMap = new Map<string, string>()
for (const prop of schemasProperties) {
  const name = prop.getName()
  const declarations = prop.getDeclarations()
  if (declarations.length > 0) {
    const text = declarations[0].getText()
    schemasMap.set(name, text)
  }
}

console.log('Primeros 10 schemas:', Array.from(schemasMap.keys()).slice(0, 10))

// Función para inferir tag - SIN casos especiales
function inferTag(schemaName: string): string {
  // Eliminar sufijos comunes
  let tag = schemaName
    .replace(/Command$/, '')
    .replace(/Request$/, '')
    .replace(/Response$/, '')
    .replace(/PaginatedResponse$/, '')
    .replace(/DTO$/, '')
    .replace(/Info$/, '')
    .replace(/Detail$/, '')
    .replace(/Item$/, '')

  // Si después de eliminar sufijos queda vacío, usar el nombre original
  if (!tag || tag.length === 0) {
    tag = schemaName
  }

  return tag
}

// Clasificar por tag y tipo
const tagMap = new Map<
  string,
  { requests: Set<string>; responses: Set<string> }
>()

for (const [name] of schemasMap) {
  const tag = inferTag(name)
  const isRequest = name.endsWith('Command') || name.endsWith('Request')
  const isResponse = name.endsWith('Response') || name.includes('Paginated')

  if (!tagMap.has(tag)) {
    tagMap.set(tag, { requests: new Set(), responses: new Set() })
  }
  const entry = tagMap.get(tag)!

  if (isRequest) {
    entry.requests.add(name)
  } else if (isResponse) {
    entry.responses.add(name)
  } else {
    // Por defecto, va a responses
    entry.responses.add(name)
  }
}

console.log('Tags encontrados:', Array.from(tagMap.keys()))

// Limpiar carpetas antiguas (solo las que vamos a regenerar)
for (const tag of tagMap.keys()) {
  const tagDir = path.join(OUTPUT_DIR, tag)
  if (fs.existsSync(tagDir)) {
    fs.rmSync(tagDir, { recursive: true, force: true })
    console.log(`🗑️ Limpiando: ${tag}`)
  }
}

// Generar archivos para cada tag
for (const [tag, { requests, responses }] of tagMap.entries()) {
  const tagDir = path.join(OUTPUT_DIR, tag)
  fs.mkdirSync(tagDir, { recursive: true })

  // Generar I{Tag}Requests.ts
  if (requests.size > 0) {
    let content = ''
    for (const schemaName of requests) {
      const schemaText = schemasMap.get(schemaName)
      if (schemaText) {
        // Convertir de "Nombre: { ... }" a "export interface Nombre { ... }"
        const interfaceText = schemaText.replace(
          new RegExp(`^\\s*${schemaName}\\s*:\\s*`),
          `export interface ${schemaName} `
        )
        content += interfaceText + '\n\n'
      }
    }
    const outputFile = path.join(tagDir, `I${tag}Requests.ts`)
    fs.writeFileSync(outputFile, content.trim())
    console.log(`✅ Generado ${outputFile}`)
  }

  // Generar I{Tag}Responses.ts
  if (responses.size > 0) {
    let content = ''
    for (const schemaName of responses) {
      const schemaText = schemasMap.get(schemaName)
      if (schemaText) {
        const interfaceText = schemaText.replace(
          new RegExp(`^\\s*${schemaName}\\s*:\\s*`),
          `export interface ${schemaName} `
        )
        content += interfaceText + '\n\n'
      }
    }
    const outputFile = path.join(tagDir, `I${tag}Responses.ts`)
    fs.writeFileSync(outputFile, content.trim())
    console.log(`✅ Generado ${outputFile}`)
  }

  // Generar index.ts
  const exports = []
  if (requests.size > 0) exports.push(`export * from './I${tag}Requests';`)
  if (responses.size > 0) exports.push(`export * from './I${tag}Responses';`)
  if (exports.length > 0) {
    fs.writeFileSync(path.join(tagDir, 'index.ts'), exports.join('\n'))
  }
}

console.log('\n✅ Generación completada')
