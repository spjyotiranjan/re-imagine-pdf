import {defineField, defineType} from "@sanity/types";


export const pdfSchema = defineType({
    name: "pdf",
    title: "PDFs",
    type: "document",
    fields: [
        defineField({
            name: "name",
            type: "string"
        }),
        defineField(({
            name: "file",
            type: "file"
        })),
        defineField({
            name: "chatHistory",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({
                            name: "question",
                            type: "string"
                        }),
                        defineField({
                            name: "answer",
                            type: "text"
                        }),
                        defineField({
                            name: "timestamp",
                            type: "datetime"
                        })
                    ]
                },
            ],
        })

    ]
})