const fs = require('fs');

const path = "src/components/admin/product-form.tsx";
let content = fs.readFileSync(path, 'utf8');

// I will just add variant state and fields to the ProductForm component
// Replace: const [preview, setPreview] = useState<any>(null);
// With:
// const [preview, setPreview] = useState<any>(null);
// const [variants, setVariants] = useState<any[]>(initialData?.variants || []);

// Replace: // Add images back into form data securely
// With:
// formData.append("variantsData", JSON.stringify(variants));
// // Add images back into form data securely

let newContent = content.replace(
  `const [preview, setPreview] = useState<any>(null);`,
  `const [preview, setPreview] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>(initialData?.variants || []);`
);

newContent = newContent.replace(
  `// Add images back into form data securely`,
  `formData.append("variantsData", JSON.stringify(variants));
    // Add images back into form data securely`
);

// Add the variant UI at the end before submit buttons
const variantUI = `
      <div className="space-y-4 rounded-md border p-4 bg-card">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Product Variants</h2>
          <Button type="button" variant="outline" size="sm" onClick={() => setVariants([...variants, { id: "new_" + Date.now(), name: "Size", value: "", sku: "", weight: 0, priceAdjustment: 0 }])}>
            <Plus className="mr-2 size-4" /> Add Variant
          </Button>
        </div>
        
        {variants.length === 0 ? (
          <p className="text-sm text-muted-foreground">No variants configured. Product will be sold as a single item.</p>
        ) : (
          <div className="space-y-4">
            {variants.map((v, idx) => (
              <div key={v.id || idx} className="grid grid-cols-12 gap-2 items-center bg-muted/30 p-2 rounded-md">
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground">Name (e.g. Size)</label>
                  <Input value={v.name} onChange={e => { const n = [...variants]; n[idx].name = e.target.value; setVariants(n); }} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground">Value (e.g. XL)</label>
                  <Input value={v.value} onChange={e => { const n = [...variants]; n[idx].value = e.target.value; setVariants(n); }} />
                </div>
                <div className="col-span-3">
                  <label className="text-xs text-muted-foreground">SKU</label>
                  <Input value={v.sku} onChange={e => { const n = [...variants]; n[idx].sku = e.target.value; setVariants(n); }} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground">Weight (g)</label>
                  <Input type="number" step="0.001" value={v.weight || ""} onChange={e => { const n = [...variants]; n[idx].weight = parseFloat(e.target.value) || 0; setVariants(n); }} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground">Price Adj (₹)</label>
                  <Input type="number" step="0.01" value={v.priceAdjustment || ""} onChange={e => { const n = [...variants]; n[idx].priceAdjustment = parseFloat(e.target.value) || 0; setVariants(n); }} />
                </div>
                <div className="col-span-1 flex justify-end pt-5">
                  <Button type="button" variant="ghost" size="icon" onClick={() => { const n = variants.filter((_, i) => i !== idx); setVariants(n); }}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">`;

newContent = newContent.replace(`<div className="flex justify-end gap-4">`, variantUI);

fs.writeFileSync(path, newContent, 'utf8');
console.log("Updated ProductForm with Variants");
