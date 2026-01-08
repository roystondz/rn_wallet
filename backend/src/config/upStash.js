import { Redis } from '@upstash/redis'
import dotenv from "dotenv"
dotenv.config()

import {Ratelimit} from "@upstash/ratelimit"

const ratelimit = new Ratelimit({
    redis:Redis.fromEnv(),
    limiter:Ratelimit.slidingWindow(100,"120 s")
})

export default ratelimit;

