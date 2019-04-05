import React, {Component} from 'react';
import Sidebar from "../common/Sidebar";

class Portfolio extends Component{
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
                                <article>
                                    <h2>Portfolio</h2>
                                    <iframe title="ppt" src="https://drive.google.com/file/d/12kCjbmYMbTgKzchvtKdMp-XjCBlQ15pd/preview" width="100%" height="500px"></iframe>
                                </article>
                                <article>
                                    <h2>Project demo 링크</h2>
                                    <blockquote className="blockquote">
                                        <ul>
                                            <li><a href="https://pf.kakao.com/_iSPdxl">인공지능 챗봇 'CJ 싸이먼챗'</a></li>
                                            <li><a href="http://m2soft.herokuapp.com/">Javascript 가상 키보드 라이브러리</a></li>
                                        </ul>
                                    </blockquote>
                                </article>
                            </div>
                        </div>
                        {/* contents end */}
                    </div>
                </div>
            </div>
        );
    }
}

export default Portfolio;