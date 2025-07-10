import {defineQuery} from "groq";


export const USER_BY_AUTH_ID_QUERY = defineQuery(`
    *[_type == "user-final" && id == $id][0]{
        _id,id,name,username,email,image,library[]->{_id,name},login_method
    }
    
`)

export const USER_BY_ID_QUERY = defineQuery(`
    *[_type == "user-final" && _id == $id][0]{
        _id,id,name,username,email,image,library[]->{_id,name},login_method
    }
    
`)

export const PDF_BY_ID_QUERY = defineQuery(`
  *[_type == "pdf" && _id == $pdfId][0]{
    file{asset->{url,originalFilename}},name,chatHistory
  }
`);

export const USER_BY_EMAIL_QUERY = defineQuery(`
*[_type == "user-final" && email == $email && login_method == "credentials"][0]{
    _id,id,name,username,email,image,library[]->{_id,name},login_method,password
}`)