import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let current = ''
  let inQuotes = false
  let row: string[] = []

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') {
        current += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        row.push(current.trim())
        current = ''
      } else if (char === '\n' || (char === '\r' && next === '\n')) {
        row.push(current.trim())
        current = ''
        if (row.some(cell => cell !== '')) {
          rows.push(row)
        }
        row = []
        if (char === '\r') i++
      } else {
        current += char
      }
    }
  }
  row.push(current.trim())
  if (row.some(cell => cell !== '')) {
    rows.push(row)
  }

  return rows
}

interface ParsedRow {
  name: string
  slug: string
  description: string | null
  price: number
  salePrice: number | null
  stockQty: number
  categoryName: string | null
  status: string
  imageUrl: string | null
  productType: string
  variationSize: string | null
  variationColor: string | null
  variationSku: string | null
  rowNum: number
}

function parseRow(row: string[], idx: Record<string, number>, rowNum: number): ParsedRow {
  const name = row[idx.name]?.trim() || ''
  const slug = row[idx.seo_slug]?.trim() || ''
  const price = idx.price !== -1 ? parseFloat(row[idx.price]) || 0 : 0
  const salePrice = idx.sale_price !== -1 && row[idx.sale_price]?.trim() ? parseFloat(row[idx.sale_price]) || null : null
  const stockQty = idx.stock_quantity !== -1 ? parseInt(row[idx.stock_quantity]) || 0 : 0
  const categoryName = idx.category !== -1 ? row[idx.category]?.trim()?.toLowerCase() || null : null
  const status = idx.status !== -1 && row[idx.status]?.trim()?.toLowerCase() === 'inactive' ? 'inactive' : 'active'
  const description = idx.description !== -1 ? row[idx.description]?.trim() || null : null
  const imageUrl = idx.image_url !== -1 ? row[idx.image_url]?.trim() || null : null
  const productType = idx.product_type !== -1 ? row[idx.product_type]?.trim()?.toLowerCase() || 'simple' : 'simple'
  const variationSize = idx.variation_size !== -1 ? row[idx.variation_size]?.trim() || null : null
  const variationColor = idx.variation_color !== -1 ? row[idx.variation_color]?.trim() || null : null
  const variationSku = idx.variation_sku !== -1 ? row[idx.variation_sku]?.trim() || null : null

  return { name, slug, description, price, salePrice, stockQty, categoryName, status, imageUrl, productType, variationSize, variationColor, variationSku, rowNum }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const { spreadsheetId, sheetName = 'Sheet1' } = await req.json()

    if (!spreadsheetId) {
      throw new Error('spreadsheetId is required')
    }

    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`

    const sheetsRes = await fetch(url)
    if (!sheetsRes.ok) {
      const errText = await sheetsRes.text()
      throw new Error(`Failed to fetch sheet (${sheetsRes.status}). Make sure the sheet is shared as "Anyone with the link can view". Error: ${errText.substring(0, 200)}`)
    }

    const csvText = await sheetsRes.text()
    const allRows = parseCSV(csvText)

    if (allRows.length < 2) {
      return new Response(JSON.stringify({ success: true, message: 'No data rows found', added: 0, updated: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const headers = allRows[0].map(h => h.toLowerCase().trim())
    const dataRows = allRows.slice(1)

    const idx: Record<string, number> = {
      name: headers.indexOf('name'),
      description: headers.indexOf('description'),
      price: headers.indexOf('price'),
      sale_price: headers.indexOf('sale_price'),
      stock_quantity: headers.indexOf('stock_quantity'),
      category: headers.indexOf('category'),
      status: headers.indexOf('status'),
      seo_slug: headers.indexOf('seo_slug'),
      image_url: headers.indexOf('image_url'),
      product_type: headers.indexOf('product_type'),
      variation_size: headers.indexOf('variation_size'),
      variation_color: headers.indexOf('variation_color'),
      variation_sku: headers.indexOf('variation_sku'),
    }

    if (idx.name === -1) throw new Error('Sheet must have a "name" column. Found: ' + headers.join(', '))
    if (idx.seo_slug === -1) throw new Error('Sheet must have a "seo_slug" column. Found: ' + headers.join(', '))

    const { data: existingProducts } = await supabase
      .from('products')
      .select('id, seo_slug')

    const existingSlugMap = new Map<string, string>()
    existingProducts?.forEach(p => existingSlugMap.set(p.seo_slug, p.id))

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, slug')

    const categoryMap = new Map<string, string>()
    categories?.forEach(c => {
      categoryMap.set(c.name.toLowerCase(), c.id)
      categoryMap.set(c.slug.toLowerCase(), c.id)
    })

    // Group rows by seo_slug to handle variable products
    const slugGroups = new Map<string, ParsedRow[]>()
    for (let i = 0; i < dataRows.length; i++) {
      const parsed = parseRow(dataRows[i], idx, i + 2)
      if (!parsed.slug) continue
      if (!slugGroups.has(parsed.slug)) {
        slugGroups.set(parsed.slug, [])
      }
      slugGroups.get(parsed.slug)!.push(parsed)
    }

    let added = 0
    let updated = 0
    let skipped = 0
    let variationsAdded = 0
    const errors: string[] = []

    for (const [slug, rows] of slugGroups) {
      try {
        // First row with a name = parent product row
        const parentRow = rows.find(r => r.name) || rows[0]
        if (!parentRow.name) { skipped++; continue }

        // Determine product type: if explicitly set or if there are variation rows
        const hasVariationColumns = rows.some(r => r.variationSize || r.variationColor)
        const isVariable = parentRow.productType === 'variable' || (hasVariationColumns && rows.length > 1)

        const categoryId = parentRow.categoryName ? categoryMap.get(parentRow.categoryName) || null : null

        const productData = {
          name: parentRow.name,
          seo_slug: slug,
          description: parentRow.description,
          price: parentRow.price,
          sale_price: parentRow.salePrice,
          stock_quantity: parentRow.stockQty,
          category_id: categoryId,
          status: parentRow.status,
          product_type: isVariable ? 'variable' : 'simple',
        }

        let productId: string

        if (existingSlugMap.has(slug)) {
          // Update existing product
          productId = existingSlugMap.get(slug)!

          const { error: updateError } = await supabase
            .from('products')
            .update(productData)
            .eq('id', productId)

          if (updateError) {
            errors.push(`Row ${parentRow.rowNum}: ${updateError.message}`)
            continue
          }

          // Update main image
          if (parentRow.imageUrl) {
            const { data: existingImg } = await supabase
              .from('product_images')
              .select('id')
              .eq('product_id', productId)
              .eq('is_main', true)
              .maybeSingle()

            if (existingImg) {
              await supabase.from('product_images').update({ image_url: parentRow.imageUrl }).eq('id', existingImg.id)
            } else {
              await supabase.from('product_images').insert({ product_id: productId, image_url: parentRow.imageUrl, is_main: true, sort_order: 0 })
            }
          }

          // If variable, delete old variations and re-insert
          if (isVariable) {
            await supabase.from('product_variations').delete().eq('product_id', productId)
          }

          updated++
        } else {
          // Insert new product
          const { data: newProduct, error: insertError } = await supabase
            .from('products')
            .insert(productData)
            .select('id')
            .single()

          if (insertError) {
            errors.push(`Row ${parentRow.rowNum}: ${insertError.message}`)
            continue
          }

          productId = newProduct.id

          if (parentRow.imageUrl) {
            await supabase.from('product_images').insert({ product_id: productId, image_url: parentRow.imageUrl, is_main: true, sort_order: 0 })
          }

          existingSlugMap.set(slug, productId)
          added++
        }

        // Insert variations for variable products
        if (isVariable) {
          // Variation rows = rows that have variation attributes (size/color)
          const variationRows = rows.filter(r => r.variationSize || r.variationColor)

          for (const vRow of variationRows) {
            const attributes: Record<string, string> = {}
            if (vRow.variationSize) attributes.size = vRow.variationSize
            if (vRow.variationColor) attributes.color = vRow.variationColor

            const { error: vError } = await supabase.from('product_variations').insert({
              product_id: productId,
              attributes,
              price: vRow.price || parentRow.price,
              sale_price: vRow.salePrice,
              stock_quantity: vRow.stockQty,
              sku: vRow.variationSku,
              image_url: vRow.imageUrl,
            })

            if (vError) {
              errors.push(`Row ${vRow.rowNum} variation: ${vError.message}`)
            } else {
              variationsAdded++
            }
          }
        }
      } catch (rowErr) {
        errors.push(`Slug "${slug}": ${String(rowErr)}`)
      }
    }

    return new Response(JSON.stringify({
      success: true,
      added,
      updated,
      skipped,
      variations_added: variationsAdded,
      total: dataRows.length,
      errors: errors.length > 0 ? errors : undefined,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Sync error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
