import React from "react";

class ChooseSimulator extends React.Component {
    handleClick(e) {
        console.log("File clicked");
    }
    
    render() {
      return (
        <div>
          <input id="myInput" type="file" ref={(ref) => this.myInput = ref} style={{ display: 'none' }} />
          <button 
            onClick={this.handleClick.bind(this)}
            />
        </div>
      );
    }
  }

  export default ChooseSimulator;