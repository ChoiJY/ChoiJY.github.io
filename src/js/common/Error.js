import React, {Component} from 'react';

class Error extends Component{
    render(){
        return(
            <div className="error" style={{background:'whitesmoke'}}>
                <p>Error 페이지입니다~~~~~ 잘못된 url로 접근하셨습니다.</p>
            </div>
        );
    }
}

export default Error;