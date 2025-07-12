"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { addProduct } from "@/actions/product";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
// import { addCar } from "@/actions/product";

const sizes = [
  "XX-Small", "X-Small", "Small", "Medium", "Large",
  "X-Large", "XX-Large", "3X-Large", "4X-Large",
];
const dressType = [
  "Gym Wear", "Casual Wear", "Formal Wear", "Party Wear", "Others"
];
const category = [
  "T-Shirts", "Shirts", "Pants", "Lowers", "Shorts", "Others"
];
// const productStatus = ["AVAILABLE", "UNAVAILABLE", "SOLD"];

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.coerce.number().int().min(1, "Price is required"),
  ratting: z.coerce.number().min(0).max(5),
  discount: z.coerce.number().int().min(0).max(100).optional(),
  category: z.string().min(1, "Category is required"),
  dressType: z.string().min(1, "Dress type is required"),
  description: z.string().min(1),
  status: z.enum(["AVAILABLE", "UNAVAILABLE", "SOLD"]),
  featured: z.boolean().default(false),
  colors: z
    .array(
      z.object({
        color: z.string().min(1, "Color is required"),
        sizes: z.array(z.string().min(1, "Sizes are required")),
        images: z.array(z.string().url()).optional(),
      })
    )
    .optional(),
});



function ImageSection({ index, colorData, handleImageDrop, uploadedImages, removeImage }) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleImageDrop(index, acceptedFiles),
    multiple: true,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
  });

  return (
    <div >
      <Label
        htmlFor="images"
      // className={imageError ? "text-red-500" : ""}
      >
        Images{" "}
        {/* {imageError && <span className="text-red-500">*</span>} */}
      </Label>

      <div className="mt-2">
        <div
          {...getRootProps({
            className: `border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition ${false ? "border-red-500" : "border-gray-300"
              }`
          })}

        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-gray-400 mb-3" />
            <span className="text-sm text-gray-600">
              Drag & drop or click to upload multiple images
            </span>
            <span className="text-xs text-gray-500 mt-1">
              (JPG, PNG, WebP, max 5MB each)
            </span>
          </div>
        </div>
        {false && (
          <p className="text-xs text-red-500 mt-1">{false}</p>
        )}
        {/* {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )} */}
      </div>

      {/* Image Previews */}
      {uploadedImages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">
            Uploaded Images ({uploadedImages.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={image}
                  alt={`Car image ${index + 1}`}
                  height={50}
                  width={50}
                  className="h-28 w-full object-cover rounded-md"
                  priority
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const AddProductForm = () => {

  const router = useRouter();
  // const [uploadedImages, setUploadedImages] = useState([]);
  const [colorSections, setColorSections] = useState([
    { id: Date.now(), color: '', sizes: [], images: [] },
  ]);
  const [imageError, setImageError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      brand: "",
      price: 0,
      ratting: 0,
      category: "",
      dressType: "",
      description: "",
      discount: 0,
      size: [],
      colors: [],
      featured: false,
      status: "AVAILABLE",
    },
  });

  // Custom hooks for API calls
  const {
    loading: addProductLoading,
    fn: addProductFn,
    data: addProductResult,
  } = useFetch(addProduct);

  useEffect(() => {
    if (addProductResult?.success) {
      toast.success("Product added successfully");
      router.push("/admin/product");
    }
  }, [addProductResult, router]);


  // function to add extra color section
  const handleAddColor = () => {
    setColorSections(prev => [
      ...prev,
      { id: Date.now(), color: '', sizes: [], images: [] },
    ]);
  };

  // function to remove color section
  const handleRemoveColor = (id) => {
    setColorSections(prev => prev.filter(section => section.id !== id));
  };

  // form submission
  const onSubmit = async (data) => {
    setValue("colors", colorSections.map(section => ({
      color: section.color,
      sizes: section.sizes,
      images: section.images,
    })));

    // now get updated form data
    const finalData = {
      ...data,
      colors: colorSections.map(section => ({
        color: section.color,
        sizes: section.sizes,
        images: section.images,
      })),
    };

    // Call the addCar function with our useFetch hook
    await addProductFn(finalData);
  };



  // function to handel image when drop
  const handleImageDrop = (index, files) => {

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        // toast.error(`${file.name} exceeds 5MB limit and will be skipped`);
        console.log("5mb")
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        // Process the images
        const newImages = [];
        validFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            newImages.push(e.target.result);

            // When all images are processed
            if (newImages.length === validFiles.length) {
              const updated = [...colorSections];
              updated[index].images = [...updated[index].images, ...newImages];
              setColorSections(updated);
              // setUploadedImages((prev) => [...prev, ...newImages]);
              setUploadProgress(0);
              setImageError("");
              // toast.success(
              //   `Successfully uploaded ${validFiles.length} images`
              // );
            }
          };
          reader.readAsDataURL(file);
        });
      }
    }, 200);


  };


  // Remove image from upload preview
  const removeImage = (colorIndex, imageIndex) => {
  const newSections = [...colorSections];
  newSections[colorIndex].images = newSections[colorIndex].images.filter((_, i) => i !== imageIndex);
  setColorSections(newSections);
};



  function isValidColor(color) {
    if (!color) return false;
    color = color.toLowerCase().trim();

    const cssNamedColors = new Set([
      "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black",
      "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse",
      "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan",
      "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen",
      "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue",
      "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue",
      "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia",
      "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "grey", "honeydew",
      "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen",
      "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray",
      "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue",
      "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen",
      "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple",
      "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred",
      "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive",
      "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise",
      "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple",
      "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown",
      "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey",
      "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet",
      "wheat", "white", "whitesmoke", "yellow", "yellowgreen"
    ]);

    if (cssNamedColors.has(color)) return true;

    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)) return true;
    if (/^rgb(a)?\((\s*\d+\s*,){2,3}\s*(\d+|\d*\.\d+)\s*\)$/.test(color)) return true;

    return false;
  }




  return (
    <Card className="w-full max-w-4xl mx-auto ">
      <CardHeader>
        <CardTitle>New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="grid sm:grid-cols-2 grid-cols-1 gap-5">

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-800">Name</Label>
              <Input placeholder="e.g. Black printed shirt" {...register("name")} className={errors.name ? "border-red-500" : ""} />
              {errors.name && (
                <p className="text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}

            </div>

            {/* Brand */}
            <div className="space-y-2">
              <Label htmlFor="brand" className="text-gray-800">Brand</Label>
              <Input placeholder="e.g. H&M" {...register("brand")} className={errors.brand ? "border-red-500" : ""} />
              {errors.name && (
                <p className="text-xs text-red-500">
                  {errors.brand.message}
                </p>
              )}

            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-800">Price</Label>
              <Input type='number' placeholder="e.g. 500" {...register("price")} className={errors.price ? "border-red-500" : ""} />
              {errors.price && (
                <p className="text-xs text-red-500">
                  {errors.price.message}
                </p>
              )}

            </div>

            {/* Discount */}
            <div className="space-y-2">
              <Label htmlFor="discount" className="text-gray-800">Discount%</Label>
              <Input type='number' placeholder="e.g. 500" {...register("discount")} className={errors.discount ? "border-red-500" : ""} />
              {errors.discount && (
                <p className="text-xs text-red-500">
                  {errors.discount.message}
                </p>
              )}

            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-800">Category</Label>
              <Select
                onValueChange={(value) => setValue("category", value)}
                defaultValue={getValues("category")}
              >
                <SelectTrigger
                  className={`w-full ${errors.dressType ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select Category type" />
                </SelectTrigger>
                <SelectContent>
                  {category.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-red-500">
                  {errors.category.message}
                </p>
              )}

            </div>

            {/* Dress Type */}
            <div className="space-y-2 ">
              <Label htmlFor="dressType" className="text-gray-800">Dress Type</Label>
              <Select
                onValueChange={(value) => setValue("dressType", value)}
                defaultValue={getValues("dressType")}
              >
                <SelectTrigger
                  className={`w-full ${errors.dressType ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select Dress type" />
                </SelectTrigger>
                <SelectContent>
                  {dressType.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dressType && (
                <p className="text-xs text-red-500">
                  {errors.dressType.message}
                </p>
              )}

            </div>

          </div>

          {/* Didcription */}
          <div className="space-y-2 ">
            <Label htmlFor="discription" className="text-gray-800">Discription</Label>
            <Textarea placeholder="Description" {...register("description")} />
            {errors.dressType && (
              <p className="text-xs text-red-500">
                {errors.dressType.message}
              </p>
            )}

          </div>

          <Label className="block mt-4 font-semibold">Colors</Label>

          {/* color section mapping */}
          {colorSections.map((section, idx) => (
            <div key={section.id} className="border p-4 rounded-md space-y-2 relative">

              <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-between items-center ">
                  <div className="flex items-center gap-2">
                    <span>Color</span>
                    {section.color
                      ? (<span
                        className="w-5 h-5 rounded-full border shadow"
                        style={{
                          backgroundColor: isValidColor(section.color) ? section.color : "white"
                        }}
                      />)
                      : <span>{idx + 1}</span>
                    }
                  </div>

                  {/* Button to remove color section */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveColor(section.id)}
                  >
                    <Trash2 />
                  </Button>

                </div>

                {/* color name */}
                <Input
                  placeholder="Color Name"
                  value={section.color}
                  onChange={(e) => {
                    const newSections = [...colorSections];
                    newSections[idx].color = e.target.value;
                    setColorSections(newSections);
                  }}
                />

                {/* Sizes */}
                <div className="grid sm:grid-cols-5 grid-cols-3 sm:gap-x-5 gap-x-2 sm:gap-y-3 gap-y-1">
                  {sizes.map((item) => (
                    <Button
                      type="button"
                      key={item}
                      variant={section.sizes.includes(item) ? "default" : "outline"}
                      className="cursor-pointer sm:text-sm text-xs"

                      onClick={() => {
                        const newSections = [...colorSections];
                        const currentSizes = newSections[idx].sizes;

                        if (currentSizes.includes(item)) {
                          newSections[idx].sizes = currentSizes.filter(s => s !== item);
                        } else {
                          newSections[idx].sizes = [...currentSizes, item];
                        }

                        setColorSections(newSections);
                      }}
                    >
                      {item}
                    </Button>
                  ))}


                </div>

                {/* Image drop section */}
                <ImageSection
                  key={idx}
                  index={idx}
                  colorData={section}
                  handleImageDrop={handleImageDrop}
                  uploadedImages={section.images}
                  removeImage={(imageIndex) => removeImage(idx, imageIndex)}
                />


              </div>
            </div>
          ))}

          {/* Button to submit and add new color secton */}
          <div className="flex sm:gap-5 gap-2">
            <Button type="button" onClick={handleAddColor} className="sm:text-sm text-xs">Add New Color</Button>
            <Button
              type="submit"
              className="w-auto sm:text-sm text-xs"
              disabled={addProductLoading}
            >
              {addProductLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Product...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

