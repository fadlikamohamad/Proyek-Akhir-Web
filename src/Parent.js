import React, {Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import hcbgImage from "./images/skin-cancer-bg.jpg";

const Parent = (props) => {
    return(
        <Fragment>
            <div 
                class="bg_image"
                style={{
                    backgroundImage: 'url('+hcbgImage+')',
                    backgroundSize: "cover",
                    height: "100vh",
                    color: "#f5f5f5"
                }}
            >
                
                {props.children}
            </div> 
        </Fragment>
    )
}

export default Parent;