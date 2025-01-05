import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    DATABASE_URL: string;
}


const envSchema = joi.object({
  
     PORT: joi.number().required(),
     DATABASE_URL: joi.string().required()
})
.unknown(true);

const { error, value } = envSchema.validate( process.env );

if ( error ) {
     throw new Error(`config validation error ${ error.message }`)
}


const endVars: EnvVars = value;

export const envs = {
    port: endVars.PORT,
    databaseUrl: endVars.DATABASE_URL
}





