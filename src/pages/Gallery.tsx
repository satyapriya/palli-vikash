import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Plus, Loader2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as GalleryService from "@/services/gallery";
import { GalleryImage } from "@/types/gallery";
import Layout from "@/components/layout/Layout";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  Button
} from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";



const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  imageFile: z.custom<File>((val) => val instanceof File && val.size > 0, "Image is required"),
});

type FormData = z.infer<typeof formSchema>;

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [currentImageId, setCurrentImageId] = useState("");
  const queryClient = useQueryClient();


  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: GalleryService.getCategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => GalleryService.createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const imagesQuery = useQuery({
    queryKey: ['galleryImages'],
    queryFn: () => GalleryService.getGalleryImages(),
  });

  const allImages = imagesQuery.data ?? [];
  const filteredImages = activeCategory === 'All' 
    ? allImages 
    : allImages.filter(img => img.category === activeCategory);


  const addMutation = useMutation({
    mutationFn: (data: FormData) => {
      const newData = {
        title: data.title,
        category: data.category,
        description: data.description,
        imageFile: data.imageFile as File,
      } as const;
      return GalleryService.addGalleryImage(newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      form.reset();
      setOpen(false);
      setCategoryValue('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: GalleryService.deleteGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      setLightboxOpen(false);
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      imageFile: undefined as any,
    },
  });

  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(""); 

  const openLightbox = (index: number) => {
    const image = filteredImages[index];
    if (image?.id) {
      setCurrentImageId(image.id);
    }
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-primary-foreground/10 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              Gallery
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Our Work in Pictures
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed">
              A visual journey through our programs, events, and the communities we serve.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeader
          subtitle="Photo Gallery"
          title="Capturing Moments of Change"
          description="Browse through photos from our health camps, education programs, women empowerment initiatives, and more."
        />

        <div className="flex justify-end mb-8">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Gallery Image</DialogTitle>
                <DialogDescription>
                  Fill in the details and upload an image. Image will be uploaded to Cloudinary and saved to Firebase.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => addMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter image description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Category</FormLabel>
                        <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between capitalize"
                              onClick={() => form.trigger("category")}
                            >
                              {form.watch("category") || categoryValue
                                ? categoriesQuery.data?.includes(form.watch("category") || categoryValue)
                                  ? form.watch("category") || categoryValue
                                  : `+ Create "${categoryValue}"`
                                : "Select or create category..."}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0 max-h-96 overflow-y-auto">
                            <Command>
                              <CommandInput placeholder="Search category..." onValueChange={setCategoryValue} />
                              {categoriesQuery.data?.some((category) => category.toLowerCase().includes(categoryValue.toLowerCase())) || !categoryValue ? (
                                <>
                                  <CommandEmpty>No category found.</CommandEmpty>
                                  <CommandGroup>
                                    {categoriesQuery.data?.map((category) => (
                                      <CommandItem
                                        key={category}
                                        value={category}
                                        onSelect={() => {
                                          form.setValue("category", category);
                                          setCategoryValue(category);
                                          form.trigger("category");
                                          setComboboxOpen(false);
                                        }}
                                      >
                                        {category}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </>
                              ) : (
                                <>
                                  <CommandEmpty>No category found.</CommandEmpty>
                                  <CommandGroup>
                                    <CommandItem
                                      onSelect={async () => {
                                        await createCategoryMutation.mutateAsync(categoryValue);
                                        form.setValue("category", categoryValue);
                                        form.trigger("category");
                                        setComboboxOpen(false);
                                      }}
                                    >
                                      Create "{categoryValue}"
                                    </CommandItem>
                                  </CommandGroup>
                                </>
                              )}
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageFile"
                    render={() => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                form.setValue("imageFile", file, { shouldValidate: true });
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={addMutation.isPending || !form.formState.isValid}>
                      {addMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Save Image'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['All', ...(categoriesQuery.data ?? [])].map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              className="rounded-full px-4 py-2"
              onClick={() => {
                setActiveCategory(category);
              }}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagesQuery.isLoading ? (
            <p className="col-span-full text-center py-8 text-muted-foreground">Loading images...</p>
          ) : filteredImages.length === 0 ? (
            <p className="col-span-full text-center py-8 text-muted-foreground">No images found. Add your first image!</p>
          ) : (
            filteredImages.map((image, index) => (
              <div
                key={image.id || index}
                onClick={() => openLightbox(index)}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-card text-sm font-medium">{image.category}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-card hover:text-card/80 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 p-2 text-card hover:text-card/80 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 p-2 text-card hover:text-card/80 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <button
            onClick={async () => {
              if (confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
                deleteMutation.mutate(currentImageId);
              }
            }}
            className="absolute top-20 right-4 p-3 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full transition-colors shadow-lg"
            aria-label="Delete image"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>

          <img
            src={filteredImages[currentImageIndex]?.imageUrl}
            alt={filteredImages[currentImageIndex]?.title}
            className="max-w-full max-h-[80vh] rounded-lg"
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-card text-center">
            <p className="font-medium">{filteredImages[currentImageIndex]?.title}</p>
            <p className="text-sm text-card/70">
              {currentImageIndex + 1} / {filteredImages.length}
            </p>
            <p className="text-xs text-card/50 mt-1">{filteredImages[currentImageIndex]?.category}</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Gallery;
