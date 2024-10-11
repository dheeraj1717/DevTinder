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
-POST /request/send/interested/:userId
-POST /request/send/ignored/:userId
-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId

## userRouter
- GET /connections
- GET /request/recieved
- GET /feed - Gets you the profiles of other users on the platform


status: ignored, interested, accepted, rejected