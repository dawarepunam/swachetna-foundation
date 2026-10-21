import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products } from "../../../data/products";
import ProductDetail from "../../../components/products/ProductDetail/ProductDetail";

export function generateStaticParams(){return products.map((product)=>({slug:product.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const product=products.find((item)=>item.slug===slug);return product?{title:product.name,description:product.shortDescription}:{};}
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const product=products.find((item)=>item.slug===slug);if(!product)notFound();return <ProductDetail product={product}/>;}
