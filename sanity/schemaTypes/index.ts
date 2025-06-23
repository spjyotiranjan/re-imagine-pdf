import { type SchemaTypeDefinition } from 'sanity'
import {pdfSchema} from "@/sanity/schemaTypes/pdf";
import {userSchema} from "@/sanity/schemaTypes/user";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [pdfSchema,userSchema],
}
