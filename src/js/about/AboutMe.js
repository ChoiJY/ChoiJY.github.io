import React, {Component} from 'react';
import Sidebar from "../common/Sidebar";

class AboutMe extends Component{
    render(){
        return(
            <div className="Contents">
                <div className="container" id="wrapper">
                    <div className="row">
                        {/* sidebar start */}
                        <div className="background col-md-4 col-xs-12">
                            <Sidebar/>
                        </div>
                        {/* sidebar end */}
                        {/* contents starts */}
                        <div className="background col-md-8 col-xs-12">
                            <div className="contents">
                            </div>
                        </div>
                        {/* contents end */}
                    </div>
                </div>
            </div>
        );
    }
}

export default AboutMe;