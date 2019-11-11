# TDT4290 Aqeous

[![Build Status](https://travis-ci.org/eirikdahlen/TDT4290_Aqeous.svg?branch=master)](https://travis-ci.org/eirikdahlen/TDT4290_Aqeous) [![GitHub release](https://img.shields.io/github/v/release/eirikdahlen/TDT4290_Aqeous)](https://github.com/eirikdahlen/TDT4290_Aqeous/releases)

_The project is a part of the course TDT4290 Customer driven project in the autumn of 2019._

During this project, we will build a graphical user interface for controlling a [ROV](https://en.wikipedia.org/wiki/Remotely_operated_underwater_vehicle) with an XBOX controller built on web technologies ([Electron](https://electronjs.org/), Node, [React](https://reactjs.org/)).

The GUI will incorporate a videofeed, ability to connect to a ROV simulation and use a subset of the [IMC protocol](https://www.lsts.pt/toolchain/imc) for communication.

###### This project is a continuation of a customer-driven project from last year, which can be found [here](https://github.com/Kpro11/Aqeous), however rewritten with web technologies.

## Prerequisites

We recommend [Visual Studio Code](https://code.visualstudio.com/) as IDE/text editor.

### Windows

We recommend Git Bash, which can be downloaded [here](https://git-scm.com/downloads), as shell/command promt.

You also need to download these if you haven't already.

1. [`node`](https://nodejs.org/en/)
2. [`yarn`](https://yarnpkg.com/lang/en/)

### MacOS

We recommend the [package manager Homebrew](https://brew.sh/index_nb) for downloadning packages as well as keeping track of dependencies. When you have that installed, all you need to do is to run

```bash
brew install yarn
```

## How to run locally

First you need to clone this repository using Git:

```
git clone https://github.com/eirikdahlen/TDT4290_Aqeous.git
cd TDT4290_Aqeous
```

Then run these commands from your shell/terminal:

```bash
yarn install # installs all dependencies
yarn electron-rebuild # rebuilds dependencies to be compatible with current electron version
yarn electron-dev # Starts development server and runs project
```

It is sufficient to only run `yarn electron-dev` if the project is already set up and no new dependencies are added.

## Packaging

### Windows

Run these commands from your shell/terminal:

```bash
yarn install
yarn package-win
yarn installer-win
```

To install, find the `release-builds` folder that is created, and run `AqeousInstaller.exe` as administrator.

After the installation, the application is located at `C:\Users\<username>\AppData\Local\aqeous`.

## Installation

To install the software, go to [releases](https://github.com/eirikdahlen/TDT4290_Aqeous/releases) in the Github repository.
Every release of the product is available here as an installable `.exe` file (for Windows), along with the features included in each release.

Simply download the `AqeousInstaller.exe` file, run as Administrator and run the program as any other desktop application.

## Connecting two computers via Ethernet

It is possible to test the solution by connecting two computers together via Ethernet.
By doing the following steps, two computers can communicate over TCP by using the IMC message protocol.

1. Follow the first four steps in [this guide](https://www.maketecheasier.com/connect-two-windows-computer-on-lan/). Be sure to use different IP-adresses for the two computers.
2. To test that step 1 was successful:
   1. Click `Start` and enter `cmd` in the Start Search field
   2. Enter `ping 192.168.0.x`, where x depends on what IP-address you want to communicate with. Press `Enter`.
   3. If `Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)` displays, the connection is good and the signal successfully reached the other computer over TCP.
3. Open the Aqeous-program on both computers.
4. Computer 1 opens the tab named `Simulator` --> `IMC-ROV Mockup` and clicks `Start Server` in the popup-window. Computer 1 now represents the ROV.
5. Computer 2 opens the tab named `ROV` --> `Settings` and under `Message Protocol` chooses `IMC`. Click `Update`.
6. Computer 2 opens the tab named `ROV` and click `Connect to TCP`. Computer 2 now represents the ROV-operator.
7. The connection is now established and the ROV-operator can control the mocked ROV.

## Contributing

Follow the conventions specified in [CONTRIBUTION](./CONTRIBUTING.md).
