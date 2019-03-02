import React, {Component} from 'react';
import Sidebar from "../common/Sidebar";

class Study extends Component{

    function(){}

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
                            <article>
                                <h2>Programming Languages</h2>
                                <li className="describe_profile_li">Java (8)</li>
                                <li className="describe_profile_li">Javascript (ES6)</li>
                            </article>
                            <article>
                                <h2>Front-End</h2>
                                <ul className="describe_profile_ul">
                                    <li className="describe_profile_li">Bootstrap</li>
                                    <li className="describe_profile_li">React</li>
                                    <li className="describe_profile_li">Vue.JS</li>
                                    <li className="describe_profile_li">ES6</li>
                                </ul>
                            </article>
                            <article>
                                <h2>Back-End</h2>
                                <ul className="describe_profile_ul">
                                    <li className="describe_profile_li">Java Spring</li>
                                    <li className="describe_profile_li">Node.JS/Express</li>
                                </ul>
                            </article>
                        </div>
                        {/* contents end */}
                    </div>
                </div>
            </div>
        );
    }
}

export default Study;