import {defineQuery} from "groq";


export const USER_BY_GITHUB_ID_QUERY = defineQuery(`
    *[_type == "user" && id == $id][0]{
        _id,id,name,username,email,image,library[]->{_id,name}
    }
    
`)
export const USER_BY_ID_QUERY = defineQuery(`
    *[_type == "user" && _id == $id][0]{
        _id,id,name,username,email,image,library[]->{_id,name}
    }
    
`)

export const PDF_CHATHISTORY_BY_ID_QUERY = defineQuery(`
  *[_type == "pdf" && _id == $pdfId][0]{
    chatHistory
  }
`);