const fs = require('fs');

const path = "src/app/(admin)/admin/products/actions.ts";
let content = fs.readFileSync(path, 'utf8');

// The replacement for Create
const createTarget = `
        images: {
          create: v.images?.map((url, index) => ({
            imageUrl: url,
            isPrimary: index === 0,
            sortOrder: index,
          })) || []
        }
      },
    });`;

const createReplacement = `
        images: {
          create: v.images?.map((url, index) => ({
            imageUrl: url,
            isPrimary: index === 0,
            sortOrder: index,
          })) || []
        },
        variants: {
          create: (() => {
            try {
              const vData = JSON.parse(data.variantsData as string || "[]");
              return vData.map((variant: any) => ({
                name: variant.name || "Size",
                value: variant.value,
                sku: variant.sku,
                weight: variant.weight || 0,
                priceAdjustment: variant.priceAdjustment || 0,
                isActive: true
              }));
            } catch (e) {
              return [];
            }
          })()
        }
      },
    });`;

// The replacement for Update
const updateTarget = `
      await tx.productImage.deleteMany({
        where: { productId: id }
      });

      await tx.product.update({`;

const updateReplacement = `
      await tx.productImage.deleteMany({
        where: { productId: id }
      });
      
      // For simplicity in this admin flow, delete and recreate variants
      // In a more complex system you'd diff them, but we want to avoid stale variants
      // Note: This drops historical connections if OrderItems heavily rely on invariant Variant IDs
      // But orderItem snapshots product name/sku so it's safe.
      await tx.productVariant.deleteMany({
        where: { productId: id }
      });

      await tx.product.update({`;

const updateTarget2 = `
          images: {
            create: v.images?.map((url, index) => ({
              imageUrl: url,
              isPrimary: index === 0,
              sortOrder: index,
            })) || []
          }
        },
      });`;

const updateReplacement2 = `
          images: {
            create: v.images?.map((url, index) => ({
              imageUrl: url,
              isPrimary: index === 0,
              sortOrder: index,
            })) || []
          },
          variants: {
            create: (() => {
              try {
                const vData = JSON.parse(data.variantsData as string || "[]");
                return vData.map((variant: any) => ({
                  name: variant.name || "Size",
                  value: variant.value,
                  sku: variant.sku,
                  weight: variant.weight || 0,
                  priceAdjustment: variant.priceAdjustment || 0,
                  isActive: true
                }));
              } catch (e) {
                return [];
              }
            })()
          }
        },
      });`;

content = content.replace(createTarget, createReplacement);
content = content.replace(updateTarget, updateReplacement);
content = content.replace(updateTarget2, updateReplacement2);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated actions.ts with variants support");
