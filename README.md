


## Todo
*   setup drizzle
*   add database models
    *   User
    *   Post
*   finish telegram sign in flow
    *   `generateCode`
    > Flow:
    >
    > 1: user start the bot and use /auth command
    >
    > 2: a new db entry inserted with 6-digit code that will be sent by bot
    >
    > 3: user inputs the code in web app
