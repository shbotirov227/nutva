/*
  Merchant Center product sync route
  - Accepts POST body: { productId: string } OR { product: <GetOneProductType-like object> }
  - Fetches product (lang=ru) and transforms to Merchant API ProductInput
  - Inserts via productInputs:insert using service account OAuth
*/
import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';
import { apiClient } from '@/lib/apiClient';
import type { GetOneProductType } from '@/types/products/getOneProduct';

const SCOPE = 'https://www.googleapis.com/auth/content';
const ACCOUNT_ID = process.env.MC_ACCOUNT_ID; // e.g. "5622933076"
const DATASOURCE_NAME = process.env.MC_DATASOURCE_NAME; // e.g. "accounts/5622933076/dataSources/1234567890"

function envGuard() {
  if (!ACCOUNT_ID || !DATASOURCE_NAME) {
    throw new Error('Missing MC_ACCOUNT_ID or MC_DATASOURCE_NAME env vars');
  }
}

async function getAccessToken() {
  const auth = new GoogleAuth({ scopes: [SCOPE] });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  if (!token) throw new Error('Failed to acquire access token');
  return token;
}

// Simple GTIN mapping similar to page.tsx extras
function mapGtins(p: GetOneProductType): string[] | undefined {
  const n = (p.name || '').toLowerCase();
  if (n.includes('complex extra')) return ['4780143600027'];
  if (n.includes('complex') && !n.includes('extra')) return ['4780143600096'];
  if (n.includes('gelmin kids')) return ['4780143600089'];
  return undefined; // unspecified
}

interface ProductAttributes {
  title: string;
  description: string;
  link: string;
  imageLink: string;
  additionalImageLinks?: string[];
  condition: 'NEW';
  availability: 'IN_STOCK' | 'OUT_OF_STOCK';
  brand: string;
  googleProductCategory: string;
  productTypes?: string[];
  price: { value: string; currency: string };
  gtins?: string[];
  // Allow future optional extension fields with an index signature (more precise than any on root object)
  [k: string]: unknown;
}

interface ProductInput {
  contentLanguage: string; // 'ru'
  feedLabel: string; // 'UZ'
  name: string; // internal display name in Merchant Center UI
  offerId: string; // unique ID per product per account
  productAttributes: ProductAttributes;
}

function toProductInput(p: GetOneProductType): ProductInput {
  const link = `https://nutva.uz/product/${p.id}?lang=ru`;
  const primaryImage = (p.imageUrls?.[0] || '').replace('http://nutva.uz', 'https://nutva.uz');
  const additionalImageLinks = (p.imageUrls || []).slice(1).map(u => u.replace('http://nutva.uz', 'https://nutva.uz'));
  const gtins = mapGtins(p);

  return {
    contentLanguage: 'ru',
    feedLabel: 'UZ',
    name: p.metaTitle || p.name || 'Товар',
    offerId: String(p.id),
    productAttributes: {
      title: p.metaTitle || p.name || 'Товар',
      description: p.metaDescription || p.description || 'Описание товара',
      link,
      imageLink: primaryImage,
      additionalImageLinks,
      condition: 'NEW',
      availability: 'IN_STOCK', // continuous production
      brand: 'Nutva',
      googleProductCategory: 'Health & Beauty > Health Care > Vitamins & Supplements',
      productTypes: ['Supplements'],
      price: { value: String(p.price ?? 0), currency: 'UZS' },
      ...(gtins ? { gtins } : {}),
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    envGuard();
    const body = await req.json().catch(() => ({}));
    let product: GetOneProductType | null = null;

    if (body.product && typeof body.product === 'object') {
      product = body.product as GetOneProductType;
    } else if (body.productId) {
      // fetch from backend API in RU language as required by Merchant Center
      product = await apiClient.getOneProductById(body.productId, 'ru');
    } else {
      return NextResponse.json({ ok: false, error: 'Provide productId or product in body' }, { status: 400 });
    }

    if (!product) {
      return NextResponse.json({ ok: false, error: 'Product not found' }, { status: 404 });
    }

    const token = await getAccessToken();
    const productInput = toProductInput(product);

    const endpoint = `https://merchantapi.googleapis.com/products/v1/accounts/${ACCOUNT_ID}/productInputs:insert?dataSource=${encodeURIComponent(DATASOURCE_NAME!)}`;

    const mcRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productInput),
    });

    if (!mcRes.ok) {
      const errText = await mcRes.text();
      return NextResponse.json({ ok: false, error: 'Merchant API error', detail: errText }, { status: 502 });
    }

    const data = await mcRes.json();
    return NextResponse.json({ ok: true, data, sent: productInput });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic'; // ensure always server (avoid edge runtime)
