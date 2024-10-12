# DevTinder APIs

## authRouter

-POST /signup
-POST /login
-POST /logout

## profileRouter

-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

## connectionRequesttRouter

-POST /request/send/:status/:userId
-POST /request/review/:status/:requestId

## userRouter

- GET /connections
- GET /request/recieved
- GET /feed - Gets you the profiles of other users on the platform

status: ignored, interested, accepted, rejected

/feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)

/feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)
