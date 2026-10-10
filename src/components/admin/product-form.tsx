/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProductAction, updateProductAction, previewPriceAction } from "@/app/(admin)/admin/products/actions";

import { uploadProductImageAction } from "@/app/(admin)/admin/products/image-actions";

type ProductFormProps = {
  initialData?: any;
  categories: { id: string; name: string }[];
};

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pricingStrategy, setPricingStrategy] = useState(initialData?.pricingStrategy || "FIXED");
  
  const initialImages = (initialData?.images as any[])?.map((i: any) => ({ url: i.imageUrl, publicId: i.publicId || null })) || [];
  const [images, setImages] = useState<{url: string, publicId: string | null}[]>(initialImages);
  
  const [preview, setPreview] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>(initialData?.variants as any[] || []);
  const [uploadingImage, setUploadingImage] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError("");

    try {
      const newImages = [...images];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        
        const result = await uploadProductImageAction(formData) as any;
        if (result.error) {
          setError((prev) => prev ? prev + " | " + result.error : result.error);
        } else if (result.success) {
          newImages.push({ url: result.url, publicId: result.publicId });
        }
      }
      setImages(newImages);
    } catch (err) {
      setError("Image upload failed");
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = ""; // Reset file input
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    formData.append("variantsData", JSON.stringify(variants));
    formData.append("imagesData", JSON.stringify(images));

    try {
      const result = initialData 
        ? await updateProductAction(initialData.id, formData)
        : await createProductAction(formData);

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/admin/products");
        router.refresh();
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePreview(e: React.MouseEvent) {
    e.preventDefault();
    const form = document.getElementById("product-form") as HTMLFormElement;
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as any;
    
    const result = await previewPriceAction(data);
    if (result.success) {
      setPreview(result.data);
    } else {
      alert("Preview failed: " + result.error);
    }
  }

  return (
    <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-md border p-4 bg-card">
          <h2 className="font-semibold text-lg">Basic Information</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input name="name" defaultValue={initialData?.name} required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <Input name="slug" defaultValue={initialData?.slug} required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">SKU</label>
            <Input name="sku" defaultValue={initialData?.sku} required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select 
              name="categoryId" 
              defaultValue={initialData?.categoryId || ""}
              required
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Audience</label>
            <select 
              name="audience" 
              defaultValue={initialData?.audience || "GENERAL"}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
            >
              <option value="GENERAL">General</option>
              <option value="WOMEN">Women</option>
              <option value="MEN">Men</option>
              <option value="KIDS">Kids</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Short Description</label>
            <Input name="shortDescription" defaultValue={initialData?.shortDescription || ""} />
          </div>

          <div className="flex gap-6 pt-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="isActive" defaultChecked={initialData ? initialData.isActive : true} />
              Active (Published)
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="isFeatured" defaultChecked={initialData?.isFeatured} />
              Featured
            </label>
          </div>
        </div>

        <div className="space-y-4 rounded-md border p-4 bg-card">
          <h2 className="font-semibold text-lg">Pricing Configuration</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Pricing Strategy</label>
            <select 
              name="pricingStrategy" 
              value={pricingStrategy}
              onChange={(e) => setPricingStrategy(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
            >
              <option value="FIXED">FIXED</option>
              <option value="METAL_BASED">METAL_BASED</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">GST Percentage (%)</label>
            <Input type="number" step="0.01" name="gstPercentage" defaultValue={initialData?.gstPercentage || 3} required />
          </div>

          {pricingStrategy === "FIXED" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Fixed Price (₹) [Inclusive of GST]</label>
              <Input type="number" step="0.01" name="fixedPrice" defaultValue={initialData?.fixedPrice || ""} required />
            </div>
          ) : (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Metal Type</label>
                  <select name="metal" defaultValue={initialData?.metal || "GOLD"} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                    <option value="GOLD">Gold</option>
                    <option value="SILVER">Silver</option>
                    <option value="PLATINUM">Platinum</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Purity</label>
                  <select name="purity" defaultValue={initialData?.purity || "K22"} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                    <option value="K24">24K</option>
                    <option value="K22">22K</option>
                    <option value="K18">18K</option>
                    <option value="K14">14K</option>
                    <option value="SILVER925">Silver 925</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Net Weight (g)</label>
                <Input type="number" step="0.001" name="netWeight" defaultValue={initialData?.netWeight || ""} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Making Charge Type</label>
                  <select name="makingChargeType" defaultValue={initialData?.makingChargeType || "PER_GRAM"} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                    <option value="FIXED">Fixed</option>
                    <option value="PER_GRAM">Per Gram</option>
                    <option value="PERCENTAGE">Percentage</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Making Charge Value</label>
                  <Input type="number" step="0.01" name="makingChargeValue" defaultValue={initialData?.makingChargeValue || ""} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stone Charge (₹)</label>
                  <Input type="number" step="0.01" name="stoneCharge" defaultValue={initialData?.stoneCharge || "0"} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Wastage % (Informational)</label>
                  <Input type="number" step="0.01" name="wastagePercentage" defaultValue={initialData?.wastagePercentage || "0"} />
                </div>
              </div>

              <Button type="button" variant="outline" className="w-full mt-4" onClick={handlePreview}>
                Preview Live Price
              </Button>

              {preview && (
                <div className="mt-4 rounded-md bg-muted p-4 text-sm space-y-2">
                  <p><strong>Live Rate:</strong> ₹{preview.liveMetalRatePerGram}/g</p>
                  <p><strong>Metal Value:</strong> ₹{preview.metalValue.toFixed(2)}</p>
                  <p><strong>Making Charge:</strong> ₹{preview.makingCharge.toFixed(2)}</p>
                  <p><strong>Stone Charge:</strong> ₹{preview.stoneCharge.toFixed(2)}</p>
                  <p><strong>Subtotal:</strong> ₹{preview.subtotal.toFixed(2)}</p>
                  <p><strong>GST (3%):</strong> ₹{preview.gst.toFixed(2)}</p>
                  <p className="text-lg font-bold"><strong>Final Price:</strong> ₹{preview.finalPrice.toFixed(2)}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 rounded-md border p-4 bg-card">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Product Images</h2>
          <div className="relative">
            <Button type="button" variant="outline" size="sm" disabled={uploadingImage}>
              {uploadingImage ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
              Upload Image
            </Button>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
              onChange={handleImageUpload} 
              disabled={uploadingImage}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Select images to upload. First image will be the primary one.</p>
        
        <div className="space-y-3">
          {images.map((img, idx) => (
            <div key={idx} className="flex items-center gap-4 border p-2 rounded bg-muted/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="Preview" className="w-16 h-16 object-cover rounded" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm truncate text-gray-600">{img.url}</p>
                {img.publicId && <p className="text-xs text-gray-400 truncate">ID: {img.publicId}</p>}
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => {
                const newImages = images.filter((_, i) => i !== idx);
                setImages(newImages);
              }}>
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ))}
          {images.length === 0 && !uploadingImage && (
            <div className="py-8 text-center border-2 border-dashed rounded text-muted-foreground text-sm">
              No images uploaded
            </div>
          )}
        </div>
      </div>

      
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

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
          {initialData ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
