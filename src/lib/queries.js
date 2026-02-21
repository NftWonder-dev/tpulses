// GROQ queries for fetching data from Sanity

export const COLLECTIONS_QUERY = `*[_type == "collection"] | order(order asc) {
  _id,
  name,
  slug,
  emoji,
  description,
  image,
  order,
  "categoryCount": count(*[_type == "category" && references(^._id)])
}`;

export const COLLECTION_BY_SLUG_QUERY = `*[_type == "collection" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  emoji,
  description,
  image,
  "categories": *[_type == "category" && references(^._id)] | order(order asc) {
    _id,
    name,
    slug,
    description,
    image,
    order,
    "productCount": count(*[_type == "product" && references(^._id)])
  },
  "products": *[_type == "product" && references(^._id)] | order(order asc) {
    _id,
    name,
    slug,
    productCode,
    percentage,
    price,
    description,
    image,
    previewImages,
    order,
    collection->{
      _id,
      name,
      slug,
      emoji
    }
  }
}`;

export const CATEGORY_BY_SLUG_QUERY = `*[_type == "category" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  description,
  image,
  collection->{
    _id,
    name,
    slug
  },
  "subpacks": *[_type == "subpack" && references(^._id)] | order(order asc) {
    _id,
    name,
    slug,
    description,
    image,
    order,
    "productCount": count(*[_type == "product" && references(^._id)])
  },
  "products": *[_type == "product" && references(^._id)] | order(order asc) {
    _id,
    name,
    slug,
    productCode,
    percentage,
    price,
    description,
    image,
    previewImages,
    order,
    collection->{
      _id,
      name,
      slug,
      emoji
    }
  }
}`;

export const SUBPACK_BY_SLUG_QUERY = `*[_type == "subpack" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  description,
  image,
  category->{
    _id,
    name,
    slug,
    collection->{
      _id,
      name,
      slug
    }
  },
  "products": *[_type == "product" && references(^._id)] | order(order asc) {
    _id,
    name,
    slug,
    productCode,
    percentage,
    price,
    description,
    image,
    previewImages,
    order,
    collection->{
      _id,
      name,
      slug,
      emoji
    }
  }
}`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  productCode,
  percentage,
  description,
  price,
  image,
  previewImages,
  youtubeVideoId,
  decayCurve,        // ← ADD
  modes,             // ← ADD
  processedVariations, // ← ADD
  totalFiles,        // ← ADD
  s3FileKey,  // ← ADD THIS
  fileUrl,
  fileSize,
  fileFormat,
  lemonsqueezyVariantId,
  collection->{
    _id,
    name,
    slug
  },
  category->{
    _id,
    name,
    slug
  },
  subpack->{
    _id,
    name,
    slug
  },
  tags
}`;

export const ALL_PRODUCTS_QUERY = `*[_type == "product"] | order(collection->order asc, order asc) {
  _id,
  name,
  slug,
  productCode,
  percentage,
  price,
  description,
  image,
  previewImages,
  collection->{
    _id,
    name,
    slug,
    emoji
  },
  category->{
    _id,
    name,
    slug
  }
}`;

export const FEATURED_PRODUCTS_QUERY = `*[_type == "product" && featured == true] | order(order asc) [0...6] {
  _id,
  name,
  slug,
  productCode,
  percentage,
  price,
  image,
  previewImages,
  collection->{
    name,
    slug
  }
}`;
