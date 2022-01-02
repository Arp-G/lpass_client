<p align="center">
  <img src="https://github.com/Arp-G/lpass_client/blob/master/assets/logo.png?raw=trueg" alt="LPass Client logo" height="150px" width="150px"/>
</p>

<h3 align="center"> <i>LPass Client - A simple lastpass client for desktop and mobile </i> </h3>
<hr/>

LPass client is a simple client for the [Lastpass](https://www.lastpass.com/) password manager.
It uses the [lastpass cli](https://github.com/lastpass/lastpass-cli) application to communicate with lastpass and contains a [progressive web app(pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) to easily present this information to the user.

LPass client allows you to view all your lastpass credentials, add new credentials and update or delete existing credentials. It has a simple UI and optional offline support.
**Since its a PWA it can be used from the browser, as a desktop app or on you android or ios device**

<i>LPass client is not an official app from last pass.</i>

<i>To use this app read the instructions in the [installation](#installation) section.</i>

## Demo
<p align="center">
  <img src="https://github.com/Arp-G/lpass_client/blob/master/lpassdemo.gif?raw=true" alt="LPass client demo gif"/>
</p>


## Tech Stack

- [Elixir](https://elixir-lang.org/) - Backend server that provides a [wrapper](https://github.com/Arp-G/lpass_client/blob/master/lib/lpass_client/cli.ex) over the lastpass cli app and exposes apis for the pwa.
- [React js](https://reactjs.org/) - For the progressive web app.
- [Typescript](https://www.typescriptlang.org/) - For the react app
- [Tailwind css](https://tailwindcss.com/) - For styling

<a name="installation"></a>
## Installation

**DISCLAIMER: If you choose to use this software do it at your own risk. In no event shall the authors be liable for any claim, damages, data loss or other liability, wether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**

In order to use LPass client you must deploy your own copy of the server, this is required since under the hood we are using the [lastpass cli](https://github.com/lastpass/lastpass-cli) application, having multiple such applications on a single server might lead to security issues.

**If you face any issues during deployment please [create an issue](https://github.com/Arp-G/lpass_client/issues) with the details and I will try to help you out and update this read me if required.**

**Prerequisites**

* Install elixir, refer to [this guide](https://elixir-lang.org/install.html)
* Install Phoenix, refer to [this guide](https://hexdocs.pm/phoenix/installation.html)
* Install Node js, refer to [this page](https://nodejs.org/en/download/)

Deploying your own server is easy and free of cost, keep reading to know how...

To host our backend server you can use any service you like, in the guide we will use [Gigalixir](https://www.gigalixir.com/) which makes it super easy to host elixir web apps for free.


*This repository also contains a docker file if you want to use docker for deployment
Our app does not need any database so that makes things simpler for us.*


* First clone this repository using: `git clone https://github.com/Arp-G/lpass_client.git`
* Next install the gigalixir client, refer to [this page](https://gigalixir.readthedocs.io/en/latest/getting-started-guide.html) for installation details.
* Make sure you create a free account in gigalixir.com (*Note: One gigalixir account can host only one free app*)
* Create a gigalixir app `APP_NAME=$(gigalixir create)`
* Add a the gigalixir git remote by using the git:remote command `gigalixir git:remote $APP_NAME`
* Create the following configuration variables
  
  Configurations:
  
  - **USERNAME** - Your name, the app will greet you with this name
  - **SERVER_PASSWORD** - The hashed server password.
                      In order to login to your server this additional password is required. You can easily generate this password hash running the following command in your    local machine.
                      Suppose you password is "secretpassword", run the following command to generate the password hash.
                      ```
                      mix server_password_hasher secretpassword
                      ```
  - **SECRET_KEY_BASE** - A secret key base for the backend server. You can easily generate such a key using the command `mix phx.gen.secret`
  - **SALT** - A salt is used for cryptographic purposes it can be again generate again using the command `mix phx.gen.secret`
  - **API_URL** - The url for your app, it will look like `https://$APP_NAME.gigalixirapp.com/` where "$APP_NAME" is the name of your gigalixir app.
  - **ALLOW_OFFLINE** - Optional, will default to false. If this is set to true then the app will save all you last pass data locally to provide offline support in case you don't have internet connectivity. 
  **[WARNING: This can have serious security implications, since the data is saved locally on your device and can be viewed by anyone with access to the device]**
  
The above configuration can be set using using commands like
```
gigalixir config:set USERNAME=Jhon
gigalixir config:set SERVER_PASSWORD=serverpasswordhash
gigalixir config:set SECRET_KEY_BASE=secretkeybase
gigalixir config:set SALT=asalt
gigalixir config:set API_URL=https://your-app.gigalixirapp.com
gigalixir config:set ALLOW_OFFLINE=false
```

* Now open you application using `gigalixir open`

Thats all we need, if you can't login or you are facing issues take a look at the below Gotchas.

Commands for some common operations on gigalixir like checking logs, ssh into server, restarting server, etc can be found [here](https://gigalixir.readthedocs.io/en/latest/getting-started-guide.html#what-s-next).

<hr/>

### App Installation

**To install the app on your computer.**

* On your computer, open Chrome.
* Visit your app's url `https://$APP_NAME.gigalixirapp.com/`
* At the top right of the address bar, click Install icon.
* Follow the onscreen instructions to install the PWA.

For more help regarding this refer to this [page](https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DDesktop).

<hr/>

**To install the app on your android device.**

* On your Android device, open Chrome Chrome.
* Visit your app's url `https://$APP_NAME.gigalixirapp.com/`
* Tap Install.
* Follow the on-screen instructions.

For more help regarding this refer to this [page](https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DAndroid)

<hr/>

**To install the app on your iOS device**

On iOS, you can install PWAs only in Safari
Navigate to your app's url in Safari. 
Then tap the ‘Share’ button, scroll down and tap ‘Add to Home Screen.’ Enter the name for the app then tap add. 
The PWA will show up on your home screen like a native iOS app.

Refer to [this video](https://www.youtube.com/watch?v=qtrRqzbXFtE) in case you need more help.

<hr/>

**How to create and install the app from an APK file**

This is also very simple, you can use [bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) for this.

Bubblewrap allows you to create a project for an Android application that launches an existing Progressive Web App (PWA).

Refer to [this guide](https://github.com/GoogleChromeLabs/bubblewrap/tree/main/packages/cli#setting-up-the-environment) for instruction to do this.

The following 3 main steps are required to generate an apk file.

* Install Bubblewrap `npm i -g @bubblewrap/cli`
* Initializing an Android Project `bubblewrap init --manifest https://$APP_NAME.gigalixirapp.com/manifest.json`
* Building the Android Project `bubblewrap build`

<hr/>

## Gotchas

* Can't login? Check these
  - If you have last pass multi factor authentication enabled make sure you allow access from your authenticator app when logging in via Lpass
  - Lastpass can block attempt to login from any unknown location, check you email and verify the new location. This can happen every time you deploy to gigalixir the server location might change, make sure you check your email in case you are not able to login.
* Note not getting saved properly? - This is a known issues and happens when there is a special character or line break in the note. There is an [active issue for this](https://github.com/Arp-G/lpass_client/issues/1).
* Saved credentials not getting synced? - Sometimes your saved or update credentials might not be immediately synced with the last pass server(this is a behavior from the lastpass cli app that is being used under the hood). Wait for sometime and then check again in such cases.


## Development

Want to contribute? Great!

Feel free to pick up an exiting issue or some new feature and I will be happy to review PRs and merge them.

Here are some pointers that can help you get started

* The elixir app has a [thin wrapper over the lastpass cli tool](https://github.com/Arp-G/lpass_client/blob/master/lib/lpass_client/cli.ex) and an [high level api](https://github.com/Arp-G/lpass_client/blob/master/lib/lpass_client/api.ex) to call the cli app.
* The backend exposes few [simple apis](https://github.com/Arp-G/lpass_client/blob/master/lib/lpass_client_web/controllers/credentials_controller.ex) for the PWA app to use.
* The backend elixir app does not have any database
* The [PWA](https://github.com/Arp-G/lpass_client/tree/master/assets/js) is build using typescript, react and tailwind css for styling.
* [ESbuild](https://esbuild.github.io/) is used along with a [custom script](https://github.com/Arp-G/lpass_client/blob/master/assets/build.js) to build assets.



## License

MIT