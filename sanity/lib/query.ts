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

export const PDF_CHATHISTORY_BY_ID_QUERY = defineQuery(`
  *[_type == "pdf" && _id == $pdfId][0]{
    chatHistory
  }
`);

export const PDF_BY_ID_QUERY = defineQuery(`
  *[_type == "pdf" && _id == $pdfId][0]{
    file{asset->{url,originalFilename}},name
  }
`);


export const USER_BY_EMAIL_QUERY = defineQuery(`
*[_type == "user-final" && email == $email && login_method == "credentials"][0]{
    _id,id,name,username,email,image,library[]->{_id,name},login_method,password
}`)

export const ALL_USER_BY_CREDENTIAL_QUERY = defineQuery(`
*[_type == "user-final" && login_method == credential][0]{
    _id,id,name,username,email,image,library[]->{_id,name},login_method,password
}`)