import React, {Component} from 'react';
import Sidebar from "../common/Sidebar";

class Profile extends Component{

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
                                <h2>Professional Experience</h2>
                                <blockquote className="describe_profile">
                                    <ul className="describe_profile_ul">
                                        <li className="describe_profile_li">메조미디어 데이터솔루션센터 (2018.07 ~ 현재)</li>
                                        <li className="describe_profile_li">CJ 올리브네트웍스 융합기술연구소 (2017.12 ~ 2018.02)</li>
                                        <li className="describe_profile_li">엠투소프트 기술연구소 (2016.12 ~ 2017.02)</li>
                                    </ul>
                                </blockquote>
                            </article>
                            <article>
                                <h2>Education</h2>
                                <blockquote className="describe_profile">
                                    <ul className="describe_profile_ul">
                                        <li className="describe_profile_li">Ajou University Department of Software (2011.03 ~
                                            2018.08)
                                        </li>
                                        <li className="describe_profile_li">Seoul Daejin High School (2007 ~ 2010)</li>
                                    </ul>
                                </blockquote>
                            </article>
                            <article>
                                <h2>Awards & Papers</h2>
                                <blockquote className="describe_profile">
                                    <ul className="describe_profile_ul">
                                        <li className="describe_profile_li">Ontology를 활용한 학생들의 학사 데이터 기반 진로 추천 시스템 연구 (KCSE
                                            2018)
                                        </li>
                                        <li className="describe_profile_li">립모션을 이용한 가상 현실 인테리어 애플리케이션 (2017 KCGS)</li>
                                        <li className="describe_profile_li">Virtual Reality를 이용한 인테리어 커뮤니티 서비스 (KICS 2017)
                                        </li>
                                        <li className="describe_profile_li">아주대학교 동계 인턴십 결과 발표회 우수상 (2017.02.28)</li>
                                    </ul>
                                </blockquote>
                            </article>
                            <article>
                                <h2>Others</h2>
                                <blockquote className="describe_profile">
                                    <ul className="describe_profile_ul">
                                        <li className="describe_profile_li">아주대학교 SW재능기부단</li>
                                        <li className="describe_profile_li">제 23회 Startup-Weekend</li>
                                    </ul>
                                </blockquote>
                            </article>
                        </div>
                        {/* contents end */}
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;