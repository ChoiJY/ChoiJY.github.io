import React, {Component} from 'react';
import githubLogo from '../../img/github.svg';
import linkedinLogo from '../../img/linkedin.svg';
import emailLogo from '../../img/mail.svg';
import '../../css/style.css';

/*
    Footer section
 */
class Footer extends Component {

    sendEmail() {
        const emailAddress = 'neocjy@naver.com';
        window.location.href = 'mailto:' + emailAddress;
    }

    render() {
        return (
            <div className="Footer">
                <div className="container-fluid">
                    <div className="links">
                        <a className="links_items" href= "/" onClick={this.sendEmail.bind(this)}><img src={emailLogo} alt="이메일"></img></a>
                        <a className="links_items" href="https://github.com/ChoiJY"><img src={githubLogo} alt="Go to github"></img></a>
                        <a className="links_items"
                           href="https://www.linkedin.com/in/%EC%A4%80%EC%98%81-%EC%B5%9C-169844163/"><img
                            src={linkedinLogo} alt="go to linkedin"></img></a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;