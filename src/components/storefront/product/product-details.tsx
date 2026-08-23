import type { StorefrontProduct } from "@/features/products/types/product";

type ProductDetailsProps = {
  product: StorefrontProduct;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="border-t border-border pt-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl">About this piece</h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
            {product.description}
          </p>
        </div>

        <div>
          <h2 className="font-display text-3xl">Product details</h2>

          <dl className="mt-5 divide-y divide-border border-t border-border">
            {product.material ? (
              <div className="flex items-center justify-between py-4">
                <dt className="text-sm text-muted-foreground">Material</dt>

                <dd className="text-sm font-medium">{product.material}</dd>
              </div>
            ) : null}

            {product.purity ? (
              <div className="flex items-center justify-between py-4">
                <dt className="text-sm text-muted-foreground">Purity</dt>

                <dd className="text-sm font-medium">{product.purity}</dd>
              </div>
            ) : null}

            {product.weight !== null ? (
              <div className="flex items-center justify-between py-4">
                <dt className="text-sm text-muted-foreground">Weight</dt>

                <dd className="text-sm font-medium">{product.weight}g</dd>
              </div>
            ) : null}

            <div className="flex items-center justify-between py-4">
              <dt className="text-sm text-muted-foreground">Category</dt>

              <dd className="text-sm font-medium">{product.category}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
