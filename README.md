## Steps to Run

### Prerequisites:

1. Have your prof's server running in a terminal window. Steps to run server are given on the server repo.

2. Have an Android emulator running

3. Make sure `adb` is on PATH environment variable. Then check if your device is visible using `adb devices`.

4. Run this command `adb reverse tcp:2020 tcp:2020`. This will tell the device to connect to the server port which is 2020 so that it can make API calls.

### Running the App

1. Run the command `react-native run-android` in the code's root folder. This should open up a new Node.js window

2. If you get a redscreen error on the device saying *Could not connect to development server* then the Node.js window probably isn't running.

3. Double tap the **R** key when the app is running on the emulator to reload after making changes to the code. 

## Directory structure

### index.js
Entry point into the App. Just a small file that registers the root component.

### App.js
Main screen that shows up with the logo. This is where you define all the Activities that are used in the application. You define this under `createStackNavigator`.

### src
All the important code is in here.

* **src/components** - Inside this folder each Activity has its own folder

* **src/components/GetMovies** - Activity that you see when you click the Director button. Loads a list of movies that are stored on the server

* **src/components/GetMovieDetails** - Activity that you see when you click on a movie in the list

### assets

Images and shit

### .env

Place to store URLs

## What the dependencies do

Libraries that are imported have names that should be easily understandable. Just go to npmjs.com and enter any of the below names if you want to know what they do in detail.

* axios - HTTP Request and Response library

* react-native-config - Takes in the stuff from the .env file and makes it easily accessible

* react-navigation - Helps you move from screen to screen. This makes the root of the app using `createStackNavigator`.

* react-native-elements - Makes it easier to define some components
