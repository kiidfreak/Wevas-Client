import axios from '@axios'
// Local wrapper to new core implementation
import coreUseJwt from '@/@core/auth/jwt/useJwt'
import jwConfing from './jwtConfig'

const { jwt } = coreUseJwt(axios, jwConfing)
export default jwt
