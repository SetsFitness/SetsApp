import React, { Component } from 'react';
import { Label, Icon } from 'semantic-ui-react'
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import connect from "react-redux/es/connect/connect";
import {Player} from "video-react";
import { Storage } from 'aws-amplify';

type Props = {
    comment: {
        name: string,
        comment: string
    }
}

class Comment extends Component<Props> {
    state = {
        username: null,
        sentRequest: false,
        videoURL: null,
        imageURL: null
    };

    createCorrectMessage() {
        if (this.props.user.username === this.props.comment.name){
            //alert(this.props.comment.comment.substr(0, 40) === 'https://vastusofficial.s3.amazonaws.com/');
            //alert(this.props.comment.comment.substr(0, 12));
            if (this.props.comment.comment.substr(0, 12) === '/ClientFiles') {
                return (
                    <Label fluid pointing='right' className='u-bg--primary'>
                        <Player>
                            <source src={this.props.comment.comment} type="video/mp4" />
                        </Player>
                    </Label>
                );
            }
            else
            {
                return (
                    <div className='u-text-align--right'>
                        <strong className='u-display--block u-margin-bottom--1'>{this.props.comment.name}</strong>
                        <Label pointing='right' size='large' className='u-bg--primary u-color--white u-font-weight--normal'>{this.props.comment.comment}
                        </Label>
                    </div>
                );
            }
        }
        else {
            if (this.props.comment.comment.substr(0, 12) === 'ClientFile') {
                return (
                    <Label fluid pointing='left'>
                        <Player>
                            <source src={this.props.comment.comment} type="video/mp4"/>
                        </Player>
                    </Label>
                );
            }
            else {
                return (
                    <div className='u-text-align--left'>
                        <strong className='u-display--block u-margin-bottom--1'>{this.props.comment.name}</strong>
                        <Label pointing='left' size='large'
                               className='u-font-weight--normal'>{this.props.comment.comment}</Label>
                    </div>
                );
            }
            if (this.props.comment && this.props.comment.name) {
                const comment = this.props.comment.comment;
                const titleAttributes = this.props.comment.name.split("_");
                if (titleAttributes.length > 0) {
                    const name = titleAttributes[0];
                    if (this.state.username !== name) {
                        this.setState({username: name});
                    }
                    const ifSelf = name === this.props.user.username;
                    if (titleAttributes.length === 1) {
                        // Regular message
                        if (ifSelf) {
                            return (
                                <div className='u-text-align--right'>
                                    <strong className='u-display--block u-margin-bottom--1'>{name}</strong>
                                    <Label pointing='right' size='large'
                                           className='u-bg--primary u-color--white u-font-weight--normal'>{comment}
                                    </Label>
                                </div>
                            );
                        }
                        else {
                            return (
                                <div className='u-text-align--left'>
                                    <strong className='u-display--block u-margin-bottom--1'>{name}</strong>
                                    <Label pointing='left' size='large'
                                           className='u-font-weight--normal'>{comment}</Label>
                                </div>
                            );
                        }
                    }
                    else if (titleAttributes.length === 2) {
                        // Then this is going to include a link
                        const type = titleAttributes[1];
                        switch (type) {
                            case "videoLink":
                                if (!this.state.sentRequest) {
                                    this.state.sentRequest = true;
                                    Storage.get(comment).then((url) => {
                                        this.setState({videoURL: url})
                                    }).catch((error) => {
                                        console.error("ERROR IN GETTING VIDEO FOR COMMENT");
                                        console.error(error);
                                    });
                                }
                                if (ifSelf) {
                                    return (
                                        <div className='u-text-align--right'>
                                            <Label fluid pointing='right' className='u-bg--primary'>
                                                <Player>
                                                    <source src={this.state.videoURL} type="video/mp4"/>
                                                </Player>
                                            </Label>
                                        </div>
                                    );
                                }
                                else {
                                    return (
                                        <div className='u-text-align--left'>
                                            <Label fluid className='u-bg--primary' pointing='left'>
                                                <Player>
                                                    <source src={this.state.videoURL} type="video/mp4"/>
                                                </Player>
                                            </Label>
                                        </div>
                                    );
                                }
                            case "pictureLink":
                                if (!this.state.sentRequest) {
                                    this.state.sentRequest = true;
                                    Storage.get(comment).then((url) => {
                                        this.setState({imageURL: url})
                                    }).catch((error) => {
                                        console.error("ERROR IN GETTING IMAGE FOR COMMENT");
                                        console.error(error);
                                    });
                                }
                                if (ifSelf) {
                                    return (
                                        <Label className='ui right fluid' pointing='right' color='purple'>
                                            <div
                                                className="u-avatar u-avatar--large u-margin-x--auto u-margin-top--neg4"
                                                style={{backgroundImage: `url(${this.props.user.profilePicture})`}}>
                                                <Label as="label" htmlFor="proPicUpload" circular
                                                       className="u-bg--primaryGradient">
                                                    <Icon name="upload" className='u-margin-right--0' size="large"
                                                          inverted/>
                                                </Label>
                                                <input type="file" accept="video/*;capture=camcorder" id="proPicUpload"
                                                       hidden={true} onChange={this.setPicture}/>
                                            </div>
                                        </Label>
                                    );
                                }
                                else {
                                    return (
                                        <Label className='ui left fluid' pointing='left'>
                                            <div
                                                className="u-avatar u-avatar--large u-margin-x--auto u-margin-top--neg4"
                                                style={{backgroundImage: `url(${this.props.user.profilePicture})`}}>
                                                <Label as="label" htmlFor="proPicUpload" circular
                                                       className="u-bg--primaryGradient">
                                                    <Icon name="upload" className='u-margin-right--0' size="large"
                                                          inverted/>
                                                </Label>
                                                <input type="file" accept="video/*;capture=camcorder" id="proPicUpload"
                                                       hidden={true} onChange={this.setPicture}/>
                                            </div>
                                        </Label>
                                    );
                                }
                            default:
                                console.error("Comment type = " + type + " not recognized!");
                                break;
                        }
                    }
                    else {
                        // Improperly formatted message?
                    }
                }
                else {
                    // Received empty message?
                }
            }
            else {
                // Error'ed comment received
            }
        }
    }

    render() {
        return (
            <div className='u-margin-bottom--2'>
                {this.createCorrectMessage()}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (attributesList) => {
            dispatch(fetchUserAttributes(attributesList));
        },
        forceFetchUserAttributes: (variablesList) => {
            dispatch(forceFetchUserAttributes(variablesList));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);