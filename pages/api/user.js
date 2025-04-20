import { getLoginSession } from '../../lib/auth'
import { findUser } from '../../lib/user'

export default async function user(req, res) {
  try {
    // user = {
    //   id: 123453445,
    //   createdAt: Date.now(),
    //   "username":"DEepak",
    //   "hash": "hash",
    //   "salt": "salt",
    // }
    console.log("req  in USER API")
    // console.log(req)
    const session = await getLoginSession(req)
    console.log("Session in user API")
    // console.log(session)

    //  temp
    // createUser()
    // console.log(req)

    const user = (session && (await findUser(session))) ?? null

    console.log("user in user API")
    // console.log(user)

    res.status(200).json({ user })
  } catch (error) {
    console.log("ERROR in USER API")
    // console.error(error)
    res.status(500).end('Authentication token is invalid, please log in')
  }
}
