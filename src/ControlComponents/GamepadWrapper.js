import Gamepad from 'react-gamepad'
import React, {Component} from "react";

class GamepadWrapper extends Component {
    connectHandler(gamepadIndex) {
        console.log(`Gamepad ${gamepadIndex} connected!`)
    }
     
    disconnectHandler(gamepadIndex) {
        console.log(`Gamepad ${gamepadIndex} disconnected!`)
    }
     
    buttonChangeHandler(buttonName, down) {
        console.log(buttonName, down)
    }
     
    axisChangeHandler(axisName, value, previousValue) {
        console.log(axisName, value)
    }
     
    buttonDownHandler(buttonName) {
        console.log(buttonName, 'down')
    }
     
    buttonUpHandler(buttonName) {
        console.log(buttonName, 'up')
    }
     
    render() {
        return (
            <div>
            <Gamepad
            onConnect={this.connectHandler}
            onDisconnect={this.disconnectHandler}
        
            onButtonChange={this.buttonChangeHandler}
            onAxisChange={this.axisChangeHandler}
            />
            </div>
        )
    }
}
 
export default GamepadWrapper;