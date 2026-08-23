import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { ProductDetails } from "@/components/storefront/product/product-details";
import { ProductGallery } from "@/components/storefront/product/product-gallery";
import { ProductInfo } from "@/components/storefront/product/product-info";
import { RelatedProducts } from "@/components/storefront/product/related-products";

import {
  getProductBySlug,
  getProducts,
} from "@/features/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = (await getProducts())
    .filter(
      (item) =>
        item.categorySlug === product.categorySlug &&
        item.id !== product.id,
    )
    .slice(0, 4);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <>
      <section className="py-10 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <ProductGallery
              images={images}
              name={product.name}
            />

            <ProductInfo product={product} />
          </div>

          <div className="mt-16 sm:mt-24">
            <ProductDetails product={product} />
          </div>
        </Container>
      </section>

      <RelatedProducts products={relatedProducts} />
    </>
  );
}