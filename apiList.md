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