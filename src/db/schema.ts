import { relations } from 'drizzle-orm';
import { pgTable, uuid, text, timestamp, varchar, json,integer, boolean } from 'drizzle-orm/pg-core'
import { url } from 'inspector';

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  password: text("password"),
  isVerified: boolean("is_verified").default(false),
  otp: text("otp"),
  otpExpiry: timestamp("otp_expiry"),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
    image: varchar("image", { length: 500 }), 
      position: integer("position").default(0), // 👈 ADD

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const distributors = pgTable("distributors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  visitUrl: varchar("url", { length: 500 }),
    position: integer("position").default(0), // 👈 ADD THIS

  image: varchar("image", { length: 500 }), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  description: text("description"),
  bannerImageUrl:text("banner_image_url"),
  shortDescription: text("short_description"),
  categoryId: uuid("category_id")
  .references(() => categories.id),
  brand: varchar("brand", { length: 255 }),
  sku: varchar("sku", { length: 100 }),
  productCode: text("product_code"),
  pdfUrl: text("pdf_url"),
  content: json("content"),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  imageUrl: text("image_url").notNull(),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productFeatures = pgTable("product_features", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  feature: text("feature").notNull(),
});



export const productSpecifications = pgTable("product_specifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  key: varchar("key", { length: 255 }).notNull(),
  value: text("value").notNull(),
});

export const relatedProducts = pgTable("related_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  relatedProductId: uuid("related_product_id")
    .references(() => products.id)
    .notNull(),
});

export const productDiTerms = pgTable("product_di_terms", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" }) 
    .notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productCategories = pgTable("product_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: uuid("category_id")
    .references(() => categories.id, { onDelete: "cascade" })
    .notNull(),
});

export const productsRelations = relations(products, ({ many, one }) => ({
  images: many(productImages),
  features: many(productFeatures),
  specifications: many(productSpecifications),
  relatedProductLinks: many(relatedProducts, { relationName: "product" }),
  relatedAsRelated: many(relatedProducts, { relationName: "relatedProduct" }),
  diTerms: many(productDiTerms),
  productCategories: many(productCategories),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productFeaturesRelations = relations(productFeatures, ({ one }) => ({
  product: one(products, {
    fields: [productFeatures.productId],
    references: [products.id],
  }),
}));

export const productSpecificationsRelations = relations(productSpecifications, ({ one }) => ({
  product: one(products, {
    fields: [productSpecifications.productId],
    references: [products.id],
  }),
}));

export const relatedProductsRelations = relations(relatedProducts, ({ one }) => ({
  product: one(products, {
    fields: [relatedProducts.productId],
    references: [products.id],
    relationName: "product",
  }),
  relatedProduct: one(products, {
    fields: [relatedProducts.relatedProductId],
    references: [products.id],
    relationName: "relatedProduct",
  }),
}));

export const productDiTermsRelations = relations(productDiTerms, ({ one }) => ({
  product: one(products, {
    fields: [productDiTerms.productId],
    references: [products.id],
  }),
}));

export const productCategoriesRelations = relations(productCategories, ({ one }) => ({
  product: one(products, {
    fields: [productCategories.productId],
    references: [products.id],
  }),
  category: one(categories, {
    fields: [productCategories.categoryId],
    references: [categories.id],
  }),
}));

export const productDistributor = pgTable("product_distributor",{
  id:uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
    distributorsId: uuid("distributor_id") .references(() => distributors.id)
    .notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow(),
})

export const banners = pgTable("banners", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  ctaText: varchar("cta_text", { length: 100 }),
  ctaLink: varchar("cta_link", { length: 500 }),
  imageUrl: text("image_url").notNull(),
  isActive: boolean("is_active").default(true),
  position: integer("position").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
