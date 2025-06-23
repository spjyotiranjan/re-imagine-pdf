import NextAuth from "next-auth"
import Google from "@auth/core/providers/google";
import {client} from "@/sanity/lib/client";
import {USER_BY_GITHUB_ID_QUERY} from "@/sanity/lib/query";
import {writeClient} from "@/sanity/lib/writeClient";
import {JWT, Session} from "@/sanity/schemaTypes/manualTypes.js";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
//
// {
//     iss: 'https://accounts.google.com',
//         azp: '94915569542-3l0cvrsjvit601o16ugnjmb2dg560tcv.apps.googleusercontent.com',
//     aud: '94915569542-3l0cvrsjvit601o16ugnjmb2dg560tcv.apps.googleusercontent.com',
//     sub: '113630207167570161591',
//     email: 'sp577152@gmail.com',
//     email_verified: true,
//     at_hash: 'P-OlpkQWPrT97kQA-4EnSw',
//     name: 'SP Jyotiranjan Sahoo',
//     picture: 'https://lh3.googleusercontent.com/a/ACg8ocKSdt65XNwmtl5vcjKPP3td2XQadtN_vR5dHlTX5EFTq7JtZPlH=s96-c',
//     given_name: 'SP Jyotiranjan',
//     family_name: 'Sahoo',
//     iat: 1750585033,
//     exp: 1750588633
// }

    callbacks: {
        async signIn({user,profile}){
            const existingUser = await client.fetch(USER_BY_GITHUB_ID_QUERY,{id: profile?.sub})
            if(!existingUser){
                await writeClient.create({
                    _type: "user",
                    id: user?.id,
                    name: user?.name,
                    username: user?.email?.split('@')[0],
                    email: user?.email,
                    image: user?.image,
                    library: []
                })
            }
            return true
        },

        async jwt ({token,account,profile,user}) : Promise<JWT>{
            let updatedToken = token as JWT
            if(account && profile){
                const userObtained = await client.fetch(USER_BY_GITHUB_ID_QUERY,{id: profile?.sub})
                updatedToken = {...token,id: userObtained?._id} as JWT
            }
            return updatedToken
        },

        async session({session,token}): Promise<Session>{
            return {
                ...session,id: token.id as string
            }
        }
    }
})

