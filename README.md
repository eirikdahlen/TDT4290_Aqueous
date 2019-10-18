# TDT4290 Aqeous

[![Build Status](https://travis-ci.org/eirikdahlen/TDT4290_Aqeous.svg?branch=master)](https://travis-ci.org/eirikdahlen/TDT4290_Aqeous) [![GitHub release](https://img.shields.io/github/v/release/eirikdahlen/TDT4290_Aqeous)](https://github.com/eirikdahlen/TDT4290_Aqeous/releases)

_The project is a part of the course TDT4290 Customer driven project in the autumn of 2019._

During this project, we will build a graphical user interface for controlling a [ROV](https://en.wikipedia.org/wiki/Remotely_operated_underwater_vehicle) with an Xbox controller built on web technologies ([Electron](https://electronjs.org/), Node, [React](https://reactjs.org/)). The GUI will incorporate a videofeed, ability to connect to a ROV simulation and use a subset of the [IMC protocol](https://www.lsts.pt/toolchain/imc) for communication.

###### This project is a continuation of last year group, which can be found [here](https://github.com/Kpro11/Aqeous), however rewritten with web technologies.

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

Run these command from your shell/terminal:

```bash
yarn # installs all dependencies
yarn electron-dev
```

## Contributing

Follow the conventions specified in [CONTRIBUTION](./CONTRIBUTING.md).
